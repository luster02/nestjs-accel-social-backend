import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from '../user.service'
import { UserGQL, User } from '../schemas/user.schema'
import { ConnectionDto } from '../dto'
import { IJwtPayload } from '@auth/interfaces'
import { GqlAuthGuard } from '@auth/guards/graphql.guard'
import { CurrentUser } from '@auth/decorators/user.decorator'

@Resolver(of => UserGQL)
@UseGuards(GqlAuthGuard)
export class UserResolver {
    constructor(private _userService: UserService) { }

    @Query(returns => UserGQL)
    async getUser(
        @Args('id') id: string
    ): Promise<User> {
        return this._userService.get(id)
    }

    @Query(returns => UserGQL)
    async getCurentUser(
        @CurrentUser() user: IJwtPayload
    ): Promise<User> {
        return this._userService.get(user.id)
    }

    @Mutation(returns => UserGQL)
    async sendRequest(
        @Args('connectionData') connectionData: ConnectionDto
    ): Promise<User> {
        return await this._userService.sendRequest(connectionData)
    }

    @Mutation(returns => UserGQL)
    async confirmRequest(
        @Args('connectionData') connectionData: ConnectionDto
    ): Promise<User> {
        return await this._userService.confirmRequest(connectionData)
    }

    @Mutation(returns => UserGQL)
    async declineRequest(
        @Args('connectionData') connectionData: ConnectionDto
    ): Promise<User> {
        return await this._userService.declineRequest(connectionData)
    }
}