import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '22',
    description: 'ID Postingan',
    type: Number,
  })
  post_id: number;

  @IsNotEmpty()
  @ApiProperty({
    example: '1',
    description: 'Default',
    type: Number,
  })
  like: number;

  @IsNotEmpty()
  @ApiProperty({
    example: '15',
    description: 'Default',
    type: Number,
  })
  user_id: number;


}