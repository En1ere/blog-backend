import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserEntity} from "./user.entity";

@Entity("articles")
export class ArticleEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    text: string

    @Column({ nullable: true })
    description: string

    @Column({ nullable: true })
    tags: string

    @CreateDateColumn({ name: "created_at" })
    createdAt: string

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: string

    @ManyToOne(() => UserEntity, item => item.articles)
    @JoinColumn({ name: "user_id" })
    author: UserEntity
}