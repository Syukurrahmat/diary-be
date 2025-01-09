import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import express, { Request } from 'express';
import session from 'express-session';
import passport from 'passport';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptor/transform.interceptor';


async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
        origin: ['http://localhost:5173'],
        credentials:true,
        methods: ['GET', 'POST', 'DELETE', 'PATCH']
    });
    app.use(cookieParser());

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
 

    app.useGlobalInterceptors(new ResponseInterceptor())
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));


   
    await app.listen(3000);
}

bootstrap();