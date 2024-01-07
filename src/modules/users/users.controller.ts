import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors
  } from '@nestjs/common';
  import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
  import { CreateUserDto } from './dtos/create-user.dto';
  import { UpdateUserDto } from './dtos/update-user.dto';
  import { LoginUserDto } from './dtos/login-user.dto';
  import { UsersService } from './users.service';
  import { User } from '@prisma/client';
  import { LoginResponse, UserPayload } from './interfaces/users-login.interface';
  import { ExpressRequestWithUser } from './interfaces/express-request-with-user.interface';
  import { Public } from 'src/common/decorators/public.decorator';
  import { IsMineGuard } from 'src/common/guards/is-mine.guard';
  import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  
  @ApiTags('Users')
  @Controller('users')
  export class UsersController {
    // inject users service
    constructor(private readonly usersService: UsersService) {}

    // @Public()
    // @Post('upload')
    // @UseInterceptors(
    //   FileInterceptor('file', {
    //     storage: diskStorage({
    //       destination: 'dist/uploads/img',
    //       filename: (req, file, cb) => {
    //         let extArray = file.mimetype.split("/");
    //         let extension = extArray[extArray.length - 1];
    //         cb(null, Date.now() + '.' + extension)
    //         // cb(null, file.originalname);
    //       },
    //     }),
    //   }),
    // )
    // public async uploadFile(@UploadedFile(
    //   new ParseFilePipe({
    //     validators: [
    //       new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    //       new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
    //     ],
    //   }),
    // )file: Express.Multer.File) {
    //   return {
    //     statusCode: 200,
    //     data: file.path,
    //   };
    // }
    
    @Public()
    @Post('register')
    @ApiOperation({
      summary: 'Register a new user',
      operationId: 'create',
    })
    @ApiResponse({
      status: 201,
      description: 'Created',
      type: CreateUserDto,
    })
    @UseInterceptors(
      FileInterceptor('photo', {
        storage: diskStorage({
          destination: 'dist/uploads/img',
          filename: (req, photo, cb) => {
            let extArray = photo.mimetype.split("/");
            let extension = extArray[extArray.length - 1];
            cb(null, Date.now() + '.' + extension)
            // cb(null, file.originalname);
          },
        }),
      }),
    )
    async registerUser(@UploadedFile() photo: Express.Multer.File, @Body() createUserDto: CreateUserDto): Promise<User> {
      // call users service method to register new user
      const uu = await this.usersService.registerUser(createUserDto);
      if (photo) {
        await this.usersService.uploadPhoto(createUserDto.email, photo); // Jika ada foto, simpan foto
      }
      return uu;
    }
  
    @Post('login')
    @Public()
    loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
      // call users service method to login user
      return this.usersService.loginUser(loginUserDto);
    }
    
    @ApiBearerAuth('JWT-auth')
    @Get('me')
    me(@Request() req: ExpressRequestWithUser): UserPayload {
    return req.user;
    }
    
    @ApiBearerAuth('JWT-auth')
    @Put(':id')
    @UseGuards(IsMineGuard)
    async updateUser(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
      // call users service method to update user
      return this.usersService.updateUser(+id, updateUserDto);
    }
  
    // @Delete(':id')
    // @UseGuards(IsMineGuard)
    // async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
    //   // call users service method to delete user
    //   return this.usersService.deleteUser(+id);
    // }
  }
  