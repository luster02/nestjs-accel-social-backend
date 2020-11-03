import { Schema, Document } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class ChatGql {
    @Field({ nullable: true })
    _id: string

    @Field({ nullable: true })
    sender: string

    @Field({ nullable: true })
    reciver: string

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
    readonly hide: string[];
}

export const ChatSchema: Schema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        reciver: {
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