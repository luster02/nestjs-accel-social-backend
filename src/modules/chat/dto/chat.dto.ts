import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class ChatDto {
    @Field()
    sender: string

    @Field()
    reciver: string
}