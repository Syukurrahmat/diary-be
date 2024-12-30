import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_ACCESS_TOKEN,
        });
    }

    validate(payload: UserInfo) {
        return payload;
    }
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_REFRESH_TOKEN,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: UserInfo) {
        const refreshToken = req
            ?.get('authorization')
            ?.replace('Bearer', '')
            .trim();


        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

        return { ...payload, refreshToken };
    }
}


