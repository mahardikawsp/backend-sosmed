import {
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { Like } from '@prisma/client';
  import { PrismaService } from 'src/core/services/prisma.service';
  import { CreateLikeDto } from './dtos/create-like.dto';
  import { JwtService } from '@nestjs/jwt';
  
  @Injectable()
  export class LikesService {
    constructor(
      private prisma: PrismaService,
      private jwtService: JwtService,
    ) {}
  
    async createLike(createLikeDto: CreateLikeDto): Promise<Like> {
      try {
        // find user by email
        const like = await this.prisma.like.findFirst({
          where: { user_id: createLikeDto.user_id,post_id: createLikeDto.post_id },
        });

        // check if user exists
        if (like) {
          throw new HttpException('Sudah di like',HttpStatus.FORBIDDEN);
        }

        // create new user using prisma client
        const newUser = await this.prisma.like.create({
          data: {
            post_id: createLikeDto.post_id,
            user_id: createLikeDto.user_id,
            like : createLikeDto.like,
          },
        });
  
        return newUser;
      } catch (error) {
        // check if email already registered and throw error
        if (error.code === 'P2002') {
          throw new ConflictException('Email already registered');
        }
  
        // throw error if any
        throw new HttpException(error, 500);
      }
    }

    async unLike(createLikeDto: CreateLikeDto): Promise<String> {
      try {
        // find like by user_id and post_id. If not found, throw error
        const like = await this.prisma.like.findFirst({
          where: { user_id: createLikeDto.user_id,post_id: createLikeDto.post_id },
        });

        // check if like exists
        if (!like) {
          throw new HttpException('Not Found',HttpStatus.FORBIDDEN);
        }

        await this.prisma.like.deleteMany({
          where: { user_id: createLikeDto.user_id,post_id: createLikeDto.post_id },
        });
  
        throw new HttpException('Success',HttpStatus.OK);
      } catch (error) {
        if (error.code === 'P2025') {
          throw new HttpException('Not Found',HttpStatus.NOT_FOUND);
        }
        throw new HttpException(error, 500);
      }
    }

    async getPostById(id: number) {
      try {
        const post = await this.prisma.like.count({
          where: { post_id : id },
        });
        
        if(!post){
          throw new HttpException('Not Found',HttpStatus.NOT_FOUND);
        }

        return {
          statusCode: 200,
          message: 'Post Like',
          like: post,
        };

      } catch (error) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Post with id ${id} not found`);
        }
        throw new HttpException(error, 500);
      }
    }

  }
  