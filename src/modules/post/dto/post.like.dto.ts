import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class LikeDto {
    @Field()
    like: string;

    @Field()
    _id: string;
}