import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import {
  Fields,
  PrismaClient,
  StudentOnField,
  OfferOnFields,
} from '@prisma/client';

import {
  ValidateHability,
  ValidatePartialHability,
} from './Validaciones/HabilitiesValidations';
import {
  HandlingErrorOfSearchById,
  HandlingErrorOnFindHability,
} from './ManejoDeErrores/Errores';
import {StudentProfileDto} from '../Student/profile/student-profile.dto'
import {OfertaDto} from '../Ofertas/DTO/OfertaDto'

@Injectable()
export class HabilitiesService {
  private prisma = new PrismaClient();

  async GetAllHabilities(): Promise<Fields[] | null> {
    const result = await this.prisma.fields.findMany();

    if (!result || result.length === 0) {
      throw new HttpException(
        'No hay una habilidad puesta.',
        HttpStatus.NO_CONTENT,
      );
    }

    return result;
  }

  async GetHabilitiesById(idField: number): Promise<Fields> {
    const result = await this.prisma.fields.findUnique({
      where: { id: idField },
    });

    if (!result) {
      throw new BadRequestException(
        `La habilidad con el ID ${idField} no existe.`,
      );
    }

    return result;
  }

  async PostHabilitie(data: Omit<Fields, 'id'>): Promise<Fields> {
    const result = ValidateHability(data);

    try {
      return await this.prisma.fields.create({
        data: {
          FieldName: result.data.FieldName,
          Description: result.data.Description,
        },
      });
    } catch (error) {
      HandlingErrorOfSearchById(error);
    }
  }

  async DeleteHabilityById(id: number): Promise<Fields> {
    try {
      return await this.prisma.fields.delete({
        where: { id: id },
      });
    } catch (error) {
      HandlingErrorOnFindHability(error);
    }
  }

  async PutHabilityById(id: number, data: Partial<Fields>): Promise<Fields> {
    const result = ValidatePartialHability(data);

    try {
      return this.prisma.fields.update({
        where: { id: id },
        data: result.data,
      });
    } catch (error) {
      HandlingErrorOfSearchById(error);
    }
  }

  async AssignHabilityToStudent(
    idStudent: number,
    idField: number,
  ): Promise<StudentOnField | null> {
    try {
      return await this.prisma.studentOnField.create({
        data: {
          UserId: idStudent,
          FieldId: idField,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'El Id del usuario o del campo no existen.',
      );
    }
  }

  async FindStudentsOfHability(
    idField: number,
  ): Promise<StudentProfileDto[] | null> {
    let UserDto : StudentProfileDto[];

    await this.prisma.studentOnField.findMany({
      where : { FieldId : idField },
      include: { User : true }
    }).then(StudentAndFields => {


      if(!StudentAndFields){
        throw new BadRequestException(`No hay ningun usuario relacionado con la habilidad
        de ID ${idField} o esa habilidad no existe.`);
      }

      UserDto = StudentAndFields.map( (user) => ({

        studentUserId : user["User"].studentUserId,
        Institute : user["User"].Institute,
        GitHub : user["User"].GitHub,
        Linkedin : user["User"].Linkedin,
        imageURL : user["User"].imageURL,
        PhoneNumber : user["User"].PhoneNumber

      }));

    }).catch(err => {
      throw err;
    });

    return UserDto;
  }

  async AssignHabilityToOffer(
    idOffer: number,
    idField: number,
  ): Promise<OfferOnFields | null> {
    try {
      return await this.prisma.offerOnFields.create({
        data: {
          OffersId: idOffer,
          FieldId: idField,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'El Id del campo o de la oferta no existen.',
      );
    }
  }

  async FindOffersOfHability(idField: number): Promise<OfertaDto[] | null> {
    let Offers : OfertaDto[];

    await this.prisma.offerOnFields.findMany({
      where : { FieldId : idField },
      include: { offers : true }
    }).then(FieldsAndOffers => {


      if(!FieldsAndOffers){
        throw new BadRequestException(`No hay ninguna habilidad relacionado con la oferta
        de ID ${idField} o esa habilidad no existe.`);
      }

      Offers = FieldsAndOffers.map( (offer) => ({

        id : offer["offers"].id,
        DateInit : offer["offers"].DateInit,
        DateLimite : offer["offers"].DateLimite,
        Vacancies : offer["offers"].Vacancies,
        RequireHours : offer["offers"].RequireHours,
        CompanyId : offer["offers"].CompanyId

      }));

    }).catch(err => {
      throw err;
    });

    return Offers;
  }
}
