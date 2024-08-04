import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictMessage, PublicMessage } from 'src/common/types/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.utils';

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

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }


}
