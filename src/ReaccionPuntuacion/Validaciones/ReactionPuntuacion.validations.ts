import { z } from 'zod'
import { ErroresSchema, Existe_O_No} from '../../ModuleValidations/ModuleValidations'
import { ReactionPuntuacionDto, UpdateReactioPuntuacionDto } from '../DTO/ReactionPuntuacion.dto'
import {BadRequestException} from "@nestjs/common";


const SchemaReactionPuntacion = z.object({

    Puntuacion : z.number().int({
        message : 'La puntuación mandada está fuera del rango. (1 - 5)'
    }).min(1, {
        message : 'La puntuación mandada está fuera del rango. (1 - 5)'
    }).max(5, {
        message : 'La puntuación mandada está fuera del rango. (1 - 5)'
    }),

    StudentId : z.number()
        .int({
            message : 'No existe algun StudentUser con ese id.'
        }).min(1, {
            message : 'No existe algun StudentUser con ese id.'
        }),

    PracticeId : z.number()
        .int({
            message : 'No existe alguna Practice con ese id.'
        }).min(1, {
            message : 'No existe algun Practice con ese id.'
        }),

    //ComentarioId : z.number()
    //    .int({
    //        message : 'No existe algún Comentario con ese id.'
    //    }).min(1, {
    //        message : 'No existe algun Comentario con ese id.'
    //    })

}).strict({
    message : 'Se envio algun campo/s no válido/s en el request.'
});


export async function validateReactionPuntuacion(ReactionPuntuacion : Omit<ReactionPuntuacionDto, 'id'>){

    const ResultValidations = SchemaReactionPuntacion.safeParse(ReactionPuntuacion);

    if(!ResultValidations.success){
        const Errores = ErroresSchema(ResultValidations.error);
        throw new BadRequestException(`Error en la validación del POST de ReactionPuntuacion`,
            Errores);
    }

    const { StudentId, PracticeId } = ResultValidations.data;
    let E_o_N : Boolean;

    E_o_N = await Existe_O_No(PracticeId, "practice");
    if(!E_o_N){
        throw new BadRequestException(`El Practice con ID ${ PracticeId } no existe.`)
    }

    E_o_N = await Existe_O_No(StudentId, "studentProfile", "studentUserId");
    if(!E_o_N){
        throw new BadRequestException(`El StudentUser con ID ${StudentId} no existe.`)
    }

    //const ComentarioType = await DataFileEntity(ComentarioId, "comentario")
    //if(!ComentarioType.PracticeId){
    //    throw new BadRequestException('Error: Solo se puede puntuar comentarios que sean hayan realizado' +
    //        ' en practicas.');
    //}


    return ResultValidations;

}

export function validatePartialReactionPuntuacion(ReaccionPuntuacion : UpdateReactioPuntuacionDto){

    const ResultValidations = SchemaReactionPuntacion.partial().safeParse(ReaccionPuntuacion);

    if(!ResultValidations.success){
        const Errores = ErroresSchema(ResultValidations.error);
        throw new BadRequestException(`Error en la validación del POST de Reaction`,
            Errores);
    }

    return ResultValidations;

}