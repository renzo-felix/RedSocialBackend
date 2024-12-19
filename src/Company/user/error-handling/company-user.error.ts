import { Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

export function HandlingErrorOfSearchById<T>(error: T) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025')
      throw new BadRequestException('Compañia no encontrada.');
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    throw new BadRequestException('Datos mandados NO validos.');
  } else {
    throw new BadRequestException('Error del servidor.');
  }
}
