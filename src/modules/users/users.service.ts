import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto, UpdateUserDto } from './dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers(page: number, limit: number) {
    try {
      const items = await this.prismaService.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
      const total = await this.prismaService.user.count();
      return {
        items,
        page,
        limit,
        total,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getUser(id: string) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  createUser(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({ data: createUserDto });
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  deleteUser(id: string) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
