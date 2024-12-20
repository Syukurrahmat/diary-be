import { Module } from '@nestjs/common';
import { ImgbbService } from 'src/lib/Imgbb/Imgbb.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JournalsController } from './journals.controller';
import { JournalService } from './journals.service';
import { GeocodingService } from '../geocoding/geocoding.service';


@Module({
  imports: [PrismaModule],
  controllers: [JournalsController],
  providers: [JournalService, ImgbbService, GeocodingService],
})
export class JournalsModule { }
