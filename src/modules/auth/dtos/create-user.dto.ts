import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
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

  @IsNotEmpty()
  @ApiProperty({
    example: 'super_secret_password',
    description: 'masukkan password yang sama',
    type: String,
  })
  confirmPassword: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'john titor',
    description: 'masukkan nama anda',
    type: String,
  })
  name: string;

  @ApiProperty({
    example: 'john@cool',
    description: 'masukkan username anda',
    type: String,
  })
  username: string;

  @ApiProperty({
    example: 'lokasi foto anda',
    description: 'photo.jpg',
    type: String,
  })
  photo: string
}