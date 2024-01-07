import {
    ConflictException,
    HttpException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { User } from '@prisma/client';
  import { PrismaService } from 'src/core/services/prisma.service';
  import { CreateUserDto } from './dtos/create-user.dto';
  import { compare, hash } from 'bcrypt';
  import { LoginUserDto } from './dtos/login-user.dto';
  import { JwtService } from '@nestjs/jwt';
  import { LoginResponse, UserPayload } from './interfaces/users-login.interface';
  
  @Injectable()
  export class AuthService {
    constructor(
      private prisma: PrismaService,
      private jwtService: JwtService,
    ) {}

    async uploadPhoto(email: string, photo: Express.Multer.File): Promise<any> {
      const photoPath = `public/img/${photo.filename}`; // Menyimpan path foto ke database
      return this.prisma.user.updateMany({ where: { email:email }, data: { photo: photoPath } });
    }
  
    async registerUser(createUserDto: CreateUserDto): Promise<User> {
      try {
        // check if password is correct by comparing it with the hashed password in the database
        if (createUserDto.password !== createUserDto.confirmPassword) {
          throw new UnauthorizedException("Password and confirm password don't match");
        }
        // create new user using prisma client
        const newUser = await this.prisma.user.create({
          data: {
            email: createUserDto.email,
            password: await hash(createUserDto.password, 10), // hash user's password
            name: createUserDto.name,
            username : createUserDto.username,
            photo : '-'
          },
        });
  
        // remove password from response
        delete newUser.password;
  
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
  
    async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponse> {
      try {
        // find user by email
        const user = await this.prisma.user.findUnique({
          where: { email: loginUserDto.email },
        });
  
        // check if user exists
        if (!user) {
          throw new NotFoundException('User not found');
        }
  
        // check if password is correct by comparing it with the hashed password in the database
        if (!(await compare(loginUserDto.password, user.password))) {
          throw new UnauthorizedException('Invalid credentials');
        }
  
        const payload: UserPayload = {
          // create payload for JWT
          sub: user.id, // sub is short for subject. It is the user id
          email: user.email,
          name: user.name,
        };
  
        return {
          // return access token
          access_token: await this.jwtService.signAsync(payload),
        };
      } catch (error) {
        // throw error if any
        // throw new HttpException(error, 500);
        throw new HttpException(error, error.status);
      }
    }
  }
  