import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { CommentService } from './comment.service';
import { CommentSchema } from './shcemas/comment.schema'
import { CommentResponseSchema } from './shcemas/comment.response.shcema'
import { CommentResolver, CommentResponseResolver } from './resolvers'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Comment',
        useFactory: () => {
          const schema = CommentSchema
          schema.plugin(require('mongoose-autopopulate'))
          return schema
        }
      },
      {
        name: 'CommentResponse',
        useFactory: () => {
          const schema = CommentResponseSchema
          schema.plugin(require('mongoose-autopopulate'))
          return schema
        }
      }
    ]),
  ],
  providers: [CommentService, CommentResolver, CommentResponseResolver],
  exports: [CommentService]
})
export class CommentModule { }
