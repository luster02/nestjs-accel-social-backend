import { IsString } from 'class-validator'
import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class ConnectionDto {
    @Field()
    @IsString()
    user_id: string

    @Field()
    @IsString()
    requesting_user_id: string
}