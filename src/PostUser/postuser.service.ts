import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PostUserDto, UpdatePostUserDto } from './DTO/postuser.dto'
import { PrismaClient } from "@prisma/client";
import { validatePostUser, validatePartialPostUser } from './Validaciones/PostUserValidations'
import { ComentarioSearchDto } from "../Comentario/DTO/comentario.dto";
import { ReactionSearchDto } from "../ReactionPost/DTO/Reaction.dto";
import {
    FindCommentsByEntity,
    FindReactionsByEntity,
    LikeAndDislikeEntity
} from "../ModuleValidations/ComentariosMethods";

@Injectable()
export class PostuserService{

    private prisma = new PrismaClient();
    private PostUserDto : any;


    async GetAllPostUsers() : Promise<PostUserDto[] | null>{

        try {
            const PostUsers = await this.prisma.postUser.findMany()

            if(!PostUsers || PostUsers.length == 0){
                throw new HttpException(
                    'No hay ningun PostUser disponible.',
                    HttpStatus.NO_CONTENT,
                );
            }

            return PostUsers.map((PostUser) => {

                if(PostUser.CompanyId){
                    return {
                        id : PostUser.id,
                        PublicationDate : PostUser.PublicationDate,
                        TituloPost : PostUser.TituloPost,
                        Descripcion : PostUser.Descripcion,
                        ImgPostUrl : PostUser.ImgPostUrl,
                        CompanyId : PostUser.CompanyId
                    }
                }
                else{
                    return {
                        id : PostUser.id,
                        PublicationDate : PostUser.PublicationDate,
                        TituloPost : PostUser.TituloPost,
                        Descripcion : PostUser.Descripcion,
                        ImgPostUrl : PostUser.ImgPostUrl,
                        StudentId : PostUser.StudentId
                    }
                }

            })

        }
        catch (err){
            throw err
        }


    }


    async GetByIdPostUser(idPostUser : number) : Promise<PostUserDto | null>{

        await this.prisma.postUser.findUnique({
            where : { id : idPostUser }
        }).then(PostUserById => {

            if(!PostUserById){
                throw new BadRequestException("El PostUser con el ID ${idPostUser} no existe");
            }

            this.PostUserDto = {
                id : PostUserById.id,
                PublicationDate : PostUserById.PublicationDate,
                TituloPost : PostUserById.TituloPost,
                Descripcion : PostUserById.Descripcion,
                ImgPostUrl : PostUserById.ImgPostUrl
            }

            if(PostUserById.CompanyId) this.PostUserDto.CompanyId = PostUserById.CompanyId
            else this.PostUserDto.StudentId = PostUserById.StudentId

        }).catch( err => {
            throw err;
        })

        return this.PostUserDto;
    }


    async CreatePostUser(PostUser : Omit<PostUserDto, 'id'>) : Promise<PostUserDto | null>{

        const ValidateResult = await validatePostUser(PostUser);

        await this.prisma.postUser.create({
            data : {
                PublicationDate : ValidateResult.data.PublicationDate,
                TituloPost : ValidateResult.data.TituloPost,
                Descripcion : ValidateResult.data.Descripcion,
                ImgPostUrl : ValidateResult.data.ImgPostUrl,
                CompanyId : ValidateResult.data.CompanyId,
                StudentId : ValidateResult.data.StudentId
            }
        }).then(CreatedPostUser => {

            this.PostUserDto = {
                id : CreatedPostUser.id,
                PublicationDate : CreatedPostUser.PublicationDate,
                TituloPost : CreatedPostUser.TituloPost,
                Descripcion : CreatedPostUser.Descripcion,
                ImgPostUrl : CreatedPostUser.ImgPostUrl
            }

            if(CreatedPostUser.CompanyId) this.PostUserDto.CompanyId = CreatedPostUser.CompanyId
            else this.PostUserDto.StudentId = CreatedPostUser.StudentId

        }).catch(() => {
            throw new BadRequestException("Los campos enviados son incorrectos.");
        })

        return this.PostUserDto;

    }

    async UpdatePostUser(PostUser : UpdatePostUserDto, idPostUser : number) : Promise<UpdatePostUserDto | null>{

        const ValidateUpdatePostUser = validatePartialPostUser(PostUser);

        await this.prisma.postUser.update({
            where : { id : idPostUser },
            data : ValidateUpdatePostUser.data
        }).then(UpdatedPostUser => {

            this.PostUserDto = {
                PublicationDate : UpdatedPostUser.PublicationDate,
                TituloPost : UpdatedPostUser.TituloPost,
                Descripcion : UpdatedPostUser.Descripcion,
                ImgPostUrl : UpdatedPostUser.ImgPostUrl
            }

        }).catch(() => {
            // Falta un mejor manejo de estos errores ;b
            throw new BadRequestException("No existe un PostUser con ID ${idPostUser}")
        })


        return this.PostUserDto;
    }

    async DeletePostUser( idPostUser : number ) : Promise<PostUserDto | null>{

        await this.prisma.postUser.delete({
            where: { id : idPostUser }
        }).then(DeletedPostUser => {

            this.PostUserDto = {
                id : DeletedPostUser.id,
                PublicationDate : DeletedPostUser.PublicationDate,
                TituloPost : DeletedPostUser.TituloPost,
                Descripcion : DeletedPostUser.Descripcion,
                ImgPostUrl : DeletedPostUser.ImgPostUrl
            }

            if(DeletedPostUser.CompanyId) this.PostUserDto.CompanyId = DeletedPostUser.CompanyId
            else this.PostUserDto.StudentId = DeletedPostUser.StudentId

        }).catch(() => {
            // Falta un mejor manejo de estos errores ;b
            throw new BadRequestException(`No existe un PostUser con ID ${idPostUser}}`)
        });

        return this.PostUserDto;

    }

    async FindCommentsByPostUser(idPostUser : number) : Promise<ComentarioSearchDto[] | null>{
        return FindCommentsByEntity("postUser", "Comentario", idPostUser);
    }

    async FindReactionsByPostUser(idPostUser : number) : Promise<ReactionSearchDto[] | null>{
        return FindReactionsByEntity("postUser", idPostUser);
    }

    async LikeAndDislikePostUser(idPostUser : number) : Promise<[number, number]>{
        return LikeAndDislikeEntity("postUser", idPostUser);
    }


}