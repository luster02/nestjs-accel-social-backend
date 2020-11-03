import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Chat } from './shcema/chat.schema'
import { Message } from './shcema/message.chema'
import { ChatDto, MessageDto } from './dto'

@Injectable()
export class ChatService {
    constructor(
        @InjectModel('Chat')
        private readonly chatModel: Model<Chat>,
        @InjectModel('Message')
        private readonly messageModel: Model<Message>
    ) { }

    async getChat(id: string, userId: string): Promise<Chat> {
        if (!id) throw new BadRequestException('chat id must be sent');
        const chat: Chat = await this.chatModel.findOne({
            _id: id,
            hide: {
                $ne: userId
            }
        })
        if (!chat) throw new NotFoundException()
        return chat
    }

    async getChats(userId: string): Promise<Chat[]> {
        if (!userId) throw new BadRequestException('user id must be sent');
        return await this.chatModel.find({
            $or: [
                { reciver: userId },
                { sender: userId }
            ],
            hide: {
                $ne: userId
            }
        })
    }

    async createChat(chatData: ChatDto): Promise<Chat> {
        const chat: Chat = new this.chatModel(chatData)
        return await chat.save()
    }

    async deleteChat(id: string, userId: string): Promise<void> {
        if (!id) throw new BadRequestException('chat id must be sent');
        const chat = await this.chatModel.findByIdAndUpdate(id, {
            $push: {
                hide: userId
            }
        })
        if (chat.hide.length === 2) {
            await chat.remove()
            await this.deleteAllChatMessages(id)
        }
    }

    async getMessages(id: string, userId: string): Promise<Message[]> {
        if (!id) throw new BadRequestException('chat id must be sent');
        return await this.messageModel.find({
            chat: id,
            hide: {
                $ne: userId
            }
        })
    }

    async sendMessage(messageData: MessageDto, userId: string): Promise<Message> {
        const message: Message = new this.messageModel({ ...messageData, sender: userId })
        return await message.save()
    }

    async hideMessage(id: string, userId: string): Promise<void> {
        const message: Message = await this.messageModel.findByIdAndUpdate(id, {
            $push: {
                hide: userId
            }
        })
        if (message.hide.length === 2) await message.remove()
    }

    async deleteMessage(id: string, userId: string): Promise<void> {
        if (!id) throw new BadRequestException('chat id must be sent');
        const message: Message = await this.messageModel.findById(id)
        if (message.sender !== userId) throw new UnauthorizedException()
        await message.remove()
    }

    private async deleteAllChatMessages(id: string): Promise<void> {
        const messages: Message[] = await this.messageModel.find({ chat: id })
        messages.map(message => {
            message.remove()
        })
    }
}
