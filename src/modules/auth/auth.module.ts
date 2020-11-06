import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UserSchema } from '@user/schemas/user.schema'
import { UserDetailsSchema } from '@user/schemas/user.detail.shcema'
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver'
import { ConfigModule } from '@config/config.module';
import { IEnvironmentVariables } from '@config/config.interface'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema
            },
            {
                name: 'UserDetails',
                schema: UserDetailsSchema
            }
        ]),
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory(config: ConfigService<IEnvironmentVariables>) {
                return {
                    secret: config.get<string>('JWT_SECRET'),
                    signOptions: {
                        expiresIn: '1d',
                    },
                };
            },
        }),
    ],
    providers: [JwtStrategy, ConfigService, AuthService, AuthResolver],
    exports: [JwtStrategy, PassportModule, AuthService]
})
export class AuthModule { }
