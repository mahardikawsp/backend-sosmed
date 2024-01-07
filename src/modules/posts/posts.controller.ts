// src/modules/posts/posts.controller.ts

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { CreatePostDto } from './dtos/create-post.dto';
  import { UpdatePostDto } from './dtos/update-post.dto';
  import { PostsService } from './posts.service';
  import { Post as CPost } from '@prisma/client';
  import { Public } from 'src/common/decorators/public.decorator';
  import { IsMineGuard } from 'src/common/guards/is-mine.guard';
  import { ExpressRequestWithUser } from '../users/interfaces/express-request-with-user.interface';
  import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
  import { QuerySearchDto } from 'src/common/dtos/search.dto';
  import { PaginateOutput } from 'src/common/utils/pagination.utils';
  import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';

  
  @ApiTags('Posts')
  @Controller('posts')
  export class PostsController {
    // inject posts service
    constructor(private readonly postsService: PostsService) {}
  
    @Post()
    @ApiOperation({
      summary: 'Create new post',
      operationId: 'create',
    })
    @ApiResponse({
      status: 201,
      description: 'Created',
      type: CreatePostDto,
    })
    @UseInterceptors(
      FileInterceptor('photo', {
        storage: diskStorage({
          // destination: 'uploads/posts',
          destination: 'public/posts',
          filename: (req, photo, cb) => {
            let extArray = photo.mimetype.split("/");
            let extension = extArray[extArray.length - 1];
            cb(null, Date.now() + '.' + extension)
            // cb(null, file.originalname);
          },
        }),
      }),
    )
    async createPost(
      @UploadedFile() photo: Express.Multer.File,
      @Body() createPostDto: { caption: string, tags:string,photo:string,user_id:number},
      @Request() req: ExpressRequestWithUser,
    ): Promise<CPost> {
      // 💡 See this. set authorId to current user's id
      createPostDto.user_id = req.user.sub;
      // if (photo) {
      //   await this.postsService.uploadPhoto(createPostDto.user_id, photo); // Jika ada foto, simpan foto
      // }
      return this.postsService.createPost(photo,createPostDto);
    }
    
    
    @Public()
    @Get()
    @ApiQuery({ name: 'page' })
    @ApiQuery({ name: 'size' })
    getAllPosts(
        @Query() query?: QueryPaginationDto,
      ): Promise<PaginateOutput<CPost>> {
        return this.postsService.getAllPosts(query);
      }

    @Public()
    @Get('search')
    @ApiQuery({ name: 'caption'})
    @ApiQuery({ name: 'tags'})
    @ApiQuery({ name: 'page' })
    @ApiQuery({ name: 'size' })
    getSearchPosts(
        @Query() query?: QuerySearchDto,
    ): Promise<PaginateOutput<CPost>> {
        return this.postsService.getSearchPosts(query);
    }
  
    @Public()
    @Get(':id')
    getPostById(@Param('id', ParseIntPipe) id: number): Promise<CPost> {
      return this.postsService.getPostById(id);
    }
  
    @Patch(':id')
    @UseGuards(IsMineGuard) //
    @UseInterceptors(
      FileInterceptor('photo', {
        storage: diskStorage({
          // destination: 'uploads/posts',
          destination: 'public/posts',
          filename: (req, photo, cb) => {
            let extArray = photo.mimetype.split("/");
            let extension = extArray[extArray.length - 1];
            cb(null, Date.now() + '.' + extension)
            // cb(null, file.originalname);
          },
        }),
      }),
    )
    async updatePost(
      @UploadedFile() photo: Express.Multer.File,
      @Param('id') postId: number,
      @Body() updatePostDto: { caption: string, tags:string,photo:string,user_id:number}
      // @Param('id', ParseIntPipe) id: number,
      // @Body() updatePostDto: UpdatePostDto,
    ): Promise<CPost> {
      return this.postsService.updatePost(photo, postId, updatePostDto);
    }
  
    @Delete(':id')
    @UseGuards(IsMineGuard) //
    async deletePost(@Param('id', ParseIntPipe) id: number): Promise<string> {
      return this.postsService.deletePost(+id);
    }
  }