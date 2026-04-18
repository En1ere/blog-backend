import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignInResponseDto } from "./dto/sign-in-response.dto";
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import {SignUpDto} from "./dto/sign-up.dto";
import {SignUpResponseDto} from "./dto/sign-up-response.dto";
import {UserEntity} from "../shared/models/user.entity";
import {LessThan, MoreThan, Repository} from "typeorm";
import {RefreshTokenEntity} from "../shared/models/refresh-tokens.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {randomBytes} from "node:crypto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(RefreshTokenEntity)
        private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
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

    private generateSecureToken(): string {
        return randomBytes(48).toString('base64url');
    }

    async getTokens(user: UserEntity): Promise<SignInResponseDto> {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        const refreshToken = new RefreshTokenEntity()
        refreshToken.token = this.generateSecureToken()
        const expires = new Date()
        expires.setDate(expires.getDate() + 7)
        refreshToken.expires = expires
        refreshToken.user = user

        const refreshTokenCreated = await refreshToken.save();

        const accessToken = await this.jwtService.signAsync(payload)

        return new SignInResponseDto(accessToken, refreshTokenCreated.token)
    }

    async refreshToken(token: string): Promise<SignInResponseDto> {
        const now = new Date()
        const refreshToken = await this.refreshTokenRepo.findOne({
            relations: ['user'],
            where: {
                token,
                expires: MoreThan(now)
            }
        })

        if(!refreshToken) {
            throw new UnauthorizedException("Invalid refresh token")
        }

        return this.getTokens(refreshToken.user)
    }
}
