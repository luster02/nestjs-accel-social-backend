import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class PostLikeDto {
    @Field()
    like: string;

    @Field()
    _id: string;
}