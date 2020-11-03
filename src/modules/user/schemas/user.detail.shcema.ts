import { Schema, Document } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class UserDetailsGQL {
    @Field()
    name: string
    @Field()
    lastname: string
    @Field()
    bio: string
    @Field()
    ocupation: string
    @Field()
    user: string
}

export interface UserDetails extends Document {
    readonly name: string
    readonly lastname: string
    readonly bio: string
    readonly ocupation: string
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