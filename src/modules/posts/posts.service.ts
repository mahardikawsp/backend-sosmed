// src/modules/posts/posts.service.ts

import {
    ConflictException,
    HttpException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { Post } from '@prisma/client';
  import { PrismaService } from 'src/core/services/prisma.service';
  import { CreatePostDto } from './dtos/create-post.dto';
  import { UpdatePostDto } from './dtos/update-post.dto';
  import { PaginateOutput, paginate, paginateOutput } from 'src/common/utils/pagination.utils';
  import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
  import { QuerySearchDto } from 'src/common/dtos/search.dto';
  import { JwtService } from '@nestjs/jwt';
  
  @Injectable()
  export class PostsService {
    constructor(private prisma: PrismaService,private jwtService: JwtService,) {}

    // async uploadPhoto(user_id: number, photo: Express.Multer.File): Promise<any> {
    //   const photoPath = `dist/uploads/posts/${photo.filename}`; // Menyimpan path foto ke database
    //   return this.prisma.post.upsert({ where: { user_id:user_id }, update:{photo: photoPath} data: { photo: photoPath } });
    // }
  
    async createPost(photo: Express.Multer.File,createPostDto: {caption: string, tags:string,photo:string,user_id:number}): Promise<Post> {
      try {
        // create new post using prisma client
        const photoPath = `public/posts/${photo.filename}`;
        const newPost = await this.prisma.post.create({
          data: {
            // ...createPostDto,
            caption: createPostDto.caption,
            tags: createPostDto.tags,
            photo: photoPath,
            user_id: createPostDto.user_id
          },
        });
  
        return newPost;
        
      } catch (error) {
        // check if post already create and throw error
        if (error.code === 'P2002') {
          throw new ConflictException('Same Caption already created');
        }
  
        if (error.code === 'P2003') {
          throw new NotFoundException('Author not found');
        }
  
        // throw error if any
        throw new HttpException(error, 500);
      }
    }
  
    async getAllPosts(query?: QueryPaginationDto): Promise<PaginateOutput<Post>> {
        const [posts, total] = await Promise.all([
          await this.prisma.post.findMany({
            ...paginate(query),
          }),
          await this.prisma.post.count(),
        ]);
      
        return paginateOutput<Post>(posts, total, query);
    }

    async getSearchPosts(query?: QuerySearchDto): Promise<PaginateOutput<Post>> {
      const [posts, total] = await Promise.all([
        await this.prisma.post.findMany({
          where: { caption :  { search : query.keyword}, tags: { search : query.keyword}  },
          ...paginate(query),
        }),
        await this.prisma.post.count(),
      ]);
    
      return paginateOutput<Post>(posts, total, query);
  }
  
    async getPostById(id: number): Promise<Post> {
      try {
        // find post by id. If not found, throw error
        const post = await this.prisma.post.findUniqueOrThrow({
          where: { id },
        });
  
        return post;
      } catch (error) {
        // check if post not found and throw error
        if (error.code === 'P2025') {
          throw new NotFoundException(`Post with id ${id} not found`);
        }
  
        // throw error if any
        throw new HttpException(error, 500);
      }
    }
  
    async updatePost(photo: Express.Multer.File, id: number, updatePostDto: UpdatePostDto): Promise<Post> {
      try {
        // find post by id. If not found, throw error
        await this.prisma.post.findUniqueOrThrow({
          where: { id },
        });
        
        const photoPath = `public/posts/${photo.filename}`;
        // update post using prisma client
        const updatedPost = await this.prisma.post.update({
          where: { id },
          data: {
            caption: updatePostDto.caption,
            tags: updatePostDto.tags,
            photo: photoPath,
            user_id: updatePostDto.user_id
            // ...updatePostDto,
          },
        });
  
        return updatedPost;
      } catch (error) {
        // check if post not found and throw error
        if (error.code === 'P2025') {
          throw new NotFoundException(`Post with id ${id} not found`);
        }
  
        // check if email already registered and throw error
        if (error.code === 'P2002') {
          throw new ConflictException('Email already registered');
        }
  
        // throw error if any
        throw new HttpException(error, 500);
      }
    }
  
    async deletePost(id: number): Promise<string> {
      try {
        // find post by id. If not found, throw error
        const post = await this.prisma.post.findUniqueOrThrow({
          where: { id },
        });
  
        // delete post using prisma client
        await this.prisma.post.delete({
          where: { id },
        });
  
        return `Post with id ${post.id} deleted`;
      } catch (error) {
        // check if post not found and throw error
        if (error.code === 'P2025') {
          throw new NotFoundException(`Post with id ${id} not found`);
        }
  
        // throw error if any
        throw new HttpException(error, 500);
      }
    }
  }