import { Schema, Document } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql'
import { UserGQL } from '@user/schemas/user.schema'

@ObjectType()
export class CommentResponseGQL {
    @Field({ nullable: true })
    _id: string

    @Field({ nullable: true })
    content: string;

    @Field(type => [String],{ nullable: true })
    likes: string[];

    @Field({ nullable: true })
    comment: string;

    @Field(type => UserGQL, { nullable: true })
    user: UserGQL;

    @Field({ nullable: true })
    createdAt: string

    @Field({ nullable: true })
    updatedAt: string
}

export interface CommentResponse extends Document {
    readonly content: string;
    readonly likes: string[];
    readonly comment: string;
    readonly user: string;
}

export const CommentResponseSchema: Schema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        likes: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        comment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
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