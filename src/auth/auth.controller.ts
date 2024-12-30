import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';


import { AuthService } from './auth.service';
// import Express  from 'express'
import { UserInfo } from 'src/common/decorator/user.decorator';
import { RefreshTokenGuard } from 'src/common/guards/jwt.guard';
import { IsPublic } from 'src/common/decorator/public.decorator';
import { AuthDto } from './dto/auth.dto';
import { JWTTokens } from 'src/types/tokens';

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
    signinLocal(@Body() dto: AuthDto): Promise<JWTTokens> {
        return this.authService.signinLocal(dto);
    }

    @Post('signout')
    logout(@UserInfo() { userId }: UserInfo): Promise<boolean> {
        return this.authService.logout(userId);
    }

    @IsPublic()
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    refreshTokens(
        @Request() req: any,
        @UserInfo() { userId }: UserInfo
    ): Promise<JWTTokens> {
        const refreshToken = req.user.refreshToken

        console.log('====================== refreshToken')
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
