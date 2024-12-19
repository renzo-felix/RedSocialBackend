import {z} from "zod";
import {PrismaClient} from "@prisma/client";
import {BadRequestException} from "@nestjs/common";

export function ErroresSchema(Errores: z.ZodError) {
    return Errores.errors
        .map((err) => `${err.path.join('.')} - ${err.message}`)
        .join(' && ');
}

export async function Existe_O_No(id : number, Entity : string, fieldName : string = "id") : Promise<boolean>{

    const WhereCondition = { [fieldName] : id } as any;
    const prisma = new PrismaClient()

    const result = await prisma[Entity].findUnique({
        where : WhereCondition,
    });

    return !!result;

}

export async function DataFileEntity(id : number, Entity : string, fieldName : string = "id") {

    const WhereCondition = { [fieldName] : id } as any;
    const prisma = new PrismaClient()

    if(!(await Existe_O_No(id, Entity, fieldName))){
        throw new BadRequestException(`No existe algun/a ${Entity} con el id ${id}`)
    }


    return await prisma[Entity].findUnique({
        where: WhereCondition,
    });


}