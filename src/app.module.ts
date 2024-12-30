import { Module } from '@nestjs/common';
import { EntriedsModule } from './api/entries/entries.module';
import { GeocodingModule } from './api/geocoding/geocoding.module';
import { JournalsModule } from './api/journals/journals.module';
import { TagsModule } from './api/tags/tags.module';
import { UsersModule } from './api/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { HabitModule } from './api/habits/habits.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt.guard';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        UsersModule,
        TagsModule,
        PrismaModule,
        AuthModule,
        EntriedsModule,
        GeocodingModule,
        HabitModule,
        JournalsModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
    ],
    controllers: [],
    providers: [
        PrismaService,
        // { provide: APP_GUARD, useClass: JwtAuthGuard }
    ],
})


export class AppModule { }
