import { z } from 'zod';
import { BadRequestException } from '@nestjs/common';
import {ErroresSchema} from "../../../ModuleValidations/ModuleValidations";

const CompanyProfileSchema = z.object({
  Sunac: z.string().nonempty('El campo Sunac no puede estar vacío.'),
  GitHub: z.string().url('El campo GitHub debe ser una URL válida.').optional(),
  IndustrySector: z
    .string()
    .nonempty('El campo IndustrySector no puede estar vacío.'),
  imageURL: z
    .string()
    .optional(),
  PhoneNumber: z.string().optional(),
  CompanyUserId: z
    .number()
    .int()
    .positive('CompanyUserId debe ser un número positivo.'),
  Address : z.string().nonempty({
    message : 'El campo de Address no puede estar vacío.',
  }),
  Description : z.string().nonempty({
    message : 'El campo de la descripción no puede estar vacío.',
  }),

  InfoCorta : z.string().min(1, {
    message : "No se puede colocar una descripción vacia"
  }).max(200, {
    message : "Supero la cantidad máxima de caracteres permitidos"
  }).optional(),

  InfoLarga : z.string().min(1, {
    message : "No se puede colocar una descripción vacia"
  }).max(1500, {
    message : "Supero la cantidad máxima de caracteres permitidos"
  }).optional(),

  PortadaImg: z.string().url({
    message : "Se esperaba un URL de la imagen"
  }).optional()

}).strict({
  message : 'Se envio algun campo/s no válido/s en el request.'
});

export function validateCompanyPartialProfile(data: unknown) {
  const result = CompanyProfileSchema.partial().safeParse(data);

  if (!result.success) {
    const Errores = ErroresSchema(result.error);
    throw new BadRequestException(
      'Error en la validación del perfil de la compañía. \nErrores: ' + Errores,
    );
  }

  return result.data;
}