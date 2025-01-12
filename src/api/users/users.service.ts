import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import * as argon2 from "argon2";
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
    private readonly resource: Prisma.UserDelegate<DefaultArgs>
    constructor(prisma: PrismaService) {
        this.resource = prisma.user
    }

    async create(createUserDto: CreateUserDto) {
        const { email, name, password, timezone } = createUserDto

        const emailIsUsed = await this.resource.count({ where: { email } })
        if (emailIsUsed) throw new BadRequestException({ message: ['email already used'] })

        return await this.resource.create({
            data: {
                name: name!,
                email: email!,
                password: await argon2.hash(password!),
                timezone: timezone!,
            },
        })
    }

    findEmailAndPass(email: string) {
        return this.resource.findFirst({
            where: { email }, select: {
                id: true,
                password: true,
                timezone: true,
            }
        })
    }

    findOne(id: number) {
        return this.resource.findFirst({ where: { id } })
    }

    findOneByEmail(email: string) {
        return this.resource.findFirst({
            where: { email },
            select: { id: true, email: true, password: true, timezone: true },
        })
    }

    async updateRtHash(userId: number, refreshToken: string): Promise<void> {
        await this.resource.update({
            where: { id: userId },
            data: { hashedRt: await argon2.hash(refreshToken) },
        });
    }

    async deleteRtHash(id: number): Promise<void> {
        await this.resource.update({
            where: { id, hashedRt: { not: null } },
            data: { hashedRt: null },
        });
    }

    update(id: string, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: string) {
        return `This action removes a #${id} user`;
    }
}
