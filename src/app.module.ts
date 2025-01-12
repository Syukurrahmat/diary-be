import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { EntriedsModule } from './api/entries/entries.module';
import { GeocodingModule } from './api/geocoding/geocoding.module';
import { HabitModule } from './api/habits/habits.module';
import { JournalsModule } from './api/journals/journals.module';
import { TagsModule } from './api/tags/tags.module';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt.guard';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

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
        PassportModule.register({
            session: false,
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
    ],
    controllers: [],
    providers: [
        PrismaService,
        { provide: APP_GUARD, useClass: JwtAuthGuard }
    ],
})


export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes('*')
    }
}