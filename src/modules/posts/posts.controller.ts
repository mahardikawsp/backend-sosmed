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
    Put,
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
  import { ApiBearerAuth,ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';

  
  @ApiTags('Posts')
  @Controller('posts')
  export class PostsController {
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
      createPostDto.user_id = req.user.sub;
      return this.postsService.createPost(photo,createPostDto);
    }
    
    
    @Public()
    @ApiOperation({
      summary: 'Get all post with pagination',
      operationId: 'get',
    })
    @Get()
    @ApiQuery({ name: 'page' })
    @ApiQuery({ name: 'size' })
    getAllPosts(
        @Query() query?: QueryPaginationDto,
      ): Promise<PaginateOutput<CPost>> {
        return this.postsService.getAllPosts(query);
      }

    @Public()
    @ApiOperation({
      summary: 'Get all post with keyword (caption,tags) and pagination',
      operationId: 'get',
    })
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

    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
      summary: 'Get all post by user with pagination and search keyword by caption, tags',
      operationId: 'get',
    })
    @Get('list/:id')
    @ApiQuery({ name: 'caption'})
    @ApiQuery({ name: 'tags'})
    @ApiQuery({ name: 'page' })
    @ApiQuery({ name: 'size' })
    getSearchPostsUsers(
        @Param('id') postId: number,
        @Query() query?: QuerySearchDto,
    ): Promise<PaginateOutput<CPost>> {
        return this.postsService.getSearchPostsUser(postId,query);
    }
    
    @ApiOperation({
      summary: 'get post by id',
      operationId: 'get',
    })
    @Public()
    @Get(':id')
    getPostById(@Param('id', ParseIntPipe) id: number): Promise<CPost> {
      return this.postsService.getPostById(id);
    }
    
    @ApiOperation({
      summary: 'Update post',
      operationId: 'update',
    })
    @Put(':id')
    @ApiBearerAuth('JWT-auth')
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
    
    @ApiOperation({
      summary: 'Delete post by id',
      operationId: 'delete',
    })
    @ApiBearerAuth('JWT-auth')
    @Delete(':id')
    @UseGuards(IsMineGuard) //
    async deletePost(@Param('id', ParseIntPipe) id: number): Promise<string> {
      return this.postsService.deletePost(+id);
    }
  }