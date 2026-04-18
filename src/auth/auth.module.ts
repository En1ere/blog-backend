import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../shared/models/user.entity";
import { UsersService } from "../users/users.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '600s' }
        })
    ],
    providers: [AuthService, UsersService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
