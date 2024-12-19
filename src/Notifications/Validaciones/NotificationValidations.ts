import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import {BadRequestException} from '@nestjs/common';
import { NotificationDto, UpdateNotificationDto } from '../DTO/notification.dto'
import {ErroresSchema, Existe_O_No} from "../../ModuleValidations/ModuleValidations";

//Algunos como ejemplo puse :b
const TypesNotifications = [
  'Publicacion',
  'Advertencia',
  'Practica',
  'SeguidoresPost',
  'CompanyPost',
] as const;


const NotificationSchema = z.object({
  Message: z.string().min(1, {
    message: 'Debe colocar algún mensaje en la notificación.',
  }),

  TypeNotification: z.enum(TypesNotifications, {
    message: 'No existe ese tipo de notificación.',
  }),

  CreateDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "La fecha no tiene el formato Date",
  }).optional(),


  CompanyNotiId: z
    .number()
    .int({
      message: 'El Id no existe.',
    })
    .positive({
      message: 'El Id no puede ser negativo',
    })
    .min(1, {
      message: 'El Id no existe',
    })
    .optional(),

  PracticeNotiId: z
    .number()
    .int({
      message: 'El Id no existe.',
    })
    .min(1, {
      message: 'El Id no existe.',
    })
    .optional(),
}).strict({
  message : 'Se envio algun campo/s no válido/s en el request.'
});

export function validatePartialNotification(object: UpdateNotificationDto) {

  const result = NotificationSchema.partial().safeParse(object);

  if (!result.success) {
    const Errores = ErroresSchema(result.error);
    throw new BadRequestException(
      'Error en la validación del Post de la ' + 'notificación : ' + Errores,
    );
  }

  const {CreateDate} = result.data;

  if(CreateDate){
    const InitDate = new Date(CreateDate);
    if(InitDate <= new Date()){
      throw new BadRequestException('Debe colocar una fecha mayor a la actual.');
    }
  }

  return result;

}

export async function validateNotification(object: Omit<NotificationDto, 'id'>) {
  const result = await NotificationSchema.safeParse(object);


  if (!result.success) {
    const Errores = ErroresSchema(result.error);
    throw new BadRequestException('Error en el PostNotification: ' + Errores);
  }

  const { CompanyNotiId, PracticeNotiId, CreateDate } = result.data;

  if (Number(!!CompanyNotiId) + Number(!!PracticeNotiId) != 1) {
    throw new BadRequestException(
      'La notificación le debe pertenecer a una compañía o a una ' +
        'notificación, no ambas o ninguna al mismo tiempo.',
    );
  }


  if (CompanyNotiId) {

    const ExisteCompany = await Existe_O_No(CompanyNotiId, 'companyProfile', 'CompanyUserId');

    if(!ExisteCompany) {
      throw new BadRequestException(
          `La compañía con el ID ${CompanyNotiId} no existe.`
      );
    }

  } else{

    const ExistePractice = await Existe_O_No(PracticeNotiId, 'practice');

    if(!ExistePractice) {
      throw new BadRequestException(
          `La practica con el ID ${PracticeNotiId} no existe.`
      );
    }

  }

  if(CreateDate){
    const InitDate = new Date(CreateDate);
    if(InitDate <= new Date()){
      throw new BadRequestException('Debe colocar una fecha mayor a la actual.');
    }
  }

  return result;
}
