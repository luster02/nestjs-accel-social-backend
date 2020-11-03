import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PostService } from './post.service'
import { PostGQL, Post } from './shcemas/post.schema'
import { PostDto } from './dto/post.dto'
import { GqlAuthGuard } from '@auth/guards/graphql.guard'
import { IJwtPayload } from '@auth/interfaces';
import { CurrentUser } from '@auth/decorators/user.decorator';
import { MutationResult } from '@gql/interfaces/mutation-result.interface'
import { CommentService } from '@comment/comment.service'

@Resolver(of => PostGQL)
@UseGuards(GqlAuthGuard)
export class PostResolver {
    constructor(
        private readonly _postService: PostService,
        private readonly _commentService: CommentService
    ) { }

    @Query(returns => PostGQL)
    async post(
        @Args('id') id: string
    ): Promise<Post> {
        return await this._postService.get(id)
    }

    @Query(returns => [PostGQL])
    async getUserFeed(
        @CurrentUser() user: IJwtPayload
    ): Promise<Post[]> {
        return await this._postService.feed(user.id)
    }

    @Query(returns => [PostGQL])
    async getPostByUser(
        @Args('id') id: string
    ): Promise<Post[]> {
        return await this._postService.getByUser(id)
    }

    @Mutation(returns => PostGQL)
    async createPost(
        @Args('postData') postData: PostDto
    ): Promise<Post> {
        return await this._postService.create(postData)
    }


    @Mutation(returns => PostGQL)
    async updatePost(
        @Args('id') id: string,
        @Args('content') content: string,
        @CurrentUser() user: IJwtPayload
    ): Promise<Post> {
        return await this._postService.update(id, content, user.id)
    }

    @Mutation(returns => MutationResult)
    async deletePost(
        @Args('id') id: string,
        @CurrentUser() user: IJwtPayload
    ): Promise<MutationResult> {
        await this._postService.delete(id, user.id)
        await this._commentService.deleteAllPostComments(id)
        return { success: true }
    }
}