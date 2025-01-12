import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'; //prettier-ignore
import { Request, Response } from 'express';
import { CreateUserDto } from '@/api/users/dto/create-user.dto';
import { IsPublic } from '@/common/decorator/public.decorator';
import { UserInfo } from '@/common/decorator/user.decorator';
import { RefreshTokenGuard } from '@/common/guards/jwt.guard';
import { JWTTokens } from '@/types/tokens';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @IsPublic()
    @Post('signup')
    signupLocal(@Body() dto: CreateUserDto): Promise<User> {
        return this.authService.signupLocal(dto);
    }

    @IsPublic()
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signinLocal(
        @Res({ passthrough: true }) res: Response,
        @Body() dto: AuthDto
    ) {
        const { accessToken, refreshToken } = await this.authService.signinLocal(dto);
        this.sendRefreshTokenAtHTTPCookie(res, refreshToken)
        return { accessToken };
    }

    @Post('signout')
    logout(
        @Res({ passthrough: true }) res: Response,
        @UserInfo() { userId }: UserInfo
    ): Promise<boolean> {
        this.cleartRefreshTokenAtHTTPCookie(res)
        return this.authService.logout(userId);
    }

    @IsPublic()
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    async refreshTokens(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @UserInfo() { userId }: UserInfo
    ) {
        const { refreshToken, accessToken } = await this.authService.refreshTokens(userId, req.cookies.refresh_token);
        this.sendRefreshTokenAtHTTPCookie(res, refreshToken)
        return { accessToken }
    }

    private sendRefreshTokenAtHTTPCookie(res: Response, refreshToken: string) {
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    private cleartRefreshTokenAtHTTPCookie(res: Response) {
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
    }
}
