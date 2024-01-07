import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
  } from '@nestjs/common';
  import { CreateLikeDto } from './dtos/create-like.dto';
  import { LikesService } from './likes.service';
  import { Like } from '@prisma/client';
  import { Public } from 'src/common/decorators/public.decorator';
  import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  
  @ApiTags('Likes')
  @Controller('Likes')
  export class LikesController {
    constructor(private readonly likesService: LikesService) {}

    @ApiBearerAuth('JWT-auth')
    @Post()
    @ApiOperation({
      summary: 'Like a post',
      operationId: 'create',
    })
    @ApiResponse({
      status: 201,
      description: 'Created',
      type: CreateLikeDto,
    })
    async likePost(@Body() createLikeDto: CreateLikeDto): Promise<Like> {
      return await this.likesService.createLike(createLikeDto);
    }

    @ApiBearerAuth('JWT-auth')
    @Post('unlike')
    @ApiOperation({
      summary: 'Unlike post',
      operationId: 'delete',
    })
    @ApiResponse({
      status: 201,
      description: 'Created',
      type: CreateLikeDto,
    })
    async unLikePost(@Body() createLikeDto: CreateLikeDto): Promise<String> {
      return await this.likesService.unLike(createLikeDto);
    }
    
    @Public()
    @ApiOperation({
      summary: 'Get likes by id post',
      operationId: 'get',
    })
    @Get('post/:id')
    getPostById(@Param('id', ParseIntPipe) id: number) {
      return this.likesService.getPostById(id);
    }
    
  }
  