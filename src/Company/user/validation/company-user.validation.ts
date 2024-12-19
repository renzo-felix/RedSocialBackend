import { z } from 'zod';
import { BadRequestException } from '@nestjs/common';
import { CompanyUser, PrismaClient } from '@prisma/client';
import { CreateCompanyDto } from '../user.dto';
import {ErroresSchema} from "../../../ModuleValidations/ModuleValidations";

const EmailValido = (email: string) => {
  return email.includes('@');
};

const CompanyUserSchema = z.object({
  Username: z
    .string()
    .min(1, { message: 'El nombre de usuario no puede estar vacío.' })
    .max(255, { message: 'El nombre de usuario no puede exceder los 255 caracteres.',})
    .optional(),

  Password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    .max(12, { message: 'La contraseña no puede exceder los 12 caracteres.' })
    .optional(),

  email: z
    .string()
    .email({ message: 'El email debe tener un formato válido.' })
    .refine((email) => EmailValido(email), { message: 'El email debe contener un dominio válido.',})
    .optional(),

  IndustrySector : z.string().min(1, {
    message : 'Ese tipo de industria no existe.'
  }),

  Sunac : z.string().min(1, {
    message : 'La identificación de la SUNAC enviada no existe.'
  })
}).strict({
  message : 'Se envio algun campo/s no válido/s en el request.'
});


export function validateCompanyUser(object: Omit<CompanyUser, 'id'>) {
  const result = CompanyUserSchema.safeParse(object);
  if (!result.success) {
    const Errores = ErroresSchema(result.error);
    throw new BadRequestException(
      'Error en la validación del Post de CompanyUser. Errores: ' + Errores,
    );
  }
  return result.data;
}

export function validatePartialCompanyUser(object: Partial<CreateCompanyDto>) {
  const result = CompanyUserSchema.partial().safeParse(object);
  if (!result.success) {
    const Errores = ErroresSchema(result.error);
    throw new BadRequestException(
      'Error en la validación de los cambios proporcionados. Errores: ' + Errores,
    );
  }
  return result.data;
}