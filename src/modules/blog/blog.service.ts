import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlogEntity } from "./entity/blog.entity";
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from "./dto/blog.dto";
import { BlogStatus } from "./enums/status.enum";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BadRequestMessage, NotFoundMessage, PublicMessage } from "src/common/types/enums/message.enum";
import { createSlug, randomId } from "src/common/utils/function.util";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";
import { isArray } from "class-validator";
import { CategoryService } from "../category/category.service";
import { BlogCategoryEntity } from "./entity/blog-category.entity";
import { EntityNames } from "../../common/types/enums/entity.enum";
import { BlogLikeEntity } from "./entity/like.entity";
import { BlogBookMarkEntity } from "./entity/book-mark.entity";

@Injectable({ scope : Scope.REQUEST})
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity) private readonly blogRepository : Repository<BlogEntity>,
        @InjectRepository(BlogCategoryEntity) private readonly blogCategoryRepository : Repository<BlogCategoryEntity>,
        @InjectRepository(BlogLikeEntity) private readonly blogLikeRepository : Repository<BlogLikeEntity>,
        @InjectRepository(BlogBookMarkEntity) private readonly bookmarkRepository : Repository<BlogBookMarkEntity>,
        @Inject(REQUEST) private readonly req : Request,
        private readonly categoryService : CategoryService
    ){}

    async create(blogDto : CreateBlogDto){
        const user = this.req.user
        let {title, slug, content, description, image, timeForStudy, categories} = blogDto
        if (!isArray(categories) && typeof categories === "string"){
            categories = categories.split(",")
        } else if (!isArray(categories)){
            throw new BadRequestException(BadRequestMessage.InvalidCategories)
        }

        let slugData = blogDto.slug = slug ?? title
        blogDto.slug = createSlug(slugData) 
        const isExistSlug = await this.checkBlogBySlug(slug)
        if (isExistSlug) {
            slug += `-${randomId()}`
        }
        let blog = this.blogRepository.create({
            title,
            slug,
            description,
            content,
            image,
            status : BlogStatus.Draft,
            timeForStudy,
            authorId : user.id
        })
        blog = await this.blogRepository.save(blog)
        for (const categoryTitle of categories) {
            let category = await this.categoryService.findOneByTitle(categoryTitle)
            if (!category){
                category = await this.categoryService.insertByTitle(categoryTitle)
            }
            await this.BlogCategoryRepository.insert({
                blogId : blog.id,
                categoryId : category.id
            })
        }
        return {
            message : PublicMessage.Created
        }
    }

    private async checkBlogBySlug(slug : string) {
        const blog = await this.blogRepository.findOneBy({slug})
        return blog
    }

    private async checkExistsBlogById(id : number){
        const blog = await this.blogRepository.findOneBy({id})
        if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundPost)
        return blog
    }

    async getMyBlogs() {
        const {id} = this.req.user
        return this.blogRepository.find({
            where : {
                authorId : id
            },
            order : {
                id : 'DESC'
            }
        })
    }

    async delete(id : number){
        const blog = await this.checkExistsBlogById(id)
        await this.blogRepository.delete({id})

        return {
            message : PublicMessage.Deleted
        }
    }

    async blogList(paginationDto : PaginationDto, filterDto : FilterBlogDto) {
        const {limit, page, skip} = paginationSolver(paginationDto)
        let {category, search} = filterDto
        let where:string = '';
        if (category){
            category = category.toLowerCase()
            if (where.length > 0) where +=' AND '
            where += 'category.title = LOWER(:category)'
        }
        if (search){
            if (where.length > 0) where +=' AND '
            search = `%${search.toLowerCase()}%`
            where += 'LOWER(CONCAT(blog.title, blog.description, blog.content)) ILIKE :search'
        }
        const [blogs, count] = await this.blogRepository.createQueryBuilder(EntityNames.Blog)
          .leftJoin('blog.categories', "categories")
          .leftJoin('categories.category', "category")
          .leftJoin('blog.author', 'author')
          .leftJoin('author.profile', 'profile')
          .addSelect(['categories.id', 'categories.title', 'author.username', 'author.id', 'profile.nickName'])
          .where(where,{category, search})
          .loadRelationCountAndMap('blog.likes', 'blog.likes')
          .loadRelationCountAndMap('blog.bookmarks', 'blog.bookmarks')
          .orderBy('blog.id', 'DESC')
          .skip(skip)
          .take(limit)
          .getManyAndCount()

        return {
            pagination : paginationGenerator(count, page, limit),
            blogs
        }
    }

    async update(id : number, blogDto : UpdateBlogDto){
        const user = this.req.user
        let {title, slug, content, description, image, timeForStudy, categories} = blogDto
        const blog = await this.checkExistsBlogById(id)

        if (!isArray(categories) && typeof categories === "string"){
            categories = categories.split(",")
        } else if (!isArray(categories)){
            throw new BadRequestException(BadRequestMessage.InvalidCategories)
        }

        let slugData = blogDto.slug = slug ?? title
        blogDto.slug = createSlug(slugData)

        let slugData = null
        if (title) {
            slugData = title
            slug = createSlug(slugData)
            blog.title = title
        }
        if (slug) slugData = slug
        if (slugData) {
            const isExistSlug = await this.checkBlogBySlug(slug)
            if (isExistSlug && isExistSlug.id !== id) {
                slug += `-${randomId()}`
            }
            blog.slug = slug
        }
        if (description) blog.description = description
        if (content) blog.content = content
        if (image) blog.title = image
        if (timeForStudy) blog.timeForStudy = timeForStudy
        await this.blogRepository.save(blog)

        if (categories && isArray(categories) && categories.length > 0)
            await this.blogCategoryRepository.delete({blogId : blog.id})

        for (const categoryTitle of categories) {
            let category = await this.categoryService.findOneByTitle(categoryTitle)
            if (!category){
                category = await this.categoryService.insertByTitle(categoryTitle)
            }
            await this.BlogCategoryRepository.insert({
                blogId : blog.id,
                categoryId : category.id
            })
        }

        return {
            message : PublicMessage.Updated
        }
    }

    async likeToggle(blogId : number) {
        const { id : userId } = this.req.user
        const blog = await this.checkExistsBlogById(blogId)
        let message = PublicMessage.Liked
        const isLiked = await this.blogLikeRepository.findOneBy({userId, blogId})
        if (isLiked){
            await this.blogLikeRepository.delete({id : isLiked.id})
            message = PublicMessage.DisLiked
        } else {
            await this.blogLikeRepository.insert({blogId, userId})
        }

        return {
            message
        }
    }

    async bookMarkToggle(blogId : number) {
        const { id : userId } = this.req.user
        const blog = await this.checkExistsBlogById(blogId)
        let message = PublicMessage.Bookmarked
        const isBookmarked = await this.bookmarkRepository.findOneBy({userId, blogId})
        if (isBookmarked){
            await this.bookmarkRepository.delete({id : isBookmarked.id})
            message = PublicMessage.UnBookmarked
        } else {
            await this.bookmarkRepository.insert({blogId, userId})
        }

        return {
            message
        }
    }
}
