import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from '../user.service'
import { UserDetailsGQL, UserDetails } from '../schemas/user.detail.shcema'
import { UserDetailsDto } from '../dto/user.details.dto'
import { GqlAuthGuard } from '@auth/guards/graphql.guard'
import { IJwtPayload } from '@auth/interfaces'
import { CurrentUser } from '@auth/decorators/user.decorator'

@Resolver(of => UserDetailsGQL)
@UseGuards(GqlAuthGuard)
export class UserDetailsResolver {
    constructor(
        private readonly _userService: UserService
    ) { }

    @Query(returns => UserDetailsGQL)
    async getUserDetails(
        @Args('id') id: string
    ): Promise<UserDetails> {
        return this._userService.getDetails(id)
    }

    @Query(returns => UserDetailsGQL)
    async currentUserDetails(
        @CurrentUser() user: IJwtPayload
    ): Promise<UserDetails> {
        return this._userService.getDetails(user.id)
    }

    @Mutation(returns => UserDetailsGQL)
    async createUserDetails(
        @Args('detailsData') detailsData: UserDetailsDto
    ): Promise<UserDetails> {
        return await this._userService.createDetails(detailsData)
    }

    @Mutation(returns => UserDetailsGQL)
    async updateUserDetails(
        @Args('detailsData') detailsData: UserDetailsDto
    ): Promise<UserDetails> {
        return await this._userService.updateDetails(detailsData)
    }
}