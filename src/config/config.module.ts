import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import configuration from './config.provider'

@Module({
    imports: [
        NestConfigModule.forRoot({
            load: [configuration]
        })
    ],
    exports: [NestConfigModule]
})
export class ConfigModule { }
