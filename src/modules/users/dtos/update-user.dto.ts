import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {

  @ApiProperty({
    example: 'super_secret_password',
    description: 'masukkan password',
    type: String,
  })
  password: string;
}