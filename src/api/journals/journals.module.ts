import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { JournalsController } from './journals.controller';
import { JournalService } from './journals.service';


@Module({
  imports: [PrismaModule],
  controllers: [JournalsController],
  providers: [JournalService],
})
export class JournalsModule { }
