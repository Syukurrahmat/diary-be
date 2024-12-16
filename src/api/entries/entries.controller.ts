import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserInfo } from 'src/common/decorator/user.decorator';
import LocalAuthGuard from '../../auth/auth.guard';
import { UpdateEntriesDto } from './dto/update.dto';
import { EntriesService } from './entries.service';
import { CreateEntriesDto } from './dto/create.dto';
import { QueryEntriesDto } from './dto/query.dto';

@Controller('entries')
@UseGuards(LocalAuthGuard)
export class EntriesController {
    constructor(private readonly services: EntriesService) { }

    @Post()
    async create(
        @UserInfo() user: UserInfo,
        @Body() createDto: CreateEntriesDto,
    ) {
        return await this.services.create(user, createDto);
    }

    @Get()
    async findAll(
        @UserInfo() user: UserInfo,
        @Query() date: QueryEntriesDto,
    ) {
        return await this.services.findAll(user, date);
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
        @Body() updateNotebookDto: UpdateEntriesDto,
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
