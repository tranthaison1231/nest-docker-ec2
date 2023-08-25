import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/users.dto';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers(@Query('page') page: string, @Query('limit') limit: string) {
    return this.userService.getUsers(+page, +limit);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUser(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    return this.userService.updateUser(id, createUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
