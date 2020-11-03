import { Schema, Document } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql'
import { UserGQL } from '@user/schemas/user.schema'

@ObjectType()
export class ChatGql {
    @Field({ nullable: true })
    _id: string

    @Field(type => UserGQL, { nullable: true })
    sender: UserGQL

    @Field(type => UserGQL, { nullable: true })
    reciver: UserGQL

    @Field({ nullable: true })
    news: number

    @Field(type => [String], { nullable: true })
    hide: string[]

    @Field({ nullable: true })
    createdAt: string

    @Field({ nullable: true })
    updatedAt: string
}

export interface Chat extends Document {
    readonly sender: string;
    readonly reciver: string;
    readonly news: number;
    readonly hide: string[];
}

export const ChatSchema: Schema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            autopupulate: true
        },
        reciver: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            autopupulate: true
        },
        news: {
            type: Number,
            default: 0
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