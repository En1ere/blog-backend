import {Body, Controller, Post} from '@nestjs/common';
import { AuthService } from "./auth.service";
import { SignInResponseDto } from "./dto/sign-in-response.dto";
import {SignInDto} from "./dto/sign-in.dto";
import {SignUpDto} from "./dto/sign-up.dto";
import {SignUpResponseDto} from "./dto/sign-up-response.dto";
import {RefreshTokenDto} from "./dto/refresh-token.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly service: AuthService
    ) {}

    @Post('sign-in')
    async signIn(@Body() data: SignInDto): Promise<SignInResponseDto> {
        return this.service.signIn(data)
    }

    @Post('sign-up')
    async signUp(@Body() data: SignUpDto): Promise<SignUpResponseDto> {
        return this.service.signUp(data);
    }

    @Post('refresh-token')
    async refreshToken(@Body() data: RefreshTokenDto): Promise<SignInResponseDto> {
        return this.service.refreshToken(data.token)
    }
}
