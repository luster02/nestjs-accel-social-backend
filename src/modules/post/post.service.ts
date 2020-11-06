import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Post } from './shcemas/post.schema'
import { PostDto, PostLikeDto, PostUploadDto } from './dto'
import { User } from '@user/schemas/user.schema'
import { CloudinaryService } from '@cloudinary/cloudinary.service'
import { UploadResponse } from '@cloudinary/interfaces/upload-response.interface'
import { FileUpload } from '@gql/scalars/upload.scalar'

@Injectable()
export class PostService {
    constructor(
        @InjectModel('Post')
        private readonly postModel: Model<Post>,
        @InjectModel('User')
        private readonly userModel: Model<User>,
        @Inject(CloudinaryService)
        private readonly _cloudinaryService: CloudinaryService
    ) { }

    async get(id: string): Promise<Post> {
        if (!id) throw new BadRequestException('post id must be sent');
        const post: Post = await this.postModel.findById(id);
        if (!post) throw new NotFoundException();
        return post;
    }

    async feed(id: string): Promise<Post[]> {
        const user: User = await this.userModel.findById(id)
        return await this.postModel.find({ user: { $in: user.contacts } })
    }

    async getByUser(id: string): Promise<Post[]> {
        if (!id) throw new BadRequestException('post id must be sent');
        return await this.postModel.find({ user: id })
    }

    async create(postData: PostDto): Promise<Post> {
        const post: Post = new this.postModel(postData)
        return await post.save()
    }

    async update(id: string, content: string, userId: string): Promise<Post> {
        const post: Post = await this.get(id)
        if (post.user !== userId) throw new UnauthorizedException()
        return await this.postModel.findByIdAndUpdate(id, { content }, { new: true })
    }

    async likePost(likeData: PostLikeDto): Promise<Post> {
        const post: Post = await this.get(likeData._id)
        if (!post.likes.includes(likeData.like)) {
            return await this.postModel.findByIdAndUpdate(likeData._id, {
                $push: {
                    likes: likeData.like
                }
            }, { new: true });
        } else {
            return await this.postModel.findByIdAndUpdate(likeData._id, {
                $pull: {
                    likes: likeData.like
                }
            }, { new: true });
        }
    }

    async uploadFile(fileInput: FileUpload, uploadData: PostUploadDto): Promise<Post> {
        const post: Post = await this.postModel.findById(uploadData.postId)
        if (post.secure_url) throw new BadRequestException('you must be delete last file')
        const { public_id, secure_url }: UploadResponse = await this._cloudinaryService.upload_stream(fileInput, uploadData.folderName)
        return await this.postModel.findByIdAndUpdate(uploadData.postId, { public_id, secure_url }, { new: true })
    }

    async deleteFile(id: string, public_id: string): Promise<Post> {
        await this._cloudinaryService.destroy(public_id)
        return await this.postModel.findByIdAndUpdate(id, {
            public_id: null,
            secure_url: null
        })
    }

    async delete(id: string, userId: string): Promise<void> {
        const post: Post = await this.get(id)
        if (post.user !== userId) throw new UnauthorizedException()
        await this.postModel.findByIdAndDelete(id)
        this._cloudinaryService.destroy(post.public_id)
    }

}
