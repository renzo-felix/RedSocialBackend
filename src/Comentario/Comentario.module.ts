import {Module} from '@nestjs/common'
import {ComentarioService} from './Comentario.service'
import {ComentarioController} from './Comentario.controler'

@Module({
    controllers : [ComentarioController],
    providers : [ComentarioService]
})


export class ComentarioModule{}