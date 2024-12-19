import {Controller, Get, Post, Put, Delete, ParseIntPipe, Param, Body} from '@nestjs/common'
import {ComentarioService} from './Comentario.service'
import {ComentarioDto, UpdateComentarioDto} from './DTO/comentario.dto'
@Controller('comentario')
export class ComentarioController{

    constructor(private readonly comentarioService : ComentarioService) {}


    @Get()
    async GetAllComments() : Promise<ComentarioDto[] | null>{
        return this.comentarioService.GetAllComentarios();
    }

    @Get(':id')
    async GetByIdComment(@Param('id', ParseIntPipe)  ComentarioId : number) : Promise<ComentarioDto | null>{
        return this.comentarioService.GetByIdComentario(ComentarioId);
    }

    @Post()
    async PostComment(@Body() Comment : Omit<ComentarioDto, 'id'>) : Promise<ComentarioDto | null>{
        return this.comentarioService.PostComment(Comment);
    }

    @Put(':id')
    async UpdateComment(@Body() Comment : UpdateComentarioDto,
                        @Param('id', ParseIntPipe) idCommnet : number) : Promise<UpdateComentarioDto | null>{
        return this.comentarioService.UpdateComment(Comment, idCommnet);
    }

    @Delete(':id')
    async DeleteComment(@Param('id', ParseIntPipe) ComentarioId : number) : Promise<ComentarioDto | null>{
        return this.comentarioService.DeleteComentario(ComentarioId);
    }


}