import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ChatDto } from '../dto'
import { ChatGql, Chat } from '../shcema/chat.schema'
import { ChatService } from '../chat.service'
import { GqlAuthGuard } from '@auth/guards/graphql.guard'
import { MutationResult } from '@gql/interfaces/mutation-result.interface'
import { CurrentUser } from '@auth/decorators/user.decorator'
import { IJwtPayload } from '@auth/interfaces'

@UseGuards(GqlAuthGuard)
@Resolver(of => ChatGql)
export class ChatResolver {
    constructor(
        private readonly _chatService: ChatService
    ) { }

    @Query(returns => ChatGql)
    async chat(
        @Args('id') id: string,
        @CurrentUser() user: IJwtPayload
    ): Promise<Chat> {
        return await this._chatService.getChat(id, user.id)
    }

    @Query(returns => [ChatGql])
    async chats(
        @CurrentUser() user: IJwtPayload
    ): Promise<Chat[]> {
        return await this._chatService.getChats(user.id)
    }

    @Mutation(returns => ChatGql)
    async createChat(
        @Args('chatData') chatData: ChatDto
    ): Promise<Chat> {
        return await this._chatService.createChat(chatData)
    }

    @Mutation(returns => MutationResult)
    async deleteChat(
        @Args('id') id: string,
        @CurrentUser() user: IJwtPayload
    ): Promise<MutationResult> {
        await this._chatService.deleteChat(id, user.id)
        return { success: true }
    }

}