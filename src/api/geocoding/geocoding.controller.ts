import { Controller, Get, Query } from '@nestjs/common';
import { ReverseQuery, SearchQuery } from './dto/query.dto';
import { GeocodingService } from './geocoding.service';

@Controller('geocoding')
export class GeocodingController {
    constructor(private readonly services: GeocodingService) { }

    @Get('/search')
    async search(@Query() { q }: SearchQuery) {
        return await this.services.search(q!);
    }

    @Get('/reverse')
    async findOne(@Query() { lat, lng }: ReverseQuery) {
        return await this.services.reverse(lat!, lng!);
    }
}
