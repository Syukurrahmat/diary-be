import { Module } from '@nestjs/common';
import { ImgbbService } from 'src/lib/Imgbb/Imgbb.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';
import { GeocodingService } from '../geocoding/geocoding.service';


@Module({
  imports: [PrismaModule],
  controllers: [EntriesController],
  providers: [EntriesService, ImgbbService, GeocodingService],
})
export class EntriedsModule { }
