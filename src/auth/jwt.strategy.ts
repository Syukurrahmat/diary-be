import { Injectable } from '@nestjs/common';
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
            jwtFromRequest: ExtractJwt.fromExtractors([RefreshTokenStrategy.extractJWTFromCookie]),
            secretOrKey: process.env.JWT_SECRET_REFRESH_TOKEN,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: UserInfo) {
        return payload
    }

    private static extractJWTFromCookie(req: Request) {
        if (req.cookies && 'refresh_token' in req.cookies && req.cookies.refresh_token.length > 0) {
            return req.cookies.refresh_token
        }
    }
}


