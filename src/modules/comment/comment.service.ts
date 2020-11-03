import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CommentResponse } from './shcemas/comment.response.shcema'
import { Comment } from './shcemas/comment.schema'
import { CommentDto, CommentResponseDto, LikeDto } from './dto'

@Injectable()
export class CommentService {
    constructor(
        @InjectModel('Comment')
        private readonly commentModel: Model<Comment>,
        @InjectModel('CommentResponse')
        private readonly commentResponseModel: Model<CommentResponse>,
    ) { }

    async getComment(id: string): Promise<Comment> {
        if (!id) throw new BadRequestException('comment id must be sent');
        const comment: Comment = await this.commentModel.findById(id);
        if (!comment) throw new NotFoundException();
        return comment;
    }

    async getPostComments(id: string): Promise<Comment[]> {
        if (!id) throw new BadRequestException('post id must be sent');
        return await this.commentModel.find({ post: id })
    }

    async createComment(commentData: CommentDto): Promise<Comment> {
        const comment: Comment = new this.commentModel(commentData)
        return await comment.save()
    }

    async likeComment(likeData: LikeDto): Promise<Comment> {
        const comment: Comment = await this.getComment(likeData._id)
        if (!comment.likes.includes(likeData.like)) {
            return await this.commentModel.findByIdAndUpdate(likeData._id, {
                $push: {
                    likes: likeData.like
                }
            }, { new: true });
        } else {
            return await this.commentModel.findByIdAndUpdate(likeData._id, {
                $pull: {
                    likes: likeData.like
                }
            }, { new: true });
        }
    }

    async deleteComment(id: string, userId: string): Promise<void> {
        const comment: Comment = await this.getComment(id)
        if (comment.user !== userId) throw new UnauthorizedException()
        await comment.remove()
        await this.deleteAllCommentReponses(id)
    }

    async deleteAllPostComments(id: string): Promise<void> {
        if (!id) throw new BadRequestException('post id must be sent');
        const comments: Comment[] = await this.commentModel.find({ post: id })
        comments.map(async (el) => {
            await el.remove()
        })
    }

    async getResponse(id: string): Promise<CommentResponse> {
        if (!id) throw new BadRequestException('response id must be sent');
        const response: CommentResponse = await this.commentResponseModel.findById(id);
        if (!response) throw new NotFoundException();
        return response;
    }

    async getResponseComments(id: string): Promise<CommentResponse[]> {
        if (!id) throw new BadRequestException('comment id must be sent');
        return await this.commentResponseModel.find({ comment: id })
    }

    async createResponse(responseData: CommentResponseDto): Promise<CommentResponse> {
        const response: CommentResponse = new this.commentResponseModel(responseData)
        return await response.save()
    }

    async likeReponse(likeData: LikeDto): Promise<CommentResponse> {
        const response: CommentResponse = await this.getResponse(likeData._id)
        if (!response.likes.includes(likeData.like)) {
            return await this.commentResponseModel.findByIdAndUpdate(likeData._id, {
                $push: {
                    likes: likeData.like
                }
            }, { new: true });
        } else {
            return await this.commentResponseModel.findByIdAndUpdate(likeData._id, {
                $pull: {
                    likes: likeData.like
                }
            }, { new: true });
        }
    }

    async deleteResponse(id: string, userId: string): Promise<void> {
        if (!id) throw new BadRequestException('response id must be sent');
        const response: CommentResponse = await this.getResponse(id)
        if (response.user !== userId) throw new UnauthorizedException()
        await response.remove()
    }

    private async deleteAllCommentReponses(id: string): Promise<void> {
        const responses: CommentResponse[] = await this.commentResponseModel.find({ comment: id })
        responses.map(response => {
            response.remove()
        })
    }

}
