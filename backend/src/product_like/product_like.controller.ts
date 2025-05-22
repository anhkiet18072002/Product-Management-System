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
import { ProductLikeService } from './product_like.service';
import { CreateProductLikeDto } from './dto/create-product_like.dto';
import { UpdateProductLikeDto } from './dto/update-product_like.dto';
import { QueryProductLikeDto } from './dto/query-product_like.dto';
import { Swagger } from 'src/core/common/decorator/swagger/swagger.decorator';
import { ApiOperation } from '@nestjs/swagger';
@Swagger('Like of Product')
@Controller('product_like')
export class ProductLikeController {
  constructor(private readonly productLikeService: ProductLikeService) {}

  @ApiOperation({ summary: 'Create one like of product from user' })
  @Post()
  create(@Body() createProductLikeDto: CreateProductLikeDto) {
    return this.productLikeService.create(createProductLikeDto);
  }

  @ApiOperation({ summary: 'Check if user like product' })
  @Post('check_like')
  check_like(@Body() createProductLikeDto: CreateProductLikeDto) {
    return this.productLikeService.check_like(createProductLikeDto);
  }

  @ApiOperation({ summary: 'Get all likes of product from user' })
  @Get()
  findAll(@Query() query: QueryProductLikeDto) {
    return this.productLikeService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a like of product from user by its ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productLikeService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a like of product from user by its ID' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductLikeDto: UpdateProductLikeDto,
  ) {
    return this.productLikeService.update(id, updateProductLikeDto);
  }

  @ApiOperation({ summary: 'Delete a like of product from user by its ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productLikeService.remove(id);
  }
}
