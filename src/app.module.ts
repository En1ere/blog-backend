import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import {dataSourceOptions} from "../db/data-source";

@Module({
  imports: [
      TypeOrmModule.forRoot(dataSourceOptions),
      UsersModule,
      ArticlesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
