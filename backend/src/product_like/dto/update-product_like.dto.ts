import { PartialType } from '@nestjs/swagger';
import { CreateProductLikeDto } from './create-product_like.dto';

export class UpdateProductLikeDto extends PartialType(CreateProductLikeDto) {}
