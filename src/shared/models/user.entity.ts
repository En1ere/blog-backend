import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {ArticleEntity} from "./article.entity";
import {RefreshTokenEntity} from "./refresh-tokens.entity";

export enum EUserRole {
    admin = 'admin',
    user = 'user',
}

@Entity("users")
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ enum: EUserRole })
    role: EUserRole

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date

    @OneToMany(() => ArticleEntity, item => item.author)
    articles: ArticleEntity[]

    @OneToMany(() => RefreshTokenEntity, (item) => item.user)
    refreshTokens: RefreshTokenEntity[]
}