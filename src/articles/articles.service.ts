import {Injectable} from '@nestjs/common';
import {CreateArticleDto} from "./dto/create-article.dto";
import {ArticleDto} from "./dto/article.dto";

@Injectable()
export class ArticlesService {
    create(data: CreateArticleDto) {
        const article = new ArticleDto();
        article.title = data.title
        article.description = data.description
        article.text = data.text
        article.tags = data.tags
        article.createdAt = new Date()
        article.updatedAt = new Date()

        return article
    }

    getList() {
        console.log(`getList`)
    }

    getById(id: number) {
        console.log(`getById: ${id}`)
    }

    updateById(id: number) {
        console.log(`updateById: ${id}`)
    }

    deleteById(id: number) {
        console.log(`deleteById: ${id}`)
    }
}
