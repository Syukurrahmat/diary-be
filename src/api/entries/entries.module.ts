import { Module } from '@nestjs/common';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';
import { GeocodingService } from '../geocoding/geocoding.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { ImgbbService } from '@/lib/Imgbb/Imgbb.service';


@Module({
  imports: [PrismaModule],
  controllers: [EntriesController],
  providers: [EntriesService, ImgbbService, GeocodingService],
})
export class EntriedsModule { }
