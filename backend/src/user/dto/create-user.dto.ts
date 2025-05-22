import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateBaseDto } from 'src/core/dto/crete-base.dto';

export class CreateUserDto extends CreateBaseDto {
  @ApiProperty({ description: 'Email of the user', required: true })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Username of the user', required: true })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Password of the user', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}
