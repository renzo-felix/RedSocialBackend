import { z } from 'zod';
import { BadRequestException } from '@nestjs/common';
import {OfertaDto, UpdateOfertaDto} from "../DTO/OfertaDto";
import {ErroresSchema, Existe_O_No} from "../../ModuleValidations/ModuleValidations";
// como lambdas en c++
const LimiteDecimales = (valor: number, NumDecimales: number) => {
  const ParteDecimal = valor.toString().split('.')[1]; // Acá de forma 2 partes, una parte del entero [0] y otra del decimal [1].
  return !ParteDecimal || ParteDecimal.length <= NumDecimales; // la parte decimal es mayor a los decimales que queriamos?
};

const OfferSchema = z.object({

  DateInit: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "La fecha no tiene el formato Date",
  }).optional(),

  DateLimite: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "La fecha no tiene el formato Date",
  }),

  Vacancies: z
    .number()
    .int({
      message: 'El número de vacantes debe ser un número entero.',
    })
    .min(1, {
      message: 'No puede crear una práctica con 0 practicantes.',
    }),

  RequireHours: z
    .number()
    .min(1, {
      message: 'La práctica debe durar a lo máximo 1 hora.',
    })
    .refine((val) => LimiteDecimales(val, 2), {
      message: 'Los decimales deben ser menores de 2.',
    }),
  CompanyId: z.number().int({
    message: 'El id de la compañía no existe.',
  }),

}).strict({
  message : 'Se envio algun campo/s no válido/s en el request.'
});

export function validatePartialOffer(object: UpdateOfertaDto) {
  const result = OfferSchema.partial().safeParse(object);
  if (!result.success) {
    const Errores = ErroresSchema(result.error);
    throw new BadRequestException(
        `Error en la validación del PUT de Offer. Error: ${Errores}`
    );
  }
  const { DateInit, DateLimite } = result.data;

  if (DateInit || DateLimite) {
    const FechaActual = new Date();

    if (DateInit && DateLimite) {
      const DateLimiteAct = new Date(DateLimite);
      const DateInitAct = new Date(DateInit);

      if(DateInitAct < FechaActual){
        throw new BadRequestException(
            'En la oferta, la fecha de inicio no puede ser mayor a la fecha actual.'
        )
      }

      if (DateLimiteAct <= DateInitAct) {
        throw new BadRequestException(
            'En la oferta, la fecha de finalización no puede ser mayor a la fecha de inicio.'
        );
      }

    }

    if (DateLimite && !DateInit) {
      const DateLimiteAct = new Date(DateLimite);

      if (DateLimiteAct <= FechaActual) {
        throw new BadRequestException(
            'En la oferta, la fecha de finalización no puede ser menor o igual a la fecha actual.'
        );
      }
    }

    if (DateInit && !DateLimite) {
      const DateInitAct = new Date(DateInit);

      if (DateInitAct <= FechaActual) {
        throw new BadRequestException(
            'En la oferta, la fecha de inicio no puede ser menor o igual a la fecha actual.'
        );
      }
    }
  }



  /* Esta validación puede que no se realize.
  if (CompanyId)
    if (!Existe_O_No(CompanyId))
      throw new BadRequestException('La compañía de la oferta' + 'no existe.');
  */

  return result;

}
export async function validateOffer(object: Omit<OfertaDto, 'id'>)  {
  const result = await OfferSchema.safeParse(object);
  if (!result.success) {
    const Errores = ErroresSchema(result.error);
    throw new BadRequestException(
      'error en la validación del Post de ' +
        `Offer. Error: ${Errores}`,
    );
  }

  const {CompanyId, DateLimite, DateInit} = result.data;

  const E_o_n = await Existe_O_No(CompanyId, "companyProfile", "CompanyUserId");

  if (!E_o_n)
    throw new BadRequestException(`La compañía cond ID ${CompanyId} no existe.`);

  if (DateInit && DateLimite){

    const DateLimiteAct = new Date(DateLimite);
    const DateInitAct = new Date(DateInit);

    if(DateInitAct < new Date()){
      throw new BadRequestException(
          'En la oferta, la fecha de inicio no puede ser mayor a la fecha actual.'
      )
    }

    if(DateLimiteAct <= DateInitAct){
      throw new BadRequestException(
          'En la oferta, la fecha de finalización' +
          'no puede ser mayor a la fecha de inicio.',
      );
    }

  }
  else{

    const DateLimiteAct = new Date(DateLimite);
    if(DateLimiteAct <= new Date())
      throw new BadRequestException(
          'En la oferta, la fecha de finalización' +
          'no puede ser mayor a la fecha de inicio.',
      );
  }

  return result;
}
