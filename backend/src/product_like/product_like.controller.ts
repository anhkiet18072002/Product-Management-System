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

@Controller('product-like')
export class ProductLikeController {
  constructor(private readonly productLikeService: ProductLikeService) {}

  @Post()
  create(@Body() createProductLikeDto: CreateProductLikeDto) {
    return this.productLikeService.create(createProductLikeDto);
  }

  @Post('check_like')
  check_like(@Body() createProductLikeDto: CreateProductLikeDto) {
    return this.productLikeService.check_like(createProductLikeDto);
  }

  @Get()
  findAll(@Query() query: QueryProductLikeDto) {
    return this.productLikeService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productLikeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductLikeDto: UpdateProductLikeDto,
  ) {
    return this.productLikeService.update(id, updateProductLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productLikeService.remove(id);
  }
}
