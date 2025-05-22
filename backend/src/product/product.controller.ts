import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateProductLikeDto } from 'src/product_like/dto/create-product_like.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Swagger } from 'src/core/common/decorator/swagger/swagger.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Swagger('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Like a product' })
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like_feature(
    @Body() CreateProductLikeDto: CreateProductLikeDto,
    @Param('id') id: string,
  ) {
    return this.productService.like_feature(id, CreateProductLikeDto);
  }

  @ApiOperation({ summary: 'Get all products' })
  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @ApiOperation({ summary: 'Get number of like in a product' })
  @Get(':id/like')
  numberOfLike(@Param('id') id: string) {
    return this.productService.numberOfLike(id);
  }

  @ApiOperation({ summary: 'Get a product by its ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a product by its ID' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete a product by its ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
