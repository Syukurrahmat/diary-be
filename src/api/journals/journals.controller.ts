import { UserInfo } from '@/common/decorator/user.decorator';
import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import moment from 'moment-timezone';
import { CreateJournalDto } from './dto/create.dto';
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

    @Get('/calendar/:yearMonth')
    async getMonthlySummary(
        @UserInfo() user: UserInfo,
        @Param('yearMonth') quarter: string
    ) {
        if (!moment(quarter).isValid()) throw new BadRequestException({ message: ['yearMonth param invalid'] })
        return await this.services.getCalender(user, quarter!)
    }

    @Get(':dateString')
    findOne(
        @UserInfo() user: UserInfo,
        @Param('dateString') dateString: string
    ) {
        return this.services.getPerDay(user, dateString);
    }
}
