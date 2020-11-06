import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { hash, compare } from 'bcryptjs'
import { IJwtPayload } from './interfaces'
import { User } from '@user/schemas/user.schema'
import { UserDetails } from '@user/schemas/user.detail.shcema'
import { SignupDto, SigninDto } from './dto'

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<User>,
        @InjectModel('UserDetails')
        private readonly userDetails: Model<UserDetails>,
        private readonly _jwtService: JwtService,
    ) { }

    async signup(userData: SignupDto): Promise<string> {
        const { password } = userData
        const hashedPassword = await hash(password, 10)
        const user: User = new this.userModel({ ...userData, password: hashedPassword })

        try {
            await user.save()
            const details = new this.userDetails({
                foler_name: user._id,
                user: user._id
            })
            details.save()
            
            const payload: IJwtPayload = {
                id: user.id,
                email: user.email,
                username: user.username
            };

            return this._jwtService.sign(payload);

        } catch (error) {
            if (parseInt(error.code) === 11000) {
                throw new ConflictException('User or email already exists');
            }

            throw new InternalServerErrorException()
        }

    }

    async signin(signinDto: SigninDto): Promise<string> {
        const { username, password } = signinDto;
        const user: User = await this.userModel.findOne({ username });
        if (!user) throw new NotFoundException('user does not exist');
        const isMatch = await compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('invalid credentials');

        const payload: IJwtPayload = {
            id: user.id,
            email: user.email,
            username: user.username
        };

        return this._jwtService.sign(payload);
    }
}
