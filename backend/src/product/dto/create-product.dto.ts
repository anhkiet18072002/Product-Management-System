import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateBaseDto } from 'src/core/dto/crete-base.dto';

export class CreateProductDto extends CreateBaseDto {
  @ApiProperty({ description: 'Name of the product', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Price of the project', required: true })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Category of the project', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ description: 'Subcategory of the project', required: false })
  @IsOptional()
  @IsString()
  subcategoryId?: string;
}
