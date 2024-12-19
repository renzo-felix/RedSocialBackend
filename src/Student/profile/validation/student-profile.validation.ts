import { z } from 'zod';
import { StudentProfile, PrismaClient } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

const StudentProfileSchema = z.object({
  Institute: z
    .string()
    .max(255, { message: 'El instituto no puede exceder los 255 caracteres.' })
    .optional(),
  Linkedin: z
    .string()
    .max(255, { message: 'El LinkedIn debe ser un string válido.' })
    .optional()
    .or(z.literal('')),
  GitHub: z
    .string()
    .max(255, { message: 'El GitHub debe ser un string válido.' })
    .optional()
    .or(z.literal('')),
  imageURL: z
    .string()
    .max(255, { message: 'La URL de la imagen debe ser un string válido.' })
    .optional()
    .or(z.literal('')),
  PhoneNumber: z
    .string()
    .length(9, {
      message: 'El número de teléfono debe contener exactamente 9 dígitos.',
    })
    .regex(/^\d+$/, {
      message: 'El número de teléfono debe contener solo dígitos.',
    })
    .optional(),
  studentUserId: z
    .number()
    .min(1, { message: 'El ID del estudiante es requerido.' }),
  PortadaImg : z.string().url({
    message : 'Se esepraba un URL para la imagen'
  }).optional()
})

function ErroresSchema(Errores: z.ZodError) {
  return Errores.errors
    .map((err) => `${err.path.join('.')} - ${err.message}`)
    .join(', ');
}

export function   validateStudentProfile(object: Omit<StudentProfile, 'id'>) {
  const result = StudentProfileSchema.safeParse(object);

  if (!result.success) {
    const Errores = ErroresSchema(result.error);
    throw new BadRequestException(
      'Error en la validación del Post de StudentProfile. \nErrores: ' +
        Errores,
    );
  }
  return result;
}

export function validatePartialStudentProfile(object: Partial<StudentProfile>) {
  const result = StudentProfileSchema.safeParse(object);

  if (!result.success) {
    const errors = result.error.errors
      .map((err) => `${err.path.join('.')} - ${err.message}`)
      .join(', ');
    throw new BadRequestException(
      'Error en la validación del perfil del estudiante. Errores: ' + errors,
    );
  }

  return result;
}

async function ExisteStudentProfile(idProfile: number): Promise<boolean> {
  const prisma = new PrismaClient();

  const result = await prisma.studentProfile.findUnique({
    where: { studentUserId: idProfile },
  });

  return !!result;
}
