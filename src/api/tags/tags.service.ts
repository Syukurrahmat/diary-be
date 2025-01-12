import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateCategoryDto } from './dto/update.dto';


@Injectable()
export class TagsService {
    private readonly resource: Prisma.TagDelegate<DefaultArgs>
    private resourceQuery = {
        // omit: { restaurantId: true },
        // include: { _count: true }
    }

    constructor(private prisma: PrismaService) {
        this.resource = prisma.tag
    }

    async autocomplete({ userId }: UserInfo, query: string) {
        return this.resource
            .findMany({
                where: { userId, name: { startsWith: query } },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select : {id : true, name : true},
                ...this.resourceQuery,
            })
    }

    async findAll({ userId }: UserInfo) {
        return this.resource
            .findMany({
                where: { userId },
                ...this.resourceQuery
            })
    }

    async findOne({ userId }: UserInfo, id: number) {
        return await this.resource
            .findFirst({
                where: { id, userId },
                ...this.resourceQuery
            })
    }

    async update({ userId }: UserInfo, id: number, updateDto: UpdateCategoryDto) {
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
