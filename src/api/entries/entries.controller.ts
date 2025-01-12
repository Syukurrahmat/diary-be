import { BadRequestException, Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import moment from 'moment-timezone';
import { CreateEntriesDto } from './dto/create.dto';
import { UpdateEntriesDto } from './dto/update.dto';
import { EntriesService } from './entries.service';
import { UserInfo } from '@/common/decorator/user.decorator';
 
@Controller('entries')
export class EntriesController {
    constructor(private readonly services: EntriesService) { }

    @Post()
    async create(
        @UserInfo() user: UserInfo,
        @Body() createDto: CreateEntriesDto,
    ) {
        const { content, images, datetime } = createDto

        if (content?.length == 0 && images?.length == 0) {
            throw new BadRequestException({ message: ['content atau images tidak boleh kosong'] })
        }

        if (moment.tz(datetime, user.timezone).isAfter(moment())) {
            throw new BadRequestException({ message: ['datetime tidak boleh lebih dari hari ini'] })
        }

        return await this.services.create(user, createDto);
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
