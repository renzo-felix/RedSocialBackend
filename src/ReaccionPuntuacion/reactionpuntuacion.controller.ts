import {Controller, Get, Post, Put, Delete, Param, ParseIntPipe, Body} from '@nestjs/common'
import { ReactionPuntuacionDto, UpdateReactioPuntuacionDto } from './DTO/ReactionPuntuacion.dto'
import { ReactionpuntuacionService } from './reactionpuntuacion.service'

@Controller('reactionpuntacion')
export class ReactionpuntuacionController{

    constructor(private readonly  reactionService: ReactionpuntuacionService) {}


    @Get()
    async GetAllReactionsPuntacion() : Promise<ReactionPuntuacionDto[] | null>{
        return this.reactionService.GetAllReactionsPuntuacion();
    }

    @Get(':id')
    async GetByIdReactionPuntacion(@Param('id', ParseIntPipe) idReaction : number) : Promise<ReactionPuntuacionDto | null>{
        return this.reactionService.GetByIdReactionPuntuacion(idReaction);
    }

    @Post()
    async PostReactionPuntacion(@Body() Reaction : Omit<ReactionPuntuacionDto, 'id'>) : Promise<ReactionPuntuacionDto | null>{
        return this.reactionService.PostReactionPuntuacion(Reaction);
    }

    @Put(':id')
    async UpdateReactionPuntacion(@Body() Reaction : UpdateReactioPuntuacionDto,
                         @Param('id', ParseIntPipe) idReaction : number) : Promise<UpdateReactioPuntuacionDto | null>{
        return this.reactionService.UpdateReactionPuntuacion(Reaction, idReaction);
    }

    @Delete(':id')
    async DeleteReactionPuntacion(@Param('id', ParseIntPipe) idReaction : number) : Promise<ReactionPuntuacionDto | null>{
        return this.reactionService.DeleteReactionPuntuacion(idReaction);
    }



}