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
import { SignupDto, SigninDto } from './dto'


@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<User>,
        private readonly _jwtService: JwtService,
    ) { }

    async signup(userData: SignupDto) {
        const { password } = userData
        const hashedPassword = await hash(password, 10)
        const user = new this.userModel({ ...userData, password: hashedPassword })

        try {
            await user.save()
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

        const token = this._jwtService.sign(payload);

        return token;
    }
}
