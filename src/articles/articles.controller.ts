import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {ArticlesService} from "./articles.service";
import {CreateArticleDto} from "./dto/create-article.dto";
import {UpdateArticleDto} from "./dto/update-article.dto";
import {AuthGuard} from "../auth/auth.guard";
import {Roles} from "../roles.decorator";
import {EUserRole} from "../shared/models/user.entity";
import { RolesGuard } from "../roles.guard";

@Controller('articles')
export class ArticlesController {
    constructor(private readonly service: ArticlesService) {
    }

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(EUserRole.admin, EUserRole.moderator)
    create(@Body() data: CreateArticleDto) {
        return this.service.create(data)
    }

    @Get()
    getList() {
        return this.service.getList()
    }

    // http://127.0.0.1:3000/articles/1
    @Get(":id")
    getById(@Param("id") id: number) {
        return this.service.getById(id)
    }

    @Put(":id")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(EUserRole.admin, EUserRole.moderator)
    updateById(@Param("id") id: number, @Body() data: UpdateArticleDto) {
        return this.service.updateById(id, data)
    }

    @Delete(":id")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(EUserRole.admin, EUserRole.moderator)
    deleteById(@Param("id") id: number) {
        return this.service.deleteById(id)
    }
}
