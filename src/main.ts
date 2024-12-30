import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import rnd from 'randomstring';
import * as argon2 from "argon2";

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptor/transform.interceptor';
import { PrismaClient } from '@prisma/client';


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
        transformOptions: { enableImplicitConversion: true },
    }));

    app.useGlobalInterceptors(new ResponseInterceptor())

    app.use((r, _, n) => {
        r.user = { userId: 1, timezone: 'Asia/Jakarta' }
        n()
    })

    await app.listen(3000);
}

bootstrap();