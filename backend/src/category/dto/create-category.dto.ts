import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateBaseDto } from 'src/core/dto/crete-base.dto';

export class CreateCategoryDto extends CreateBaseDto {
  @ApiProperty({ description: 'Name of the project type', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the project type',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
