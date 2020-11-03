import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions'
import { UseGuards } from '@nestjs/common';
import { MessageDto } from '../dto'
import { MessageGql, Message } from '../shcema/message.chema'
import { ChatService } from '../chat.service'
import { GqlAuthGuard } from '@auth/guards/graphql.guard'
import { MutationResult } from '@gql/interfaces/mutation-result.interface'
import { CurrentUser } from '@auth/decorators/user.decorator'
import { IJwtPayload } from '@auth/interfaces'

const pubSub = new PubSub()

@Resolver(of => MessageGql)
export class MessageResolver {
    constructor(
        private readonly _chatService: ChatService
    ) { }

    @UseGuards(GqlAuthGuard)
    @Query(returns => [MessageGql])
    async messages(
        @Args('id') id: string,
        @CurrentUser() user: IJwtPayload
    ): Promise<Message[]> {
        return await this._chatService.getMessages(id, user.id)
    }

    @Subscription(returns => MessageGql, {
        filter: (payload, variables) =>
            payload.message.chat === variables.id
    })
    async messageSubscription(
        @Args('id') id: string
    ) {
        return await pubSub.asyncIterator('messageSent')
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(returns => MessageGql)
    async sendMessage(
        @Args('messageData') messageData: MessageDto,
        @CurrentUser() user: IJwtPayload
    ): Promise<Message> {
        const message = await this._chatService.sendMessage(messageData, user.id)
        pubSub.publish('messageSent', { message })
        return message
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(returns => MutationResult)
    async hideMessage(
        @Args('id') id: string,
        @CurrentUser() user: IJwtPayload
    ): Promise<MutationResult> {
        await this._chatService.hideMessage(id, user.id)
        return { success: true }
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(returns => MutationResult)
    async deleteMessage(
        @Args('id') id: string,
        @CurrentUser() user: IJwtPayload
    ): Promise<MutationResult> {
        await this._chatService.deleteMessage(id, user.id)
        return { success: true }
    }
}