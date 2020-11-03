import { Module } from '@nestjs/common';
import { gqlProvider } from './gql.provider'

@Module({
    imports: [...gqlProvider],
    exports: [...gqlProvider]
})
export class GqlModule {}
