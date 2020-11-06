import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class UserUploadDto {
    @Field()
    folderName: string;

    @Field()
    userId: string;
}