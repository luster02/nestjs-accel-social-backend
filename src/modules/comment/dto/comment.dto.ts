import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CommentDto {
    @Field()
    content: string;

    @Field()
    post: string

    @Field()
    user: string;
}