import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthStrategy, RefreshTokenStrategy } from './jwt.strategy';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersService } from '@/api/users/users.service';



@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET_ACCESS_TOKEN,
            signOptions: { expiresIn: '60s' },
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService, JwtAuthStrategy, RefreshTokenStrategy,],
})

export class AuthModule { }
