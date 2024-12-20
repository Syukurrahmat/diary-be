import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import * as moment from 'moment-timezone';
import { ImgbbService } from 'src/lib/Imgbb/Imgbb.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeocodingService } from '../geocoding/geocoding.service';


type DailyJournal = {
    date: Date,
    entries: SimpleEntryData[]
}

@Injectable()
export class JournalService {
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

    async getLastest({ userId, timezone: tz }: UserInfo): Promise<DailyJournal[]> {
        const query = {
            orderBy: { datetime: 'desc' as any },
            omit: { userId: true, updatedAt: true, createdAt: true },
            include: {
                location: { select: { address: true, id: true } },
                images: { select: { imageUrl: true, width: true, height: true } },
                tags: { select: { name: true, id: true } }
            },
        }

        const data: SimpleEntryData[] = await this.resource
            .findMany({
                where: { userId },
                take: 20,
                ...query,
            })

        const lastItem = data.at(-1)

        if (lastItem) {
            const { datetime } = lastItem
            const additionalData = await this.resource
                .findMany({
                    where: {
                        userId,
                        datetime: {
                            gte: moment.tz(datetime, tz).startOf('d').toDate(),
                            lt: datetime
                        }
                    },
                    ...query,
                })
            data.push(...additionalData)
        }

        return this.mappingEntries(data, tz)
    }


    async getCalenderSummary({ userId }: UserInfo, month: number, year: number) {
        const yearMonth = `${year}-${month}`

        return await this.prisma.$queryRaw<{ dateHasEntries: string, image?: string }[]>`
            SELECT 
                e.localDate as dateHasEntries, 
                max(i.imageUrl) AS image
            FROM 
                entry e
            LEFT JOIN 
                image i ON e.id = i.entryId
            WHERE 
                e.userId = ${userId} AND date_format(e.localDate, '%Y-%m') = ${yearMonth}
            GROUP BY 
                dateHasEntries
            ORDER BY 
                dateHasEntries;
        `
    }


    async getPerDay({ userId }: UserInfo, id: number) {
        return await this.resource
            .findFirst({
                where: { id, userId },
                ...this.resourceQuery
            })
    }


    private mappingEntries<T extends { datetime: Date }>(entries: T[], tz: string) {
        const mappedEntries = entries.reduce<Record<string, T[]>>((acc, item) => {
            const dateKey = moment.tz(item.datetime, tz).format('YYYY-MM-DD')

            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(item);

            return acc;
        }, {});

        return Object.entries(mappedEntries)
            .map(([date, entries]) => ({
                date: moment.tz(date, tz).startOf('d').toDate(),
                entries
            }))

    }
}
