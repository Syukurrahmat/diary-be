import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
    private readonly resource: Prisma.UserDelegate<DefaultArgs>
    constructor(prisma: PrismaService) {
        this.resource = prisma.user
    }

    create(createUserDto: CreateUserDto) {
        return 'This action adds a new user';
    }

    findAll() {
        return `This action returns all users`;
    }

    async findEmailAndPass(email: string) {
        return await this.resource.findFirst({
            where: { email }, select: {
                id: true,
                password: true,
            }
        })
    }

    async findOne(id: number) {
        return await this.resource.findFirst({ where: { id } })

    }

    update(id: string, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: string) {
        return `This action removes a #${id} user`;
    }
}
