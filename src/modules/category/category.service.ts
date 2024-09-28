import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictMessage, NotFoundMessage, PublicMessage } from 'src/common/types/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository : Repository<CategoryEntity>
  ){}

  async create(createCategoryDto: CreateCategoryDto) {
    let {title, priority} = createCategoryDto
    title = await this.checkExistByTitle(title)
    const category = this.categoryRepository.create({priority, title})
    await this.categoryRepository.save(category)

    return {
      message : PublicMessage.Created
    }
  }

  async insertByTitle(title : string){
    const category = this.categoryRepository.create({title})
    return await this.categoryRepository.save(category)
  }

  private async checkExistByTitle(title : string) {
    title = title.trim().toLowerCase()
    const category = await this.categoryRepository.findOneBy({title})
    if (category) throw new BadRequestException(ConflictMessage.CategoryTitle)

    return title
  }

  async findAll(paginationDto : PaginationDto) {
    const {limit, page,skip} = paginationSolver(paginationDto)
    
    const [categores, count] = await this.categoryRepository.findAndCount({
      skip,
      take : limit
    })

    return {
      pagination : paginationGenerator(count, page, limit),
      categores
    }
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({id})
    if (!category) throw new NotFoundException(NotFoundMessage.NotFoundCategory)
    
    return category
  }

  async findOneByTitle(title : string){
    return await this.categoryRepository.findOneBy({title})
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id)
    const {priority, title} = updateCategoryDto

    if (title) category.title = title
    if (priority) category.priority = priority
    await this.categoryRepository.save(category)

    return {
      message : PublicMessage.Updated
    }

  }

  async remove(id: number) {
    const category = await this.findOne(id)
    if (category) await this.categoryRepository.delete({id})
    
    return {
      message : PublicMessage.Deleted
    }
    }
}
