import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose'
import { ChatSchema } from './shcema/chat.schema'
import { MessageSchema } from './shcema/message.chema'
import { ChatResolver, MessageResolver } from './resolvers'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Chat',
        useFactory: () => {
          const schema = ChatSchema
          return schema
        }
      },
      {
        name: 'Message',
        useFactory: () => {
          const schema = MessageSchema
          schema.plugin(require('mongoose-autopopulate'))
          return schema
        }
      }
    ])
  ],
  providers: [ChatService, ChatResolver, MessageResolver]
})
export class ChatModule { }
