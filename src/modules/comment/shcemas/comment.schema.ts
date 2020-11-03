import { Schema, Document } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql'
import { UserGQL } from '@user/schemas/user.schema'

@ObjectType()
export class CommentGQL {
    @Field({ nullable: true })
    _id: string

    @Field({ nullable: true })
    content: string;

    @Field(type => [String],{ nullable: true })
    likes: string[];

    @Field({ nullable: true })
    post: string

    @Field(type => UserGQL, { nullable: true })
    user: UserGQL;

    @Field({ nullable: true })
    createdAt: string

    @Field({ nullable: true })
    updatedAt: string
}

export interface Comment extends Document {
    readonly content: string;
    readonly likes: string[];
    readonly post: string;
    readonly user: string;
}

export const CommentSchema: Schema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        likes: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            autopopulate: true
        }
    },
    {
        timestamps: true,
    },
);