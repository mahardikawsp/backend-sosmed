import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'email@email.com',
    description: 'masukkan email',
    type: String,
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'super_secret_password',
    description: 'masukkan password',
    type: String,
  })
  password: string;
}