import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from "argon2";
import { JWTTokens } from 'src/types/tokens';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async signupLocal(dto: AuthDto): Promise<JWTTokens> {
        const user = await this.prisma.user.create({
            data: {
                name: 'xoxxo',
                email: dto.email!,
                password: await argon2.hash(dto.password!),
                timezone: 'Asia/Jakarta'
            },
        })

        const tokens = await this.getTokens(user.id, user.email, user.timezone);
        await this.updateRtHash(user.id, tokens.refreshToken);

        return tokens;
    }

    async signinLocal(dto: AuthDto): Promise<JWTTokens> {
        const user = await this.prisma.user.findUnique({
            select: { id: true, email: true, password: true, timezone: true },
            where: { email: dto.email },
        });

        if (!user) throw new ForbiddenException('Access Denied');
        
        const passwordMatches = await argon2.verify(user.password, dto.password!);
        if (!passwordMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email, user.timezone);
        await this.updateRtHash(user.id, tokens.refreshToken);

        return tokens;
    }

    async logout(userId: number): Promise<boolean> {
        await this.prisma.user.update({
            where: {
                id: userId,
                hashedRt: { not: null },
            },
            data: { hashedRt: null },
        });
        return true;
    }

    async refreshTokens(userId: number, refreshToken: string): Promise<JWTTokens> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

        const rtMatches = await argon2.verify(user.hashedRt, refreshToken)

        if (!rtMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email, user.timezone);
        await this.updateRtHash(user.id, tokens.refreshToken);

        return tokens;
    }

    async updateRtHash(userId: number, refreshToken: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRt: await argon2.hash(refreshToken) },
        });
    }

    async getTokens(userId: number, email: string, timezone: string): Promise<JWTTokens> {
        const jwtPayload: UserInfo = { userId, email, timezone };

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: process.env.JWT_SECRET_ACCESS_TOKEN,
                expiresIn: '10m',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: process.env.JWT_SECRET_REFRESH_TOKEN,
                expiresIn: '7d',
            }),
        ]);

        return {
            accessToken: at,
            refreshToken: rt,
        };
    }
}
