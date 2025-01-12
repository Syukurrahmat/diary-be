import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Patch, Post, Query } from '@nestjs/common';
import { UserInfo } from '@/common/decorator/user.decorator';
import { ChangeOrderItemDto } from './dto/changeOrder';
import { CreateHabitDto } from './dto/create.dto';
import { UpdateHabitDto } from './dto/update.dto';
import { HabitsService } from './habits.service';

@Controller('habits')
export class HabitsController {
    constructor(private readonly services: HabitsService) { }

    @Post()
    create(
        @UserInfo() user: UserInfo,
        @Body() createDto: CreateHabitDto
    ) {
        return this.services.create(user, createDto);
    }

    @Get()
    findAll(@UserInfo() user: UserInfo) {
        return this.services.findAll(user);
    }


    @Patch('/order')
    changeOrder(
        @UserInfo() user: UserInfo,
        @Body(new ParseArrayPipe({ items: ChangeOrderItemDto, whitelist: true })) body: ChangeOrderItemDto[]
    ) {
        return this.services.changeOrder(user, body)
    }

    @Get(':id')
    findOne(
        @UserInfo() user: UserInfo,
        @Param('id') id: string
    ) {
        return this.services.findOne(user, +id);
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
