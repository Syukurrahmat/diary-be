import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserInfo } from 'src/common/decorator/user.decorator';
import LocalAuthGuard from '../../auth/auth.guard';
import { CalenderQuery } from './dto/query.dto';
import { JournalService } from './journals.service';

@Controller('journals')
@UseGuards(LocalAuthGuard)
export class JournalsController {
    constructor(private readonly services: JournalService) { }

    @Get('')  //lastest journal
    async findAll(@UserInfo() user: UserInfo) {
        return await this.services.getLastest(user);
    }

    @Get('/calender')
    async getMonthlySummary(
        @UserInfo() user: UserInfo,
        @Query() { month, year }: CalenderQuery
    ) {
        return await this.services.getCalenderSummary(user, +month!, +year!)
    }

    @Get(':numberdate')
    async findOne(
        @UserInfo() user: UserInfo,
        @Param('numberdate') numberdate: string
    ) {
        return await this.services.getPerDay(user, +numberdate);
    }
}
