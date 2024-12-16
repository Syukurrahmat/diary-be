import { Module } from '@nestjs/common';
import { EntriedsModule } from './api/entries/entries.module';
import { TagsModule } from './api/tags/tags.module';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { GeocodingModule } from './api/geocoding/geocoding.module';

@Module({
    imports: [
        UsersModule,
        TagsModule,
        PrismaModule,
        AuthModule,
        EntriedsModule,
        GeocodingModule,
    ],
    controllers: [],
    providers: [PrismaService],
})


export class AppModule { }
