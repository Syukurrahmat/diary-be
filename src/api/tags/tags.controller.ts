import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { UserInfo } from 'src/common/decorator/user.decorator';
import LocalAuthGuard from '../../auth/auth.guard';
import { UpdateCategoryDto } from './dto/update.dto';
import { TagsService } from './tags.service';

@Controller('tags')
@UseGuards(LocalAuthGuard)
export class TagsController {
    constructor(private readonly services: TagsService) { }

    @Get('autocomplete')
    async autocomplete(
        @UserInfo() user: UserInfo,
        @Query('q') query: string
    ) {
        return await this.services.autocomplete(user,query );
    }

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
        @Body() updateNotebookDto: UpdateCategoryDto,
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
