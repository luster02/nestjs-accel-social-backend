import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CommentResponseGQL, CommentResponse } from '../shcemas/comment.response.shcema'
import { CommentService } from '../comment.service'
import { CommentResponseDto, LikeDto } from '../dto'
import { GqlAuthGuard } from '@auth/guards/graphql.guard'
import { MutationResult } from '@gql/interfaces/mutation-result.interface'
import { CurrentUser } from '@auth/decorators/user.decorator'
import { IJwtPayload } from '@auth/interfaces'

@Resolver(of => CommentResponseGQL)
@UseGuards(GqlAuthGuard)
export class CommentResponseResolver {
    constructor(
        private readonly _commentService: CommentService
    ) { }

    @Query(returns => CommentResponseGQL)
    async commentResponse(
        @Args('id') id: string
    ): Promise<CommentResponse> {
        return await this._commentService.getResponse(id)
    }

    @Query(returns => [CommentResponseGQL])
    async commentResponses(
        @Args('id') id: string
    ): Promise<CommentResponse[]> {
        return await this._commentService.getResponseComments(id)
    }

    @Mutation(returns => CommentResponseGQL)
    async createCommentReponse(
        @Args('responseData') responseData: CommentResponseDto
    ): Promise<CommentResponse> {
        return await this._commentService.createResponse(responseData)
    }

    @Mutation(returns => CommentResponseGQL)
    async likeCommentResponse(
        @Args('likeData') likeData: LikeDto
    ): Promise<CommentResponse> {
        return await this._commentService.likeReponse(likeData)
    }

    @Mutation(returns => MutationResult)
    async deleteCommentResponse(
        @Args('id') id: string,
        @CurrentUser() user: IJwtPayload
    ): Promise<MutationResult> {
        await this._commentService.deleteResponse(id, user.id)
        return { success: true }
    }
}