import {Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {EUserRole, UserEntity} from "../shared/models/user.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>
    ) {}

    async getUserById(id: number) {
        return await this.userRepo.findOne({
            where: {
                id
            }
        })
    }

    async getUserByEmail(email: string) {
        return await this.userRepo.findOne({
            where: {
                email
            }
        })
    }

    async createUser(name: string, email: string, hashPass: string): Promise<UserEntity> {
        const user = new UserEntity();

        user.name = name
        user.email = email.trim().toLowerCase()
        user.password = hashPass
        user.role = EUserRole.user

        return await user.save();
    }
}
