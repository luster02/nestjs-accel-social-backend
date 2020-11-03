import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CommentGQL, Comment } from '../shcemas/comment.schema'
import { CommentService } from '../comment.service'
import { CommentDto, LikeDto } from '../dto/index'
import { GqlAuthGuard } from '@auth/guards/graphql.guard'
import { MutationResult } from '@gql/interfaces/mutation-result.interface'
import { CurrentUser } from '@auth/decorators/user.decorator'
import { IJwtPayload } from '@auth/interfaces'

@Resolver(of => CommentGQL)
@UseGuards(GqlAuthGuard)
export class CommentResolver {
    constructor(
        private readonly _commentService: CommentService
    ) { }

    @Query(returns => CommentGQL)
    async comment(
        @Args('id') id: string
    ): Promise<Comment> {
        return await this._commentService.getComment(id)
    }

    @Query(returns => [CommentGQL])
    async comments(
        @Args('id') id: string
    ): Promise<Comment[]> {
        return await this._commentService.getPostComments(id)
    }

    @Mutation(returns => CommentGQL)
    async createComment(
        @Args('commentData') commentData: CommentDto
    ): Promise<Comment> {
        return await this._commentService.createComment(commentData)
    }

    @Mutation(returns => CommentGQL)
    async likeComment(
        @Args('likeData') likeData: LikeDto
    ): Promise<Comment> {
        return await this._commentService.likeComment(likeData)
    }

    @Mutation(returns => MutationResult)
    async deleteComment(
        @Args('id') id: string,
        @CurrentUser() user: IJwtPayload
    ): Promise<MutationResult> {
        await this._commentService.deleteComment(id, user.id)
        return { success: true }
    }

}