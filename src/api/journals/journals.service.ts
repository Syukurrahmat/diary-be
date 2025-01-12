import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import moment from 'moment-timezone';
import { CreateJournalDto } from './dto/create.dto';
import { CalenderQuery } from './dto/query.dto';

@Injectable()
export class JournalService {
    private resource: Prisma.JournalDelegate<DefaultArgs, Prisma.PrismaClientOptions>
    private rawQueryDateformatList = {
        month: {
            filterDate: `'%Y-%m'`,
            resultDate: `'%Y-%m-%d'`,
        },
        year: {
            filterDate: `'%Y'`,
            resultDate: `'%Y-%m'`,
        },
        decade: {
            filterDate: `'%Y'`,
            resultDate: `'%Y'`,
        },
    }

    private resourceQuery = {
        omit: { userId: true },
        include: {
            entries: {
                include: {
                    location: { select: { address: true, id: true } },
                    images: { select: { imageUrl: true, width: true, height: true } },
                    tags: { select: { name: true, id: true } }
                },
                omit: { journalId: true },
                orderBy: { datetime: 'desc' as any }
            },
            habits: { select: { id: true, name: true, color: true, deletedAt: true, icon: true } }
        }
    }

    constructor(
        private prisma: PrismaService,
    ) {
        this.resource = prisma.journal
    }

    async addHabitAndSummary({ userId, timezone }: UserInfo, createDto: CreateJournalDto) {
        const { content, habits, date: userDate } = createDto

        const date = moment.tz(userDate, timezone).startOf('D').utc(true).toDate()
        const userId_date = { userId, date }

        const isExist = await this.resource.count({ where: { userId, date } })

        const validHabits = await this.prisma.habit.findMany({
            where: {
                userId,
                deletedAt: null,
                id: { in: habits! },
            },
            select: { id: true }
        })

        const data = {
            summary: content!,
            habits: { connect: validHabits }
        }

        if (isExist) {
            await this.resource.update({ where: { userId_date }, data })
        } else {
            await this.resource.create({ data: { ...userId_date, ...data } })
        }
    }

    async getLastest({ userId }: UserInfo): Promise<JournalItem[]> {
        const maxEntryDate = await this.prisma
            .entry
            .findMany({
                where: { journal: { userId } },
                select: { journal: { select: { date: true } } },
                orderBy: [{ journal: { date: 'desc' } }, { datetime: 'desc' }],
                take: 1, skip: 19
            })
            .then(e => e.at(0)?.journal.date)

        const journalDatas = await this.resource
            .findMany({
                where: { userId, ...(maxEntryDate && { date: { gte: maxEntryDate } }) },
                orderBy: { date: 'desc' },
                ...this.resourceQuery
            })


        return journalDatas.map(({ date, habits, ...journal }) => ({
            ...journal,
            date: moment(date).format('YYYY-MM-DD'),
            habits: habits.map(({ deletedAt, ...habit }) => ({
                ...habit,
                deleted: !!deletedAt
            }))
        }))
    }


    async getCalenderSummary({ userId }: UserInfo, level: "decade" | "month" | "year", query: CalenderQuery) {
        const { decade, year, month } = query

        const dateformat = this.rawQueryDateformatList[level]
        const queryDate = level == 'month'
            ? `'${year}-${month}'`
            : `'${year || Math.floor(+decade! / 10)}'`

        const WHERE_QUERY = `${level === 'decade' ? "SUBSTRING(DATE_FORMAT(j.date, '%Y'), 1, 3) " : `DATE_FORMAT(j.date, ${dateformat.filterDate})`} = ${queryDate} AND j.userId = ${userId}`

        const [hasEntriesDatesDB, topHabitsDB, [imageAndEntriesDB]] = await Promise.all([
            await this.prisma.$queryRawUnsafe<{ sampleImage: string, formatedDate: string }[]>(`
                WITH LatestImages AS (
                    SELECT 
                        DATE_FORMAT(j.date, ${dateformat.resultDate}) AS formatedDate,
                        img.imageUrl
                    FROM journal j

                    JOIN entry e ON e.journalId = j.id
                    JOIN image img ON img.entryId = e.id

                    WHERE ${WHERE_QUERY}
                    GROUP BY formatedDate
                )
                
                SELECT  
                    DATE_FORMAT(j.date,${dateformat.resultDate}) AS formatedDate,
                    li.imageUrl AS sampleImage
                FROM journal j
                LEFT JOIN LatestImages li ON DATE_FORMAT(j.date,${dateformat.resultDate}) = li.formatedDate
                
                WHERE ${WHERE_QUERY}
                GROUP BY formatedDate
                ORDER BY formatedDate ASC;
            `),
            await this.prisma.$queryRawUnsafe<{ id: number, color: string, icon: string, name: string, count: BigInt }[]>(`
                SELECT 
                    h.id,
                    h.name,
                    h.icon,
                    h.color,
                    COUNT(jh.A) AS count
                FROM _habittojournal jh
                JOIN habit h ON h.id = jh.A
                JOIN journal j ON j.id = jh.B

                WHERE ${WHERE_QUERY}
                GROUP BY h.name
                ORDER BY count DESC
                LIMIT 5;
            `),
            await this.prisma.$queryRawUnsafe<{ entries: BigInt, images: BigInt }[]>(`
                SELECT
                    COUNT(DISTINCT e.id) AS entries,
                    COUNT(DISTINCT img.id) AS images
                FROM journal j
                JOIN entry e ON e.journalId = j.id
                JOIN image img ON img.entryId = e.id
                WHERE ${WHERE_QUERY}
            `)
        ])

        const hasEntriesDates = hasEntriesDatesDB.map(({ formatedDate, ...item }) => ({ ...item, date: formatedDate }))
        const topHabits = topHabitsDB.map(({ ...item }) => ({ ...item, count: Number(item.count) }))

        const count = {
            images: Number(imageAndEntriesDB.images),
            entries: Number(imageAndEntriesDB.entries),
            journalDay: hasEntriesDates.length
        }

        return { hasEntriesDates, topHabits, count }

    }


    async getPerDay({ userId, timezone }: UserInfo, dateString: string) {
        const date = moment.tz(dateString, timezone).startOf('D').utc(true)
        if (!date.isValid()) throw new BadRequestException({ message: ['date tidak valid'] })

        const journal = await this.resource.findFirst({
            where: { userId, date: date.toDate() },
            orderBy: { date: 'desc' },
            ...this.resourceQuery,
        })

        return journal
    }
}


type JournalItem = {
    id: number
    date: string
    entries: Entry[]
    habits: {
        id: number,
        name: string,
        color : string,
        icon: string,
        deleted: boolean
    }[]
    summary: string | null
}

type Entry = {
    id: number
    content: string
    datetime: Date
    location: {
        address: string
        id: number
    } | null
    images: {
        imageUrl: string
        width: number
        height: number
    }[]
    tags: any[]

    createdAt: Date
    updatedAt: Date
}

