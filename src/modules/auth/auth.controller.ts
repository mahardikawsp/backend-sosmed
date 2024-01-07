import {
    Body,
    Controller,
    Post,
    Put,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors
  } from '@nestjs/common';
  import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
  import { CreateUserDto } from './dtos/create-user.dto';
  import { LoginUserDto } from './dtos/login-user.dto';
  import { AuthService } from './auth.service';
  import { User } from '@prisma/client';
  import { LoginResponse, UserPayload } from './interfaces/users-login.interface';
  import { Public } from 'src/common/decorators/public.decorator';
  import { IsMineGuard } from 'src/common/guards/is-mine.guard';
  import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';

  @ApiTags('Auth')
  @Controller('auth')
  export class AuthController {
    constructor(private readonly AuthService: AuthService) {}

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
          destination: 'public/img',
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
      const uu = await this.AuthService.registerUser(createUserDto);
      if (photo) {
        await this.AuthService.uploadPhoto(createUserDto.email, photo); // Jika ada foto, simpan foto
      }
      return uu;
    }
  
    @Post('login')
    @Public()
    @ApiOperation({
      summary: 'login user',
      operationId: 'login',
    })
    loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
      // call users service method to login user
      return this.AuthService.loginUser(loginUserDto);
    }
  }
  