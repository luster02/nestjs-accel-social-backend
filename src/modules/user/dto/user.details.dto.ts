import { IsString } from 'class-validator'
import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class UserDetailsDto {
    @Field()
    @IsString()
    name: string

    @Field()
    @IsString()
    lastname: string

    @Field()
    @IsString()
    bio: string

    @Field()
    @IsString()
    ocupation: string

    @Field()
    @IsString()
    user: string
}