import { Schema, Document } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class UserDetailsGQL {
    @Field({ nullable: true })
    name: string
    @Field({ nullable: true })
    lastname: string
    @Field({ nullable: true })
    bio: string

    @Field({ nullable: true })
    ocupation: string

    @Field({ nullable: true })
    public_id: string

    @Field({ nullable: true })
    secure_url: string

    @Field({ nullable: true })
    foler_name: string

    @Field({ nullable: true })
    user: string
}

export interface UserDetails extends Document {
    readonly name: string
    readonly lastname: string
    readonly bio: string
    readonly ocupation: string
    readonly public_id: string
    readonly secure_url: string
    readonly foler_name: string
    readonly user: string
}

export const UserDetailsSchema: Schema = new Schema(
    {
        name: {
            type: String,
        },
        lastname: {
            type: String,
        },
        bio: {
            type: String,
        },
        ocupation: {
            type: String,
        },
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        },
        foler_name: {
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