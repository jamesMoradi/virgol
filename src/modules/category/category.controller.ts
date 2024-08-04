import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumees } from 'src/common/types/enums/swagger-consumes.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Pagination } from 'src/common/decorator/pagination.decorator';

@Controller('category')
@ApiTags("Category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiConsumes(SwaggerConsumees.UrlEncoded, SwaggerConsumees.Json)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Pagination()
  findAll(@Query() paginationDto : PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
