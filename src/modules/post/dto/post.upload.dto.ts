import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class PostUploadDto {
    @Field()
    folderName: string;

    @Field()
    postId: string;
}