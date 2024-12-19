import { z } from 'zod';
import { StudentUser } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { CreateStudentDto } from '../user.dto';

const EmailValido = (email: string) => {
  return email.endsWith('@utec.edu.pe');
};

const StudentUserSchema = z.object({
  Name: z
    .string()
    .min(1, { message: 'El nombre no puede estar vacío.' })
    .max(255, { message: 'El nombre no puede exceder los 255 caracteres.' })
    .optional(),

  LastName: z
    .string()
    .min(1, { message: 'El apellido no puede estar vacío.' })
    .max(255, { message: 'El apellido no puede exceder los 255 caracteres.' })
    .optional(),

  Password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    .max(12, { message: 'La contraseña no puede exceder los 12 caracteres.' })
    .optional(),

  email: z
    .string()
    .email({ message: 'El email debe tener un formato válido.' })
    .refine((email) => EmailValido(email), {
      message: 'El email debe terminar en @utec.edu.pe.',
    })
    .optional(),
})

function ErroresSchema(Errores: z.ZodError) {
  return Errores.errors
    .map((err) => `${err.path.join('.')} - ${err.message}`)
    .join(', ');
}

export function validateStudentUser(object: Omit<StudentUser, 'id'>) {
  const result = StudentUserSchema.safeParse(object);
  if (!result.success) {
    const Errores = ErroresSchema(result.error);
    throw new BadRequestException(
      'Error en la validación del Post de StudentUser. Errores: ' + Errores,
    );
  }
  return result.data;
}

export function validatePartialStudentUser(object: Partial<CreateStudentDto>) {
  const result = StudentUserSchema.safeParse(object);
  if (!result.success) {
    const Errores = result.error.errors.map(err => `${err.path.join('.')} - ${err.message}`).join(', ');
    throw new BadRequestException(
      'Error en la validación de los cambios proporcionados. Errores: ' + Errores,
    );
  }
  return result.data; 
}