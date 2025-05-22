import { Module } from '@nestjs/common';
import { ProductLikeService } from './product_like.service';
import { ProductLikeController } from './product_like.controller';

@Module({
  controllers: [ProductLikeController],
  providers: [ProductLikeService],
})
export class ProductLikeModule {}
