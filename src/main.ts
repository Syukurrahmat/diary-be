import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import express from 'express';

import { readFileSync } from 'fs';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptor/transform.interceptor';

const httpsOptions = process.env.NODE_ENV === 'DEVELOPMENT' ? {
    key: readFileSync('./localhost-key.pem', 'utf8'),
    cert: readFileSync('./localhost.pem', 'utf8'),
} : undefined

const port = process.env.PORT || 3000

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, { httpsOptions });

    app.enableCors({
        origin: process.env.CLIENT_HOST?.split(' '),
        credentials: true,
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

    await app.listen(port);
}

bootstrap();