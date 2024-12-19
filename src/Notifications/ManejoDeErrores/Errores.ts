import { Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

export function HandlingErrorOfSearchById<T>(error: T) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // ERROR PARA MANEJAR CASOS QUE NO SE ENCUENTRA EL REQUEST.
    if (error.code === 'P2025')
      throw new BadRequestException('Notificación no encontrada.');
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    // No debería entrar aquí por el zod. :b
    throw new BadRequestException('Datos mandados NO validos.');
  } else {
    throw new BadRequestException('Error del servidor.');
  }
}

export function HandlingErrorOnFindNotification<T>(error: T) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025')
      throw new BadRequestException('Notificación no encontrada.');
  } else {
    throw new BadRequestException('Error del servidor.');
  }
}
