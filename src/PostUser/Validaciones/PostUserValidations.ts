import {z} from 'zod'
import {PostUserDto, UpdatePostUserDto} from '../DTO/postuser.dto'
import {ErroresSchema, Existe_O_No} from '../../ModuleValidations/ModuleValidations'
import {BadRequestException} from "@nestjs/common";

const SchemaPostUser = z.object({

    PublicationDate : z.string().refine((val) => !isNaN(Date.parse(val)), {
        message : 'La fecha no está en formato Date.'
    }).optional(),

    TituloPost : z.string()
        .min(1,{
        message : 'El titulo no puede ir vacio.'
    }).max(150, {
        message : 'El titulo sobrepasa la cantidad máxima de tamaño.'
    }),

    Descripcion : z.string()
        .min(1, {
        message : 'La descripción del post no puede estar vacia.'
    }).max(1000, {
        message : 'La descripción del post sobrepasa la cantidad máxima de tamaño.'
    }),

    ImgPostUrl : z.string()
        .min(1, {
        message : 'El Url no puede estar vacio.'
    }).optional(),

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
    }).optional()

}).strict({
    message : 'Se envio algun campo/s no válido/s en el request.'
});



export async function validatePostUser(PostUser : Omit<PostUserDto, 'id'>){

    const result = await SchemaPostUser.safeParse(PostUser);

    if(!result.success){
        const Errores = ErroresSchema(result.error);
        throw new BadRequestException("Error en la validación del POST de PostUser, Errores: ",
            Errores);
    }

    const {CompanyId, StudentId, PublicationDate} = result.data;

    const DatePublication = new Date(PublicationDate);
    if(DatePublication < new Date()){
        throw new BadRequestException("La fecha de publicación no puede ser menor a la actual.");
    }

    if(Number(!!CompanyId) + Number(!!StudentId) != 1){
        throw new BadRequestException("El PostUser le debe pertenecer a una compañia o" +
            " un estudiante, no ambas o ninguna al mismo tiempo.");
    }

    if(CompanyId){
        const E_o_N = await Existe_O_No(CompanyId, "companyProfile", "CompanyUserId");
        if(!E_o_N){
            throw new BadRequestException(`El CompanyUser con ID ${CompanyId} no existe.`)
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

export function validatePartialPostUser(PostUser : UpdatePostUserDto){

    const result = SchemaPostUser.partial().safeParse(PostUser);

    if(!result.success){
        const Errores = ErroresSchema(result.error);
        throw new BadRequestException("Error en la validación del PUT de PostUser, Errores: ",
            Errores);
    }

    const {PublicationDate} = result.data;

    const DatePublication = new Date(PublicationDate);
    if(DatePublication < new Date()){
        throw new BadRequestException("La fecha de publicación no puede ser menor a la actual.");
    }

    return result;

}

