import { z } from 'zod'
import { ErroresSchema, Existe_O_No } from '../../ModuleValidations/ModuleValidations'
import { ReactionDto, UpdateReactionDto } from '../DTO/Reaction.dto'
import {BadRequestException} from "@nestjs/common";

const reactions = ["like", "dislike", "nothing"] as const;

const SchemaReaction = z.object({

    TypeReaction : z.enum(reactions, {
        message : 'La reacción mandada no existe.'
    }),

    CompanyId : z.number()
        .int({
        message : 'No existe alguna CompanyUser con esa id.'
    }).min(1, {
        message : 'No existe alguna CompanyUser con esa id.'
    }).optional(),

    StudentId : z.number()
        .int({
        message : 'No existe algun StudentUser con ese id.'
    }).min(1, {
        message : 'No existe algun StudentUser con ese id.'
    }).optional(),

    PostId : z.number()
        .int({
        message : 'No existe algun Post con ese id.'
    }).min(1, {
        message : 'No existe algun Post con ese id.'
    }),


}).strict({
    message : 'Se envio algun campo/s no válido/s en el request.'
});

export async function validateReaction(Reaction : Omit<ReactionDto, 'id'>){

    const ResultValidationReaction = SchemaReaction.safeParse(Reaction);

    if(!ResultValidationReaction.success){
        const Errores = ErroresSchema(ResultValidationReaction.error);
        throw new BadRequestException(`Error en la validación del POST de Reaction`,
            Errores);
    }

    const {CompanyId, StudentId, PostId} = ResultValidationReaction.data;

    const E_o_N = await Existe_O_No(PostId,"postUser");
    if(!E_o_N){
        throw new BadRequestException(`El post con ID ${PostId} donde se realizo el comentario
        no existe.`);
    }

    if(Number(!!CompanyId) + Number(!!StudentId) != 1){
        throw new BadRequestException("La reacción le debe pertenecer a una compañia o" +
            " un estudiante, no ambas o ninguna al mismo tiempo.");
    }

    if(CompanyId){
        const E_o_N = await Existe_O_No(CompanyId, "companyProfile", "CompanyUserId");
        if(!E_o_N){
            throw new BadRequestException(`l CompanyUser con ID ${CompanyId} no existe.`)
        }
    }

    if(StudentId){
        const E_o_N = await Existe_O_No(StudentId, "studentProfile", "studentUserId");
        if(!E_o_N){
            throw new BadRequestException(`El StudentUser con ID ${StudentId} no existe.`)
        }
    }

    return ResultValidationReaction;

}

export function validatePartialReaction(Reaction : UpdateReactionDto){

    const ResultValidationReaction = SchemaReaction.partial().safeParse(Reaction);

    if(!ResultValidationReaction.success){
        const Errores = ErroresSchema(ResultValidationReaction.error);
        throw new BadRequestException(`Error en la validación del POST de Reaction`,
            Errores);
    }

    return ResultValidationReaction;
}