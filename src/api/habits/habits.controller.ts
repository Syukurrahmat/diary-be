import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserInfo } from 'src/common/decorator/user.decorator';
import { UpdateHabitDto } from './dto/update.dto';
import { HabitsService } from './habits.service';

@Controller('habits')
export class HabitsController {
    constructor(private readonly services: HabitsService) { }
 
    @Get()
    async findAll(
        @UserInfo() user: UserInfo
    ) {
        return await this.services.findAll(user);
    }

    @Get(':id')
    async findOne(
        @UserInfo() user: UserInfo,
        @Param('id') id: string
    ) {
        return await this.services.findOne(user, +id);
    }

    @Patch(':id')
    update(
        @UserInfo() user: UserInfo,
        @Param('id') id: string,
        @Body() updateNotebookDto: UpdateHabitDto,
    ) {
        return this.services.update(user, +id, updateNotebookDto)
    }

    @Delete(':id')
    remove(
        @UserInfo() user: UserInfo,
        @Param('id') id: string,
    ) {
        return this.services.remove(user, +id);
    }
}
