import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon2 from "argon2";
import { CreateUserDto } from '@/api/users/dto/create-user.dto';
import { UsersService } from '@/api/users/users.service';
import { JWTTokens } from '@/types/tokens';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private usersService: UsersService,
    ) { }

    signupLocal(dto: CreateUserDto): Promise<User> {
        return this.usersService.create(dto)
    }

    async signinLocal(dto: AuthDto): Promise<JWTTokens> {
        const user = await this.usersService.findOneByEmail(dto.email!);
        if (!user) throw new ForbiddenException('Access Denied');

        const passwordMatches = await argon2.verify(user.password, dto.password!);
        if (!passwordMatches) throw new ForbiddenException('Access Denied');

        const { id, email, timezone } = user
        const tokens = await this.getTokens(id, email, timezone);
        await this.usersService.updateRtHash(id, tokens.refreshToken);

        return tokens;
    }

    async logout(userId: number): Promise<boolean> {
        await this.usersService.deleteRtHash(userId)
        return true;
    }

    async refreshTokens(userId: number, refreshToken: string): Promise<JWTTokens> {
        const user = await this.usersService.findOne(userId)
        if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

        const rtMatches = await argon2.verify(user.hashedRt, refreshToken)
        if (!rtMatches) throw new ForbiddenException('Access Denied');

        const { id, email, timezone } = user
        const tokens = await this.getTokens(id, email, timezone);
        await this.usersService.updateRtHash(id, tokens.refreshToken);

        return tokens;
    }

    async getTokens(userId: number, email: string, timezone: string): Promise<JWTTokens> {
        const jwtPayload: UserInfo = { userId, email, timezone };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: process.env.JWT_SECRET_ACCESS_TOKEN,
                expiresIn: '10m',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: process.env.JWT_SECRET_REFRESH_TOKEN,
                expiresIn: '7d',
            }),
        ]);

        return { accessToken, refreshToken };
    }
}
