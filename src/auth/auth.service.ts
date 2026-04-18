import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignInResponseDto } from "./dto/sign-in-response.dto";
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import {SignUpDto} from "./dto/sign-up.dto";
import {SignUpResponseDto} from "./dto/sign-up-response.dto";
import {UserEntity} from "../shared/models/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}


    async signIn(data: SignInDto): Promise<SignInResponseDto> {
        const user = await this.userService.getUserByEmail(data.email)

        if(!user) {
            throw new BadRequestException("User not found")
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password)
        if(!isPasswordValid) {
            throw new UnauthorizedException("Invalid password")
        }

        return this.getTokens(user);
    }
    async signUp(data: SignUpDto): Promise<SignUpResponseDto> {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
        if(!isEmailValid) {
            throw new BadRequestException("Invalid email")
        }

        const user = await this.userService.getUserByEmail(data.email);
        if(user) {
            throw new BadRequestException("User already exists")
        }

        const hashPass = await bcrypt.hash(data.password, 10);

        const userCreated = await this.userService.createUser(
            data.name,
            data.email,
            hashPass
        )

        return this.getTokens(userCreated);
    }

    async getTokens(user: UserEntity): Promise<SignInResponseDto> {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        const accessToken = await this.jwtService.signAsync(payload)
        const refreshToken = ""

        return new SignInResponseDto(accessToken, refreshToken)
    }
}
