import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common'
import { ReactionDto, UpdateReactionDto } from './DTO/Reaction.dto'
import {PrismaClient} from "@prisma/client";
import { validateReaction, validatePartialReaction } from './Validaciones/Reaction.validations'

@Injectable()
export class ReactionService{

    private prisma = new PrismaClient();
    private ReactionDto : any;


    async GetAllReactions() : Promise<ReactionDto[] | null>{

        try {
            const Reactions = await this.prisma.reaccion.findMany()

            if(!Reactions || Reactions.length == 0){
                throw new HttpException(
                    'No hay ninguna reacción disponible.',
                    HttpStatus.NO_CONTENT,
                );
            }

            return Reactions.map((reaction) => {

                if(reaction.CompanyId){
                    return {
                        id : reaction.id,
                        ReactionDate: reaction.ReactionDate,
                        TypeReaction : reaction.TypeReaction,
                        PostId : reaction.PostId,
                        CompanyId : reaction.CompanyId
                    }
                }
                else{
                    return {
                        id : reaction.id,
                        ReactionDate: reaction.ReactionDate,
                        TypeReaction : reaction.TypeReaction,
                        PostId : reaction.PostId,
                        StudentId : reaction.StudentId
                    }
                }

            })

        }
        catch (err){
            throw err
        }


    }


    async GetByIdReaction(idReaction : number) : Promise<ReactionDto | null>{

        await this.prisma.reaccion.findUnique({
            where : { id : idReaction }
        }).then(ReactionById => {

            if(!ReactionById){
                throw new BadRequestException(`La reacción con el ID ${idReaction} no existe`);
            }

            this.ReactionDto = {
                id : ReactionById.id,
                ReactionDate: ReactionById.ReactionDate,
                TypeReaction : ReactionById.TypeReaction,
                PostId : ReactionById.PostId
            }

            if(ReactionById.CompanyId) this.ReactionDto.CompanyId = ReactionById.CompanyId
            else this.ReactionDto.StudentId = ReactionById.StudentId

        }).catch( err => {
            throw err;
        })

        return this.ReactionDto;
    }


    async PostReaction(Reaction : Omit<ReactionDto, 'id'>) : Promise<ReactionDto | null>{

        const ValidateResult = await validateReaction(Reaction);

        await this.prisma.reaccion.create({
            data : {
                TypeReaction : ValidateResult.data.TypeReaction,
                PostId : ValidateResult.data.PostId,
                CompanyId : ValidateResult.data.CompanyId,
                StudentId : ValidateResult.data.StudentId
            }
        }).then(CreatedReaction => {

            this.ReactionDto = {
                id : CreatedReaction.id,
                ReactionDate: CreatedReaction.ReactionDate,
                TypeReaction : CreatedReaction.TypeReaction,
                PostId : CreatedReaction.PostId
            }

            if(CreatedReaction.CompanyId) this.ReactionDto.CompanyId = CreatedReaction.CompanyId
            else this.ReactionDto.StudentId = CreatedReaction.StudentId

        }).catch(() => {
            throw new BadRequestException("Los campos enviados son incorrectos.");
        })

        return this.ReactionDto;

    }

    async UpdateReaction(Reaction : UpdateReactionDto, idReaction : number) : Promise<UpdateReactionDto | null>{

        const ValidateUpdateReaction = validatePartialReaction(Reaction);

        await this.prisma.reaccion.update({
            where : { id : idReaction },
            data : ValidateUpdateReaction.data
        }).then(UpdatedReaction => {

            this.ReactionDto = {
                TypeReaction : UpdatedReaction.TypeReaction
            }

        }).catch(() => {
            // Falta un mejor manejo de estos errores ;b
            throw new BadRequestException(`No existe una reacción con ID ${idReaction}`)
        })


        return this.ReactionDto;
    }

    async DeleteReaction( idReaction : number ) : Promise<ReactionDto | null>{

        await this.prisma.reaccion.delete({
            where: { id : idReaction }
        }).then(DeletedReaction => {

            this.ReactionDto = {
                id : DeletedReaction.id,
                ReactionDate: DeletedReaction.ReactionDate,
                TypeReaction : DeletedReaction.TypeReaction,
                PostId : DeletedReaction.PostId
            }

            if(DeletedReaction.CompanyId) this.ReactionDto.CompanyId = DeletedReaction.CompanyId
            else this.ReactionDto.StudentId = DeletedReaction.StudentId

        }).catch(() => {
            // Falta un mejor manejo de estos errores ;b
            throw new BadRequestException(`No existe una reacción con ID ${idReaction}`)
        });

        return this.ReactionDto;

    }


}