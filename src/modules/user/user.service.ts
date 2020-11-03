import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './schemas/user.schema'
import { UserDetails } from './schemas/user.detail.shcema'
import { UserDetailsDto, ConnectionDto } from './dto'

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<User>,
        @InjectModel('UserDetails')
        private readonly userDetailsModel: Model<UserDetails>
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

    async delete(id: string): Promise<void> {
        await this.get(id)
        await this.userModel.findByIdAndDelete(id);
    }

}
