import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogCommentEntity } from "../entity/comment.entity";
import { IsNull, Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import {Request} from "express";
import { BlogEntity } from "../entity/blog.entity";
import { BlogService } from "./blog.service";
import { CreateCommentDto } from "../dto/comment.dto";
import { BadRequestMessage, NotFoundMessage, PublicMessage } from "../../../common/types/enums/message.enum";
import { PaginationDto } from "../../../common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "../../../common/utils/pagination.util";

@Injectable({scope : Scope.REQUEST})
export class CommentService {
  constructor(
    @InjectRepository(BlogCommentEntity) private readonly commentRepository : Repository<BlogCommentEntity>,
    @InjectRepository(BlogEntity) private readonly blogRepository : Repository<BlogEntity>,
    @Inject(REQUEST) private readonly req : Request,
    @Inject(forwardRef(() =>BlogService)) private readonly blogService : BlogService
    ) {}

  async createComment(commentDto : CreateCommentDto){
    const {text, parentId, blogId} = commentDto;
    const blog = await this.blogRepository.findOneBy({id : blogId})
    const {id : userId} = this.req.user
    let parent = null;
    if (parentId && !isNaN(parentId)){
      parent = await this.commentRepository.findOneBy({id : +parentId})
    }
    await this.commentRepository.insert({
      text,
      accepted : true,
      blogId,
      parentId : parentId ? parentId : null,
      userId
    })

    return {
      message : PublicMessage.Created
    }
  }
  async find(paginationDto : PaginationDto){
    const {limit, page, skip} = paginationSolver(paginationDto)

    const [comments, count] = await this.commentRepository.findAndCount({
      where : {},
      skip,
      relations : { blog : true, user : {profile : true} },
      select : {blog : {title : true}, user : {username : true, profile : {nick_name : true}}},
      take : limit,
      order : {id : 'DESC'}
    })

    return {
      pagination : paginationGenerator(count, page,limit),
      comments
    }
  }
  async accept(id : number) {
    const comment = await this.checkExistById(id);
    if (comment.accepted) throw new BadRequestException(BadRequestMessage.AlreadyAccepted)
    comment.accepted = true
    await this.commentRepository.save(comment)
    return {
      message : PublicMessage.Updated
    }
  }
  async reject(id : number) {
    const comment = await this.checkExistById(id);
    if (!comment.accepted) throw new BadRequestException(BadRequestMessage.AlreadyRejected)
    comment.accepted = false
    await this.commentRepository.save(comment)
    return {
      message : PublicMessage.Updated
    }
  }

  async findCommentsOfBlog(blogId:number, paginationDto : PaginationDto){
    const {limit, page, skip} = paginationSolver(paginationDto)

    const [comments, count] = await this.commentRepository.findAndCount({
      where : {
        blogId,
        parentId : IsNull()
      },
      skip,
      relations : {
        blog : true,
        user : {
          profile : true
        },
        children : {
          blog : true,
          user : { profile : true },
          children : {
            blog : true,
            user : { profile : true }
          }
        }
        },
      select : {
        user : {
          username : true,
          profile : {nick_name : true}
        },
        children : {
          parentId : true,
          text : true,
          created_at : true,
          user : {
            username : true,
            profile : {nick_name : true}
          },
          children : {
            parentId : true,
            text : true,
            created_at : true,
            user : {
              username : true,
              profile : {nick_name : true}
            },
          }
        }
        },
      take : limit,
      order : {id : 'DESC'}
    })

    return {
      pagination : paginationGenerator(count, page,limit),
      comments
    }
  }
  private async checkExistById(id : number){
    const comment = await this.commentRepository.findOneBy({id})
    if (!comment) throw new NotFoundException(NotFoundMessage.NotFound)

    return comment
  }
}