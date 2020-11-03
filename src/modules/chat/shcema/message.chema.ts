import { Schema, Document } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql'
import { UserGQL } from '@user/schemas/user.schema'

@ObjectType()
export class MessageGql {
    @Field({ nullable: true })
    _id: string

    @Field({ nullable: true })
    content: string

    @Field({ nullable: true })
    chat: string

    @Field(type => UserGQL, { nullable: true })
    sender: UserGQL

    @Field(type => [String], { nullable: true })
    hide: string[]

    @Field({ nullable: true })
    createdAt: string

    @Field({ nullable: true })
    updatedAt: string
}

export interface Message extends Document {
    readonly content: string;
    readonly chat: string;
    readonly sender: string
    readonly hide: string[];
}

export const MessageSchema: Schema = new Schema(
    {
        content: {
            type: String,
            required: true,
            ref: 'User',
        },
        chat: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Chat',
        },
        sender: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            autopupulate: true
        },
        hide: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        timestamps: true
    }
)