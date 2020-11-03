import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CommentResponseDto {
    @Field()
    content: string;

    @Field()
    comment: string

    @Field()
    user: string;
}