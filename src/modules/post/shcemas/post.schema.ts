import { Schema, Document } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql'
import { UserGQL } from '@user/schemas/user.schema'

@ObjectType()
export class PostGQL {
    @Field({ nullable: true })
    _id: string

    @Field({ nullable: true })
    content: string;

    @Field(type => [String], { nullable: true })
    likes: string[];

    @Field({ nullable: true })
    public_id: string

    @Field({ nullable: true })
    secure_url: string

    @Field(type => UserGQL, { nullable: true })
    user: UserGQL;

    @Field({ nullable: true })
    createdAt: string

    @Field({ nullable: true })
    updatedAt: string
}

export interface Post extends Document {
    readonly content: string;
    readonly likes: string[];
    readonly public_id: string;
    readonly secure_url: string;
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
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        },
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