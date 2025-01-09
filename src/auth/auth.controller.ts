import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';


import { Request, Response } from 'express';
import { IsPublic } from 'src/common/decorator/public.decorator';
import { UserInfo } from 'src/common/decorator/user.decorator';
import { RefreshTokenGuard } from 'src/common/guards/jwt.guard';
import { JWTTokens } from 'src/types/tokens';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @IsPublic()
    @Post('signup')
    signupLocal(@Body() dto: AuthDto): Promise<JWTTokens> {
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
        this.sendRefreshTokenAtHTTPOnly(res, refreshToken)
        return { accessToken };
    }

    @Post('signout')
    logout(@UserInfo() { userId }: UserInfo): Promise<boolean> {
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
        this.sendRefreshTokenAtHTTPOnly(res, refreshToken)
        return { accessToken }
    }

    private sendRefreshTokenAtHTTPOnly(res: Response, refreshToken: string) {
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
}
