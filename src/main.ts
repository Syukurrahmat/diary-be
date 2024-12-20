import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptor/transformInterceptor';
import { PrismaClient } from '@prisma/client';
import * as  moment from 'moment-timezone';


async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(
        session({
            secret: 'my-secret',
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 3600000 }
        }),
    );

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    app.use(passport.initialize())
    app.use(passport.session())

    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
    }));

    app.useGlobalInterceptors(new ResponseInterceptor())


    app.use((req, res, next) => {
        req.user = { userId: 1, timezone: 'Asia/Jakarta' } as UserInfo
        next()
    })


    await app.listen(3000);
}

bootstrap();

