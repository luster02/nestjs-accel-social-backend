import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignupDto {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}