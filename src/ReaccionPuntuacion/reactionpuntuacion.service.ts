import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common'
import { ReactionPuntuacionDto, UpdateReactioPuntuacionDto } from './DTO/ReactionPuntuacion.dto'
import {PrismaClient} from "@prisma/client";
import { validateReactionPuntuacion, validatePartialReactionPuntuacion } from './Validaciones/ReactionPuntuacion.validations'


@Injectable()
export class ReactionpuntuacionService{

    private prisma = new PrismaClient();
    private ReactionPuntuacionDto : any;


    async GetAllReactionsPuntuacion() : Promise<ReactionPuntuacionDto[] | null>{

        try {
            const ReactionsPuntuacion = await this.prisma.reaccionPuntuacion.findMany()

            if(!ReactionsPuntuacion || ReactionsPuntuacion.length == 0){
                throw new HttpException(
                    'No hay ninguna reacción puntuación disponible.',
                    HttpStatus.NO_CONTENT,
                );
            }

            return ReactionsPuntuacion.map((reaction) =>({

                id : reaction.id,
                ReaccionDate : reaction.ReaccionDate,
                Puntuacion : reaction.Puntuacion,
                StudentId : reaction.StudentId,
                PracticeId : reaction.PracticeId,
                //ComentarioId : reaction.ComentarioId

            }))

        }
        catch (err){
            throw err
        }


    }


    async GetByIdReactionPuntuacion(idReactionPuntuacion : number) : Promise<ReactionPuntuacionDto | null>{

        await this.prisma.reaccionPuntuacion.findUnique({
            where : { id : idReactionPuntuacion }
        }).then(ReactionPuntuacionById => {

            if(!ReactionPuntuacionById){
                throw new BadRequestException(`La reacción puntuación con el ID ${idReactionPuntuacion} no existe`);
            }

            this.ReactionPuntuacionDto = {
                id : ReactionPuntuacionById.id,
                ReaccionDate : ReactionPuntuacionById.ReaccionDate,
                Puntuacion : ReactionPuntuacionById.Puntuacion,
                StudentId : ReactionPuntuacionById.StudentId,
                PracticeId : ReactionPuntuacionById.PracticeId,
                //ComentarioId : ReactionPuntuacionById.ComentarioId
            }


        }).catch( err => {
            throw err;
        })

        return this.ReactionPuntuacionDto;
    }


    async PostReactionPuntuacion(ReactionPuntuacion : Omit<ReactionPuntuacionDto, 'id'>) : Promise<ReactionPuntuacionDto | null>{

        const ValidateResult = await validateReactionPuntuacion(ReactionPuntuacion);

        await this.prisma.reaccionPuntuacion.create({
            data : {
                Puntuacion : ValidateResult.data.Puntuacion,
                PracticeId : ValidateResult.data.PracticeId,
                StudentId : ValidateResult.data.StudentId,
                //ComentarioId : ValidateResult.data.ComentarioId
            }
        }).then(CreatedReactionPuntuacion => {

            this.ReactionPuntuacionDto = {
                id : CreatedReactionPuntuacion.id,
                ReaccionDate: CreatedReactionPuntuacion.ReaccionDate,
                Puntuacion : CreatedReactionPuntuacion.Puntuacion,
                PracticeId : CreatedReactionPuntuacion.PracticeId,
                //ComentarioId : CreatedReactionPuntuacion.ComentarioId
            }

        }).catch(() => {
            throw new BadRequestException("Los campos enviados son incorrectos.");
        })

        return this.ReactionPuntuacionDto;

    }

    async UpdateReactionPuntuacion(Reaction : UpdateReactioPuntuacionDto, idReactionPuntuacion : number) : Promise<UpdateReactioPuntuacionDto | null>{

        const ValidateUpdateReaction = validatePartialReactionPuntuacion(Reaction);

        await this.prisma.reaccionPuntuacion.update({
            where : { id : idReactionPuntuacion },
            data : ValidateUpdateReaction.data
        }).then(UpdatedReactionPuntuacion => {

            this.ReactionPuntuacionDto = {
                Puntuacion : UpdatedReactionPuntuacion.Puntuacion
            }

        }).catch(() => {
            // Falta un mejor manejo de estos errores ;b
            throw new BadRequestException(`No existe una reacción puntuación con ID ${idReactionPuntuacion}`)
        })


        return this.ReactionPuntuacionDto;
    }

    async DeleteReactionPuntuacion( idReactionPuntuacion : number ) : Promise<ReactionPuntuacionDto | null>{

        await this.prisma.reaccionPuntuacion.delete({
            where: { id : idReactionPuntuacion }
        }).then(DeletedReaction => {

            this.ReactionPuntuacionDto = {
                id : DeletedReaction.id,
                ReaccionDate : DeletedReaction.ReaccionDate,
                Puntuacion : DeletedReaction.Puntuacion,
                StudentId : DeletedReaction.StudentId,
                PracticeId : DeletedReaction.PracticeId,
                //ComentarioId : DeletedReaction.ComentarioId
            }

        }).catch(() => {
            // Falta un mejor manejo de estos errores ;b
            throw new BadRequestException(`No existe una reacción puntuación con ID ${idReactionPuntuacion}`)
        });

        return this.ReactionPuntuacionDto;

    }


}