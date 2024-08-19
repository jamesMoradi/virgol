import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from './entity/blog.entity';
import { CreateBlogDto } from './dto/blog.dto';
import { BlogStatus } from './enums/status.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PublicMessage } from 'src/common/types/enums/message.enum';
import { createSlug, randomId } from 'src/common/utils/function.util';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';

@Injectable({ scope : Scope.REQUEST})
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity)
        private readonly blogRepository : Repository<BlogEntity>,
        @Inject(REQUEST) private readonly req : Request
    ){}

    async create(blogDto : CreateBlogDto){
        const user = this.req.user
        let {title, slug, content, description, image, timeForStudy} = blogDto
        let slugData = blogDto.slug = slug ?? title 
        blogDto.slug = createSlug(slugData) 
        const isExistSlug = await this.checkBlogBySlug(slug)
        if (isExistSlug) {
            slug += `-${randomId()}`
        }
        const blog = this.blogRepository.create({
            title,
            slug,
            description,
            content,
            image,
            status : BlogStatus.Draft,
            timeForStudy,
            authorId : user.id
        })
        await this.blogRepository.save(blog)

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

    async blogList(paginationDto : PaginationDto) {
        const {limit, page, skip} = paginationSolver(paginationDto)
        const [blogs, count] = await this.blogRepository.findAndCount({
            where : {},
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
