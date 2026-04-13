import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from "./dto/create-article.dto";
import { ArticleDto } from "./dto/article.dto";
import { ArticleEntity } from "../shared/models/article.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../shared/models/user.entity";
import {UpdateArticleDto} from "./dto/update-article.dto";

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepo: Repository<ArticleEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {}

    async create(data: CreateArticleDto) {
        const user = await this.userRepo.findOne({
            where: {
                id: 1
            }
        }).catch(err => {
            console.log(err)
            return null
        })

        if(!user) {
            throw new NotFoundException("User not found!");
        }

        const article = new ArticleEntity();

        article.title = data.title
        article.text = data.text
        article.description = data.description
        article.tags = data.tags
        article.author = user

        const res = await article.save();

        return new ArticleDto(res);
    }

    async getList() {
        const articles = await this.articleRepo.find().catch(err => {
            console.log(err)
            return []
        })

        return (articles).map(article => new ArticleDto(article));
    }

    async getById(id: number) {
        const article = await this.articleRepo.findOne({
            where: {
                id
            }
        }).catch(err => {
            console.log(err)
            return null
        })

        if(!article) {
            throw new NotFoundException("Article not found!")
        }

        return new ArticleDto(article)
    }

    async updateById(id: number, data: UpdateArticleDto) {
        await this.articleRepo.update({id}, {
            title: data.title,
            text: data.text,
            description: data.description,
            tags: data.tags,
        }).catch(err => {
            console.log(err)
            return null
        })

        return await this.getById(id)
    }

    async deleteById(id: number) {
        await this.articleRepo.delete(id).catch(err => {
            console.log(err)
            return null
        })
    }
}
