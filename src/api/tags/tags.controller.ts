import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { UserInfo } from '@/common/decorator/user.decorator';
import { UpdateCategoryDto } from './dto/update.dto';
import { TagsService } from './tags.service';

@Controller('tags')
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
