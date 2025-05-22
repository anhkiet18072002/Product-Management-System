import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateBaseDto } from 'src/core/dto/crete-base.dto';

export class CreateCategoryDto extends CreateBaseDto {
  @ApiProperty({ description: 'Name of the category', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the category',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
