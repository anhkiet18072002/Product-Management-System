import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { CreateBaseDto } from 'src/core/dto/crete-base.dto';

export class CreateProductLikeDto extends CreateBaseDto {
  @ApiProperty({ description: 'Id of user', required: true })
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Id of product', required: true })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;
}
