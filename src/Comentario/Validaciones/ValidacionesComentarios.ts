import { z } from 'zod'
import { ComentarioDto, UpdateComentarioDto } from '../DTO/comentario.dto'
import {BadRequestException} from "@nestjs/common";
import {ErroresSchema, Existe_O_No} from "../../ModuleValidations/ModuleValidations";

const SchemaComment = z.object({


    ComentarioUser : z.string()
        .min(1,{
        message : 'No puede colocar un comentario sin contenido.'
    }).max(500, {
        message : 'El comentario sobrepaso el tamaño máximo.'
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
    }).optional(),

    PracticeId : z.number()
        .int({
            message : 'No existe algun Practice con ese id'
        }).optional(),

    SobreEmpresaId : z.number()
        .int({
            message : 'No exsite alguna Compañía con ese id'
        }).optional()
}).strict({
    message : 'Se envio algun campo/s no válido/s en el request.'
})


export async function validateComment(Comment : Omit<ComentarioDto, 'id'>){

    const result = await SchemaComment.safeParse(Comment);

    if(!result.success){
        const Errores = ErroresSchema(result.error);
        throw new BadRequestException("Error en la validación del POST de Comentarios.",
            Errores);
    }

    const {CompanyId, StudentId, PostId, PracticeId, SobreEmpresaId} = result.data;

    if(Number(!!PostId) + Number(!!PracticeId) + Number(!!SobreEmpresaId) != 1){
        throw new BadRequestException("El comentario puede ser generado " +
            "por una practica, en un post de usuario o en el perfil" +
            " de una compañia, debe colocar alguna de ellas.");
    }

    if( PostId ) {
        const E_o_N = await Existe_O_No(PostId, "postUser");
        if(!E_o_N){
            throw new BadRequestException(`El PostUser con ID ${PostId} no existe.`)
        }
    }

    if( PracticeId ){
        const E_o_N = await Existe_O_No(PracticeId, "practice");
        if(!E_o_N){
            throw new BadRequestException(`El Practice con ID ${ PracticeId } no existe.`)
        }
    }

    if( SobreEmpresaId ){
        const E_o_N = await Existe_O_No(SobreEmpresaId, "companyProfile", "CompanyUserId");

        if(!E_o_N){
            throw new BadRequestException(`la CompanyUser con ID ${SobreEmpresaId} no existe.`)
        }

    }

    if(Number(!!CompanyId) + Number(!!StudentId) != 1){
        throw new BadRequestException("El comentario le debe pertenecer a una compañia o" +
            " un estudiante, no ambas o ninguna al mismo tiempo.");
    }

    if(CompanyId){
        const E_o_N = await Existe_O_No(CompanyId, "companyProfile", "CompanyUserId");
        if(!E_o_N){
            throw new BadRequestException(`la CompanyUser con ID ${CompanyId} no existe.`)
        }
    }

    if(StudentId){
        const E_o_N = await Existe_O_No(StudentId, "studentProfile", "studentUserId");
        if(!E_o_N){
            throw new BadRequestException(`El StudentUser con ID ${StudentId} no existe.`)
        }
    }


    return result;

}

export function validatePartialComment(Comment : UpdateComentarioDto){

    const result = SchemaComment.partial().safeParse(Comment);

    if(!result.success){
        const Errores = ErroresSchema(result.error);
        throw new BadRequestException("Error en la validación del PUT de Comentarios.",
            Errores);
    }

    return result;
}

