import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SigninDto {
  @Field()
  username: string;

  @Field()
  password: string;
}
