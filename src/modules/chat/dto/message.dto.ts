import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class MessageDto {
    @Field()
    content: string

    @Field()
    chat: string
}