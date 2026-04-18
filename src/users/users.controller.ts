import {Controller, Get, UseGuards, Request} from '@nestjs/common';
import {UsersService} from "./users.service";
import {UserDto} from "./dto/user.dto";
import {AuthGuard} from "../auth/auth.guard";
import {UserEntity} from "../shared/models/user.entity";

@Controller('users')
export class UsersController {
    constructor(
        private readonly service: UsersService
    ) {}

    @Get('me')
    @UseGuards(AuthGuard)
    async getMe(@Request() req: any): Promise<UserDto> {
        const user = await this.service.getUserById(req.user?.id);
        return new UserDto(user as UserEntity)
    }
}
