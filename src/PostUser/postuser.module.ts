import { Module } from '@nestjs/common'
import { PostuserService } from './postuser.service'
import { PostuserController } from './postuser.controller'

@Module({
    controllers : [PostuserController],
    providers : [PostuserService]
})


export class PostuserModule{}