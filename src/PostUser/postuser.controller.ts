import {Controller, Get, Post, Put, Delete, Param, ParseIntPipe, Body} from '@nestjs/common'
import { PostUserDto, UpdatePostUserDto } from './DTO/postuser.dto'
import {PostuserService} from './postuser.service'
import { ComentarioSearchDto } from "../Comentario/DTO/comentario.dto";
import {ReactionSearchDto} from "../ReactionPost/DTO/Reaction.dto";

@Controller('postuser')
export class PostuserController{

    constructor(private readonly  postuserService: PostuserService) {}


    @Get()
    async GetAllPostUsers() : Promise<PostUserDto[] | null>{
        return this.postuserService.GetAllPostUsers();
    }

    @Get(':id')
    async GetByIdPostUser(@Param('id', ParseIntPipe) idPostUser : number) : Promise<PostUserDto | null>{
        return this.postuserService.GetByIdPostUser(idPostUser);
    }

    @Post()
    async CreatePostUser(@Body() PostUser : Omit<PostUserDto, 'id'>) : Promise<PostUserDto | null>{
        return this.postuserService.CreatePostUser(PostUser);
    }

    @Put(':id')
    async UpdatePostUser(@Body() PostUser : UpdatePostUserDto,
                         @Param('id', ParseIntPipe) idPostUser : number) : Promise<UpdatePostUserDto | null>{
        return this.postuserService.UpdatePostUser(PostUser, idPostUser);
    }

    @Delete(':id')
    async DeletePostUser(@Param('id', ParseIntPipe) idPostUser : number) : Promise<PostUserDto | null>{
        return this.postuserService.DeletePostUser(idPostUser);
    }

    @Get('/FindCommentsByPostUser/:id')
    async FindCommentsByPostUser(@Param('id', ParseIntPipe) idPostUser : number) :
        Promise<ComentarioSearchDto[] | null>{
        return this.postuserService.FindCommentsByPostUser(idPostUser);
    }

    @Get('/FindReactionsByPostUser/:id')
    async FindReactionsByPostUser(@Param('id', ParseIntPipe) idPostUser : number) :
        Promise<ReactionSearchDto[] | null>{
        return this.postuserService.FindReactionsByPostUser(idPostUser);
    }

    @Get('/LikeAndDislikePostUser/:id')
    async LikeAndDislikePostUser(@Param('id', ParseIntPipe) idPostUser : number) : Promise<[number, number]>{
        return this.postuserService.LikeAndDislikePostUser(idPostUser);
    }

}