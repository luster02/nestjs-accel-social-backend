import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class PostDto {
    @Field()
    content: string;

    @Field()
    user: string;
}