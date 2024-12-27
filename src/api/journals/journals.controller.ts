import { BadRequestException, Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserInfo } from 'src/common/decorator/user.decorator';
import LocalAuthGuard from '../../auth/auth.guard';
import { CalenderQuery } from './dto/query.dto';
import { JournalService } from './journals.service';
import { CreateJournalDto } from './dto/create.dto';

@Controller('journals')
@UseGuards(LocalAuthGuard)
export class JournalsController {
    constructor(private readonly services: JournalService) { }

    @Post()
    async createJournal(
        @UserInfo() user: UserInfo,
        @Body() createDto: CreateJournalDto
    ) {
        return await this.services.addHabitAndSummary(user, createDto);
    }

    @Get()  //lastest journal
    async findAll(@UserInfo() user: UserInfo) {
        return await this.services.getLastest(user);
    }

    @Get('/calender')
    async getMonthlySummary(
        @UserInfo() user: UserInfo,
        @Query() { month, year, decade }: CalenderQuery
    ) {
        const level = decade ? 'decade' : month && year ? 'month' : year ? 'year' : null
        if (!level) throw new BadRequestException('invalid parameter ')

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
