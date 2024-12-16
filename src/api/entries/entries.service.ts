import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEntriesDto } from './dto/create.dto';
import { UpdateEntriesDto } from './dto/update.dto';
import { ImgbbService } from 'src/lib/Imgbb/Imgbb.service';
import { GeocodingService } from '../geocoding/geocoding.service';
import { QueryEntriesDto } from './dto/query.dto';


@Injectable()
export class EntriesService {
    private readonly resource: Prisma.EntryDelegate<DefaultArgs>
    private resourceQuery = {
        // omit: { restaurantId: true },
        // include: { _count: true }
    }

    constructor(
        private prisma: PrismaService,
        private imgbbService: ImgbbService,
        private geocodingService: GeocodingService
    ) {
        this.resource = prisma.entry
    }


    async create({ userId }: UserInfo, createDto: CreateEntriesDto) {
        const { content, location, images, datetime, tags } = createDto
        if (content?.length == 0 && images?.length == 0) throw new BadRequestException('tidak boleh kosong')

        const imageData = images && await this.imgbbService.uploadPhoto(images)
        const locationData = location && {
            latitude: location[0],
            longitude: location[1],
            address: (await this.geocodingService.reverse(...location)).displayName
        }

        return this.resource
            .create({
                data: {
                    userId,
                    content: content!,
                    datetime: datetime!,
                    tags: {
                        connectOrCreate: tags!.map(tagsName => ({
                            where: { name: tagsName, userId },
                            create: { name: tagsName, userId }
                        }))
                    },
                    location: location && { create: locationData },
                    images: imageData && { createMany: { data: imageData } }
                }
            })
    }


    async findAll({ userId }: UserInfo, query: QueryEntriesDto) {

        return {dd : new Date(query.date!)}

        // return this.resource
        //     .findMany({
        //         where: { userId },
        //         ...this.resourceQuery
        //     })
    }

    async findOne({ userId }: UserInfo, id: number) {
        return await this.resource
            .findFirst({
                where: { id, userId },
                ...this.resourceQuery
            })
    }

    async update({ userId }: UserInfo, id: number, updateDto: UpdateEntriesDto) {
        // return await this.resource
        //     .update({
        //         where: { id, userId },
        //         data: updateDto,
        //     })
    }

    async remove({ userId }: UserInfo, id: number) {
        await this.resource.delete({ where: { id, userId } })
    }
}
