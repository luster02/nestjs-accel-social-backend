import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from '@nestjs/config'
import { ConfigModule } from '../config/config.module'
import { IEnvironmentVariables } from '../config/config.interface'

export const DatabaseProvider = [
    MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService<IEnvironmentVariables>) => ({
            uri: configService.get<string>('MONGODB_URI'),
            useCreateIndex: true
        })
    })
]