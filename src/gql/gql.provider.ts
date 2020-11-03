import { join } from "path";
import { GraphQLModule } from "@nestjs/graphql";
import { UserModule } from '@user/user.module'
import { AuthModule } from '@auth/auth.module'
import { PostModule } from '@post/post.module'
import { CommentModule } from '@comment/comment.module'
import { ChatModule } from '@chat/chat.module'

export const gqlProvider = [
    GraphQLModule.forRoot({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        context: ({ req }) => ({ req }),
        installSubscriptionHandlers: true,
        include: [
            UserModule,
            AuthModule,
            PostModule,
            CommentModule,
            ChatModule
        ]
    })
]