import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module'
import { DatabaseModule } from './database/database.module'
import { IEnvironmentVariables } from './config/config.interface'
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { GqlModule } from './gql/gql.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { ChatModule } from './modules/chat/chat.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    GqlModule,
    PostModule,
    CommentModule,
    ChatModule,
    CloudinaryModule
  ],
  controllers: [AppController],
})
export class AppModule {
  static port: number;
  constructor(private configService: ConfigService<IEnvironmentVariables>) {
    AppModule.port = this.configService.get<number>('PORT')
  }
}
