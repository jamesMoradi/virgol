import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { BlogEntity } from './entity/blog.entity';
import { CreateBlogDto, FilterBlogDto } from "./dto/blog.dto";
import { BlogStatus } from './enums/status.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BadRequestMessage, PublicMessage } from "src/common/types/enums/message.enum";
import { createSlug, randomId } from 'src/common/utils/function.util';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { isArray } from "class-validator";
import { CategoryService } from "../category/category.service";
import { BlogCategoryEntity } from "./entity/blog-category.entity";

@Injectable({ scope : Scope.REQUEST})
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity)
        private readonly blogRepository : Repository<BlogEntity>,
        @InjectRepository(BlogCategoryEntity)
        private readonly BlogCategoryRepository : Repository<BlogCategoryEntity>,
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
        return !!blog 
    }
    
    getMyBlogs() {
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

    async blogList(paginationDto : PaginationDto, filterDto : FilterBlogDto) {
        const {limit, page, skip} = paginationSolver(paginationDto)
        const {category} = FilterBlogDto
        let where: FindOptionsWhere<BlogEntity> = {};
        if (category){
            where['categories'] = {
                category : {
                    title : category
                }
            }
        }
        const [blogs, count] = await this.blogRepository.findAndCount({
            relations : {
                categories : {
                    category : true
                }
            },
            select : {
                categories : {
                    categoryId : true,
                    category : {
                        id : true,
                        title : true
                    }
                }
            },
            where,
            order : {
                id : 'DESC'
            },
            skip,
            take : limit
        })
        return {
            pagination : paginationGenerator(count, page, limit),
            blogs
        }
    }
}
