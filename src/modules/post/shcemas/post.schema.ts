import { Schema, Document } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class PostGQL {
    @Field({ nullable: true })
    _id: string

    @Field({ nullable: true })
    content: string;

    @Field(type => [String], { nullable: true })
    likes: string[];

    @Field({ nullable: true })
    user: string;

    @Field({ nullable: true })
    createdAt: string

    @Field({ nullable: true })
    updatedAt: string
}

export interface Post extends Document {
    readonly content: string;
    readonly likes: string[];
    readonly user: string;
}

export const PostSchema: Schema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        likes: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    },
);