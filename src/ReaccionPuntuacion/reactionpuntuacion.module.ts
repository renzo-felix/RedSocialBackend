import { Module } from '@nestjs/common'
import { ReactionpuntuacionService } from './reactionpuntuacion.service'
import { ReactionpuntuacionController } from './reactionpuntuacion.controller'

@Module({
    controllers : [ReactionpuntuacionController],
    providers : [ReactionpuntuacionService]
})


export class ReactionpuntuacionModule{}