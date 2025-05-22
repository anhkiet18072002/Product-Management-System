import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { QuerySubcategoryDto } from './dto/query-subcategory.dto';
import { Swagger } from 'src/core/common/decorator/swagger/swagger.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Swagger('Subcategories')
@Controller('subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @ApiOperation({ summary: 'Create a new subcategory' })
  @Post()
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoryService.create(createSubcategoryDto);
  }

  @ApiOperation({ summary: 'Get all subcategories' })
  @Get()
  findAll(@Query() query: QuerySubcategoryDto) {
    return this.subcategoryService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a subcategory by its ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoryService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a subcategory by its ID' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoryService.update(id, updateSubcategoryDto);
  }

  @ApiOperation({ summary: 'Delete a subcategory by its ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoryService.remove(id);
  }
}
