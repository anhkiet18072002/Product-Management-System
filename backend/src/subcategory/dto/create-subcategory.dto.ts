import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateBaseDto } from 'src/core/dto/crete-base.dto';

export class CreateSubcategoryDto extends CreateBaseDto {
  @ApiProperty({ description: 'Name of the subcategory', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the subcategory',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Category contains subcategory',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
