import { BadRequestException, Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './schemas/user.schema'
import { UserDetails } from './schemas/user.detail.shcema'
import { UserDetailsDto, ConnectionDto, UserUploadDto } from './dto'
import { CloudinaryService } from '@cloudinary/cloudinary.service'
import { UploadResponse } from '@cloudinary/interfaces/upload-response.interface'
import { FileUpload } from '@gql/scalars/upload.scalar'

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<User>,
        @InjectModel('UserDetails')
        private readonly userDetailsModel: Model<UserDetails>,
        @Inject(CloudinaryService)
        private readonly _cloudinaryService: CloudinaryService
    ) { }

    async get(id: string): Promise<User> {
        if (!id) throw new BadRequestException('id must be sent');
        const user: User = await this.userModel.findById(id);
        if (!user) throw new NotFoundException();
        return user;
    }

    async sendRequest(conectionData: ConnectionDto): Promise<User> {
        if (!conectionData.user_id) throw new BadRequestException('user id must be sent');
        return await this.userModel.findByIdAndUpdate(conectionData.user_id, {
            $push: {
                requests: conectionData.requesting_user_id
            }
        })
    }

    async confirmRequest(conectionData: ConnectionDto): Promise<User> {
        if (!conectionData.user_id) throw new BadRequestException('user id must be sent');
        await this.userModel.findByIdAndUpdate(conectionData.user_id, {
            $push: {
                contacts: conectionData.requesting_user_id
            }
        })
        return await this.userModel.findByIdAndUpdate(conectionData.user_id, {
            $pull: {
                requests: conectionData.requesting_user_id
            }
        }, { new: true })
    }

    async declineRequest(conectionData: ConnectionDto): Promise<User> {
        if (!conectionData.user_id) throw new BadRequestException('user id must be sent');
        return await this.userModel.findByIdAndUpdate(conectionData.user_id, {
            $pull: {
                requests: conectionData.requesting_user_id
            }
        }, { new: true })
    }

    async getDetails(id: string): Promise<UserDetails> {
        if (!id) throw new BadRequestException('user id must be sent');
        const details = await this.userDetailsModel.findById(id)
        if (!details) throw new NotFoundException();
        return details;
    }

    async createDetails(detailsData: UserDetailsDto): Promise<UserDetails> {
        const details = new this.userDetailsModel(detailsData)
        return details.save()
    }

    async updateDetails(detailsData: UserDetailsDto): Promise<UserDetails> {
        if (!detailsData.user) throw new BadRequestException('user id must be sent');
        const details = await this.userDetailsModel.findByIdAndUpdate(detailsData.user, detailsData, { new: true })
        return details
    }

    async uploadFile(fileInput: FileUpload, uploadData: UserUploadDto): Promise<UserDetails> {
        const details: UserDetails = await this.userDetailsModel.findById(uploadData.userId)
        if (details.secure_url) throw new BadRequestException('you must be delete last file')
        const { public_id, secure_url }: UploadResponse = await this._cloudinaryService.upload_stream(fileInput, uploadData.folderName)
        return await this.userDetailsModel.findByIdAndUpdate(uploadData.userId, { public_id, secure_url }, { new: true })
    }

    async deleteFile(id: string, public_id: string): Promise<UserDetails> {
        await this._cloudinaryService.destroy(public_id)
        return await this.userDetailsModel.findByIdAndUpdate(id, {
            public_id: null,
            secure_url: null
        })
    }

    async delete(id: string): Promise<void> {
        await this.get(id)
        await this.userModel.findByIdAndDelete(id);
    }

}
