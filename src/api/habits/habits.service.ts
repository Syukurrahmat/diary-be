import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Habit, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from '@/prisma/prisma.service';
import { ChangeOrderItemDto } from './dto/changeOrder';
import { CreateHabitDto } from './dto/create.dto';
import { UpdateHabitDto } from './dto/update.dto';


type HabitsItem = Omit<Habit, 'userId'>

@Injectable()
export class HabitsService {
    private readonly resource: Prisma.HabitDelegate<DefaultArgs>
    private resourceQuery = {
        omit: { userId: true }
    }

    constructor(private prisma: PrismaService) {
        this.resource = prisma.habit
    }

    async create({ userId }: UserInfo, createDto: CreateHabitDto): Promise<HabitsItem> {
        const { name, icon, color } = createDto

        const IsNameAlreadyUsed = await this.resource.count({ where: { userId, name } })
        if (IsNameAlreadyUsed) throw new BadRequestException({ error: { field: 'name', message: 'Nama Sudah Digunakan' } })

        return await this.resource.create({
            data: {
                userId,
                name: name!,
                icon: icon!,
                color: color!,
            },
            ...this.resourceQuery
        })
    }


    async findAll({ userId }: UserInfo): Promise<HabitsItem[]> {
        return this.resource
            .findMany({
                where: { userId, deletedAt: null },
                orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
                ...this.resourceQuery
            })
    }

    async findOne({ userId }: UserInfo, id: number): Promise<HabitsItem | null> {
        return await this.resource
            .findFirst({
                where: { id, userId, deletedAt: null },
                ...this.resourceQuery
            })
    }

    async update({ userId }: UserInfo, id: number, updateDto: UpdateHabitDto): Promise<HabitsItem> {
        await this.itemIsExist(userId, id)

        return await this.resource
            .update({
                where: { id, userId },
                data: updateDto,
                ...this.resourceQuery
            })
    }

    async changeOrder({ userId }: UserInfo, changeOrderDto: ChangeOrderItemDto[]) {

        const uniqueIds = [...new Set(changeOrderDto.map(e => e.id!))];

        if (uniqueIds.length !== changeOrderDto.length) {
            throw new BadRequestException({ message: ['ID each item must be unique'] })
        }

        const isExist = await this.resource.count({ where: { userId, id: { in: uniqueIds } } })

        if (isExist !== changeOrderDto.length) {
            throw new BadRequestException({ message: ['Some items are invalid'] })
        }

        await this.prisma.$transaction(
            changeOrderDto.map(({ id, order }) => (
                this.resource.update({ where: { userId, id }, data: { order } })
            ))
        )
    }

    async remove({ userId }: UserInfo, id: number) {
        await this.itemIsExist(userId, id)
        await this.resource.update({ where: { id, userId }, data: { deletedAt: new Date() } })
    }

    async removePermanent({ userId }: UserInfo, id: number) {
        await this.resource.delete({ where: { id, userId } })
    }

    private async itemIsExist(userId: number, id: number) {
        const exist = await this.resource.count({ where: { userId, id, deletedAt: null } })
        if (!exist) throw new UnprocessableEntityException({ message: 'Item not exist' })
    }
}
