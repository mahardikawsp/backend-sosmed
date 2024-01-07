// src/modules/posts/dtos/create-post.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'Caption',
    description: 'Hari yang indah',
    type: String,
  })
  caption: string

  @IsNotEmpty()
  @ApiProperty({
    example: 'Tags',
    description: '#fyp',
    type: String,
  })
  tags: string;

  @ApiProperty({
    example: 'Upload photo',
    description: 'photo.jpg',
    type: String,
  })
  photo: string;

  user_id: number;
}