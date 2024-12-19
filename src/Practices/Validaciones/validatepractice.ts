import { z } from 'zod';
import { BadRequestException } from '@nestjs/common';
import {PracticeDTO, UpdatePracticeDTO} from "../Dto/PracticeDto";
import {ErroresSchema, Existe_O_No} from "../../ModuleValidations/ModuleValidations";

const practiceSchema = z.object({
  InitDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "La fecha no tiene el formato Date",
  }).optional(),

  CompanyId: z
    .number()
    .int({
      message: 'El id no existe.',
    })
    .min(1, {
      message: 'El id no existe.',
    }),

  Finalized : z.
      boolean({
    message : 'Debe ser de tipo booleano.'
  }).optional(),

  Titulo : z.string()
      .min(1, {
    message: 'El titulo no puede ser vacio.'
  }).max(100, {
    message : 'El tamaño del titulo supera el máximo válido.'
  }),

  InfoCorta : z.string()
      .min(1, {
    message: 'La descripción no puede ser vacia, en caso no desee colocar esta descripción, no coloque este campo.'
  }).max(200,{
    message : 'La descripción supera el máximo válido.'
  }).optional(),

  InfoLarga : z.string()
      .min(1, {
    message : 'La descripción no puede ser vacia.'
  }).max(500, {
    message : 'La descrpición supera el máximo válido.'
  })

}).strict({
  message : 'Se envio algun campo/s no válido/s en el request.'
});

export function validateParcialPractice(data: UpdatePracticeDTO) {
  const result = practiceSchema.partial().safeParse(data);

  if (!result.success) {
    const Errores = ErroresSchema(result.error);

    throw new BadRequestException(
      'Error en la validación del Post de Practice.', Errores
    );
  }

  const {InitDate} = result.data;

  if (InitDate){
    const InitDateAct = new Date(InitDate);
    if(InitDateAct <= new Date())
      throw new BadRequestException('Debe colocar una fecha mayor a la actual.');
  }

  /* En si no se busca cambiar una practica de una compañía a otra.
  if (CompanyId) {
    if (!Existe_O_No(CompanyId, "companyProfile", "CompanyUserId"))
      throw new BadRequestException(
        `El Id de la compañía ${CompanyId} no se tiene registrado.`,
      );
  }*/

  return result;
}

export async function validatePractice(data: Omit<PracticeDTO, "id">) {
  const result = await practiceSchema.safeParse(data);

  if (!result.success) {
    const Errores = ErroresSchema(result.error);

    throw new BadRequestException(
      'Error en la validación del Post de Practice.', Errores);
  }

  let { InitDate, CompanyId } = result.data;

  if (InitDate){
    const InitDateAct = new Date(InitDate);
    if(InitDateAct <= new Date())
      throw new BadRequestException('Debe colocar una fecha mayor a la actual.');
  }

  const ExisteCompany = await Existe_O_No(CompanyId, "companyProfile", "CompanyUserId");

  if (!ExisteCompany) {
    throw new BadRequestException(
      `No existe la compañía con ID ${CompanyId}`,
    );
  }

  return result;
}