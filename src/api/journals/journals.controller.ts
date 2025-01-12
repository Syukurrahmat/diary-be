import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserInfo } from '@/common/decorator/user.decorator';
import { CreateJournalDto } from './dto/create.dto';
import { CalenderQuery } from './dto/query.dto';
import { JournalService } from './journals.service';

@Controller('journals')
export class JournalsController {
    constructor(private readonly services: JournalService) { }

    @Post('/')
    async createJournal(
        @UserInfo() user: UserInfo,
        @Body() createDto: CreateJournalDto
    ) {
        return await this.services.addHabitAndSummary(user, createDto);
    }

    @Get('/')
    async findAll(@UserInfo() user: UserInfo) {
        return await this.services.getLastest(user);
    }

    @Get('/calender')
    async getMonthlySummary(
        @UserInfo() user: UserInfo,
        @Query() { month, year, decade }: CalenderQuery
    ) {
        const level = decade ? 'decade' : month && year ? 'month' : year ? 'year' : null
        if (!level) throw new BadRequestException({ message: ['invalid parameter'] })

        return await this.services.getCalenderSummary(user, level, { month, year, decade })
    }

    @Get(':dateString')
    async findOne(
        @UserInfo() user: UserInfo,
        @Param('dateString') dateString: string
    ) {
        return await this.services.getPerDay(user, dateString);
    }
}
