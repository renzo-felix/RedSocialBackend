import { z } from 'zod';
import { Fields } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import {ErroresSchema} from "../../ModuleValidations/ModuleValidations";


const ArrayHabilities = ["Teoría de Grafos", "DP", "Date Base",
"C++", "Estructura de Datos", "ADA"] as const;

const HabilitySchema = z.object({
  FieldName: z.enum(ArrayHabilities, {
    message : "No se tiene registro de la habilidad mandada."
  }),

  Description: z
    .string()
    .min(1, {
      message: 'La descripción está vacia.',
    })
    .max(300, {
      message:
        'La descripción de la habilidad superó la cantidad máxima de caracteres permitidos',
    })
    .optional(),
}).strict({
  message : 'Se envio algun campo/s no válido/s en el request.'
});

export function ValidateHability(data: Omit<Fields, 'id'>) {
  const result = HabilitySchema.safeParse(data);

  if (!result.success) {
    // El result.error guarda todos los errores ocurridos en el schema.
    const Errores = ErroresSchema(result.error);
    throw new BadRequestException(
      'Error en la validación del Post de' + ' Field: ' + Errores,
    );
  }

  return result;
}

export function ValidatePartialHability(data: Partial<Fields>) {
  const result = HabilitySchema.partial().safeParse(data);

  if (!result.success) {
    const Errores = ErroresSchema(result.error);
    throw new BadRequestException(
      'Error en la validación del Put o Patch de' + ' Field: ' + Errores,
    );
  }

  return result;
}
