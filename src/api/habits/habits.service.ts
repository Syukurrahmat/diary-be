import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateHabitDto } from './dto/update.dto';


@Injectable()
export class HabitsService {
    private readonly resource: Prisma.HabitDelegate<DefaultArgs>
    private resourceQuery = {
        // omit: { restaurantId: true },
        // include: { _count: true }
    }

    constructor(private prisma: PrismaService) {
        this.resource = prisma.habit
    }

    async findAll({ userId }: UserInfo) {
        return this.resource
            .findMany({
                where: { userId, deletedAt: null },
                include: { _count: { select: { journals : true } } },
                omit: { createdAt: true, updatedAt: true, userId: true, deletedAt: true },
                ...this.resourceQuery
            })
            .then(e => e.sort((a, b) => a._count.journals - b._count.journals))
            .then(e => e.map(({ _count, ...e }) => ({ ...e })))
    }

    async findOne({ userId }: UserInfo, id: number) {
        return await this.resource
            .findFirst({
                where: { id, userId },
                ...this.resourceQuery
            })
    }

    async update({ userId }: UserInfo, id: number, updateDto: UpdateHabitDto) {
        return await this.resource
            .update({
                where: { id, userId },
                data: updateDto,
            })
    }

    async remove({ userId }: UserInfo, id: number) {
        await this.resource.delete({ where: { id, userId } })
    }
}
