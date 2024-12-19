import {Controller, Get, Post, Put, Delete, Param, ParseIntPipe, Body} from '@nestjs/common'
import { ReactionDto, UpdateReactionDto } from './DTO/Reaction.dto'
import { ReactionService } from './reaction.service'

@Controller('reaction')
export class ReactionController{

    constructor(private readonly  reactionService: ReactionService) {}


    @Get()
    async GetAllReactions() : Promise<ReactionDto[] | null>{
        return this.reactionService.GetAllReactions();
    }

    @Get(':id')
    async GetByIdReaction(@Param('id', ParseIntPipe) idReaction : number) : Promise<ReactionDto | null>{
        return this.reactionService.GetByIdReaction(idReaction);
    }

    @Post()
    async PostReaction(@Body() Reaction : Omit<ReactionDto, 'id'>) : Promise<ReactionDto | null>{
        return this.reactionService.PostReaction(Reaction);
    }

    @Put(':id')
    async UpdateReaction(@Body() Reaction : UpdateReactionDto,
                         @Param('id', ParseIntPipe) idReaction : number) : Promise<UpdateReactionDto | null>{
        return this.reactionService.UpdateReaction(Reaction, idReaction);
    }

    @Delete(':id')
    async DeleteReaction(@Param('id', ParseIntPipe) idReaction : number) : Promise<ReactionDto | null>{
        return this.reactionService.DeleteReaction(idReaction);
    }

    

}