import { Module } from '@nestjs/common';
import { UsersController } from './auth.controller';
import { UsersService } from './auth.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}