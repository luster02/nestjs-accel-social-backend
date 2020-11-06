import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { UserService } from './user.service';
import { UserSchema } from './schemas/user.schema'
import { UserDetailsSchema } from './schemas/user.detail.shcema'
import { UserDetailsResolver, UserResolver } from './resolvers'
import { CloudinaryModule } from '@cloudinary/cloudinary.module'

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: () => {
          const schema = UserSchema
          schema.plugin(require('mongoose-autopopulate'))
          return schema
        }
      },
      {
        name: 'UserDetails',
        useFactory: () => {
          const schema = UserDetailsSchema
          return schema
        }
      }
    ]),
  ],
  providers: [UserService, UserDetailsResolver, UserResolver]
})
export class UserModule { }
