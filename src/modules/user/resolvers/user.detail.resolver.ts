import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from '../user.service'
import { UserDetailsGQL, UserDetails } from '../schemas/user.detail.shcema'
import { UserDetailsDto, UserUploadDto } from '../dto'
import { GqlAuthGuard } from '@auth/guards/graphql.guard'
import { IJwtPayload } from '@auth/interfaces'
import { CurrentUser } from '@auth/decorators/user.decorator'
import { FileUpload, GraphQLUpload } from '@gql/scalars/upload.scalar'
import { User } from '@user/schemas/user.schema';

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

    @Mutation(returns => UserDetailsGQL)
    async uploadUserFile(
        @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
        @Args('uploadData') uploadData: UserUploadDto
    ): Promise<UserDetails> {
        return await this._userService.uploadFile(file, uploadData)
    }

    @Mutation(returns => UserDetailsGQL)
    async deleteUserFile(
        @Args('id') id: string,
        @Args('public_id') public_id: string
    ): Promise<UserDetails> {
        return await this._userService.deleteFile(id, public_id)
    }
}