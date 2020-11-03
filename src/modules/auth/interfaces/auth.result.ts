import { ObjectType, Field } from '@nestjs/graphql'
import { MutationResult } from '../../../gql/interfaces/mutation-result.interface'
export { MutationResult } from '../../../gql/interfaces/mutation-result.interface'

@ObjectType()
export class AuthResult extends MutationResult {
    @Field()
    token: string;
}

