import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import moment from 'moment-timezone';
import { ImgbbService } from '@/lib/Imgbb/Imgbb.service';
import { PrismaService } from '@/prisma/prisma.service';
import { GeocodingService } from '../geocoding/geocoding.service';
import { CreateEntriesDto } from './dto/create.dto';
import { UpdateEntriesDto } from './dto/update.dto';


@Injectable()
export class EntriesService {
    private readonly resource: Prisma.EntryDelegate<DefaultArgs>
    private resourceQuery = {

    }

    constructor(
        private prisma: PrismaService,
        private imgbbService: ImgbbService,
        private geocodingService: GeocodingService
    ) {
        this.resource = prisma.entry
    }


    async create({ userId, timezone }: UserInfo, createDto: CreateEntriesDto) {
        const { content, location, images, datetime, tags } = createDto

        const date = moment.tz(datetime, timezone).startOf('d').utc(true).toDate()
        const imageData = images && await this.imgbbService.uploadPhoto(images)

        const locationData = location && {
            latitude: location[0],
            longitude: location[1],
            address: (await this.geocodingService.reverse(...location)).displayName
        }

        return this.resource
            .create({
                data: {
                    journal: {
                        connectOrCreate: {
                            where: { userId_date: { userId, date } },
                            create: { date, userId }
                        }
                    },
                    datetime: datetime!,
                    content: content!,
                    location: location && { create: locationData },
                    images: imageData && { createMany: { data: imageData } },
                    tags: {
                        connectOrCreate: tags!.map(tagsName => ({
                            where: { userId_name: { name: tagsName, userId, } },
                            create: { name: tagsName, userId }
                        }))
                    }
                }
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
        await this.resource.delete({ where: { id, journal: { userId } } })
    }
}
