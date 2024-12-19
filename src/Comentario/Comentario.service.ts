import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {ComentarioDto, UpdateComentarioDto} from './DTO/comentario.dto'
import {PrismaClient} from '@prisma/client'
import {validateComment, validatePartialComment} from './Validaciones/ValidacionesComentarios'

@Injectable()
export class ComentarioService{


    private prisma = new PrismaClient();
    private ComentarioDto : any;

    async GetAllComentarios() :  Promise<ComentarioDto[] | null> {

        try {
            const comentarios = await this.prisma.comentario.findMany();

            if (!comentarios || comentarios.length === 0) {
                throw new HttpException(
                    'No hay ningun comentario disponible.',
                    HttpStatus.NO_CONTENT,
                );
            }

            return comentarios.map((comentario) => {

                if(comentario.CompanyId){
                    return {
                        id : comentario.id,
                        PublicationDate : comentario.PublicationDate,
                        ComentarioUser : comentario.ComentarioUser,
                        CompanyId : comentario.CompanyId,
                        PostId : comentario.PostId,
                        PracticeId : comentario.PracticeId
                    }
                }
                else{
                    return {
                        id : comentario.id,
                        ComentarioUser: comentario.ComentarioUser,
                        PublicationDate : comentario.PublicationDate,
                        StudentId : comentario.StudentId,
                        PostId: comentario.PostId,
                        PracticeId : comentario.PracticeId
                    }
                }

            });

        } catch (err){
            throw err;
        }

    }

    async GetByIdComentario(ComentarioId : number) : Promise<ComentarioDto | null>{


        await this.prisma.comentario.findUnique({
            where : { id : ComentarioId }
        }).then(ComentarioById => {

            if(!ComentarioById){
                throw new BadRequestException(`El comentario con el ID ${ComentarioById} no existe`);
            }

            this.ComentarioDto = {
                id : ComentarioById.id,
                PublicationDate : ComentarioById.PublicationDate,
                ComentarioUser : ComentarioById.ComentarioUser,
                PostId : ComentarioById.PostId,
                PracticeId : ComentarioById.PracticeId
            }

            if(ComentarioById.CompanyId) this.ComentarioDto.CompanyId = ComentarioById.CompanyId
            else this.ComentarioDto.StudentId = ComentarioById.StudentId

        }).catch(err => {
            throw err;
        });

        return this.ComentarioDto;

    }

    async PostComment(CommentPost : Omit<ComentarioDto, 'id'>) : Promise<ComentarioDto>{

        const result = await validateComment(CommentPost);

        await this.prisma.comentario.create({
            data : {
                ComentarioUser : result.data.ComentarioUser,
                StudentId : result.data.StudentId,
                CompanyId : result.data.CompanyId,
                PostId : result.data.PostId,
                PracticeId : result.data.PracticeId,
                SobreEmpresaId : result.data.SobreEmpresaId
            }
        }).then(CreateCommnet => {

            this.ComentarioDto = {
                id : CreateCommnet.id,
                PublicationDate : CreateCommnet.PublicationDate,
                ComentarioUser : CreateCommnet.ComentarioUser,
            }

            if(CreateCommnet.PracticeId) this.ComentarioDto.PracticeId = CreateCommnet.PracticeId;
            else if (CreateCommnet.PostId) this.ComentarioDto.PostId = CreateCommnet.PostId;
            else this.ComentarioDto.SobreEmpresaId = CreateCommnet.SobreEmpresaId;

            if (CreateCommnet.CompanyId) this.ComentarioDto.CompanyId = CreateCommnet.CompanyId
            else this.ComentarioDto.StudentId = CreateCommnet.StudentId

        }).catch(() => {
            throw new BadRequestException("Los campos enviados son incorrectos.");
        })


        return this.ComentarioDto;

    }

    async UpdateComment(Comment : UpdateComentarioDto, idComment : number) : Promise<UpdateComentarioDto | null>{

        const result = await validatePartialComment(Comment);

        await this.prisma.comentario.update({
            where : { id : idComment },
            data : result.data
        }).then(UpdatedComment => {

            this.ComentarioDto = {
                ComentarioUser : UpdatedComment.ComentarioUser
            }

        }).catch(() => {
            // Falta un mejor manejo de estos errores ;b
            throw new BadRequestException(`No existe un Comentario con ID ${idComment}`)
        })

        return this.ComentarioDto;

    }

    async DeleteComentario(idComment : number) : Promise<ComentarioDto | null>{

        await this.prisma.comentario.delete({
            where : {id : idComment}
        }).then(ComentarioDeleted => {

            this.ComentarioDto = {
                id : ComentarioDeleted.id,
                PublicationDate : ComentarioDeleted.PublicationDate,
                ComentarioUser : ComentarioDeleted.ComentarioUser,
                PostId : ComentarioDeleted.PostId,
                PracticeId : ComentarioDeleted.PracticeId
            }

            if(ComentarioDeleted.CompanyId) this.ComentarioDto.CompanyId = ComentarioDeleted.CompanyId
            else this.ComentarioDto.StudentId = ComentarioDeleted.StudentId


        }).catch(() => {
            // Falta un mejor manejo de estos errores ;b
            throw new BadRequestException(`No existe un Comentario con ID ${idComment}`)
        })


        return this.ComentarioDto;
    }


}
