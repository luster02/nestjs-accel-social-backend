import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { PostService } from './post.service';
import { PostSchema } from './shcemas/post.schema'
import { PostResolver } from './post.resolver'
import { UserSchema } from '@user/schemas/user.schema'
import { CommentModule } from '@comment/comment.module'

@Module({
  imports: [
    CommentModule,
    MongooseModule.forFeatureAsync([
      {
        name: 'Post',
        useFactory: () => {
          const schema = PostSchema
          schema.plugin(require('mongoose-autopopulate'))
          return schema
        }
      },
      {
        name: 'User',
        useFactory: () => {
          const schema = UserSchema
          return schema
        }
      }
    ]),
  ],
  providers: [PostService, PostResolver]
})
export class PostModule { }
