// src/modules/posts/dtos/create-post.dto.ts

import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  caption: "string;"

  @IsNotEmpty()
  tags: string;

  photo: string;

  user_id: number;
}