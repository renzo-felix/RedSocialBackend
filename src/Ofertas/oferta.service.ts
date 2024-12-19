import {BadRequestException, HttpException, HttpStatus, Injectable,} from '@nestjs/common';
import {Fields, Offer, OfferOnFields, PrismaClient, StudentOnOffers,} from '@prisma/client';
import {HandlingErrorOfSearchById} from '../Notifications/ManejoDeErrores/Errores';
import {validateOffer, validatePartialOffer,} from './Validaciones/validateoffer';
import {OfertaDto, UpdateOfertaDto} from './DTO/OfertaDto'
import {StudentProfileDto} from '../Student/profile/student-profile.dto'

@Injectable()
export class OfertaService {
  private prisma = new PrismaClient();

  async GetAllOffer(): Promise<OfertaDto[] | null> {

    try {
      const result = await this.prisma.offer.findMany();

      if (!result || result.length === 0) {
        throw new HttpException(
            'No se tiene registro de una oferta creada.',
            HttpStatus.NO_CONTENT,
        );
      }

      return result.map((oferta) => ({
        id: oferta.id,
        DateInit: oferta.DateInit,
        DateLimite: oferta.DateLimite,
        Vacancies: oferta.Vacancies,
        RequireHours: oferta.RequireHours,
        CompanyId: oferta.CompanyId
      }));
    } catch (err){
      throw err;
    }

  }

  async GetOfferById(idoffer: number): Promise<OfertaDto> {

    let OfertaDto : OfertaDto;
    await this.prisma.offer.findUnique({
      where: { id: idoffer },
      include: {
        Company: true,
      },
    }).then(OfertaById =>{

      if(!OfertaById){
        throw new BadRequestException(`La oferta con el ID ${idoffer} no existe.`);
      }

      OfertaDto = {
        id : OfertaById.id,
        DateInit : OfertaById.DateInit,
        DateLimite : OfertaById.DateLimite,
        RequireHours : OfertaById.RequireHours,
        Vacancies : OfertaById.Vacancies,
        CompanyId : OfertaById.CompanyId
      }

    }).catch(error => {
      throw error;
    });

    return OfertaDto;
  }

  async PostOffer(offer: Omit<OfertaDto, 'id'>): Promise<OfertaDto | null> {

    let OfferDto : OfertaDto;
    const result = await validateOffer(offer);

    await this.prisma.offer.create({
      data: {
        DateInit: result.data.DateInit,
        DateLimite: result.data.DateLimite,
        Vacancies: result.data.Vacancies,
        RequireHours: result.data.RequireHours,
        CompanyId: result.data.CompanyId,
      },
    }).then(PostOffer => {

      OfferDto = {
        id : PostOffer.id,
        DateLimite : PostOffer.DateLimite,
        DateInit : PostOffer.DateInit,
        RequireHours : PostOffer.RequireHours,
        Vacancies : PostOffer.Vacancies,
        CompanyId : PostOffer.CompanyId
      }

    }).catch(error => {
      throw new BadRequestException("Los campos enviados son incorrectos.");
    });


    return OfferDto;
  }

  async UpdateOffer(
    idOffer: number,
    data: UpdateOfertaDto,
  ): Promise<UpdateOfertaDto | null> {

    let UpdateOfferDto : UpdateOfertaDto;
    const result = validatePartialOffer(data);

    await this.prisma.offer.update({
      where: { id: idOffer },
      data: result.data,
    }).then(UpdateOffer => {

      UpdateOfferDto = {
        DateInit : UpdateOffer.DateInit,
        DateLimite : UpdateOffer.DateLimite,
        Vacancies : UpdateOffer.Vacancies,
        RequireHours : UpdateOffer.RequireHours
      }

    }).catch(error => {
      HandlingErrorOfSearchById(error);
    });

    return UpdateOfferDto;
  }

  async DeleteOffer(idOffer: number): Promise<OfertaDto | null> {

    let OfertaDto : OfertaDto;
    await this.prisma.offer.delete({
        where: { id: idOffer },
    }).then(DeleteOffer => {

      OfertaDto = {

        id : DeleteOffer.id,
        DateInit : DeleteOffer.DateInit,
        DateLimite : DeleteOffer.DateLimite,
        Vacancies : DeleteOffer.Vacancies,
        RequireHours : DeleteOffer.RequireHours,
        CompanyId : DeleteOffer.CompanyId

      }

    }).catch(error => {
      HandlingErrorOfSearchById(error);
    });

    return OfertaDto;
  }

  async AssignOfferToUser(
    idUser: number,
    idOffer: number,
  ): Promise<StudentOnOffers | null> {
    try {
      return await this.prisma.studentOnOffers.create({
        data: {
          UserId: idUser,
          OffersId: idOffer,
        },
      });
    } catch (error) {
      throw new BadRequestException(
          'El ID del estudiante u oferta no existen.',
      );
    }
  }

  async FindUsersOfOffer(idOffer: number): Promise<StudentProfileDto[] | null> {
    let UserDto : StudentProfileDto[];

    await this.prisma.studentOnOffers.findMany({
      where : { OffersId : idOffer },
      include: { users : true }
    }).then(StudentAndOffers => {


      if(!StudentAndOffers){
        throw new BadRequestException(`No hay ningun usuario relacionado con la oferta
        de ID ${idOffer} o esa oferta no existe.`);
      }

      UserDto = StudentAndOffers.map( (user) => ({

        studentUserId : user["users"].studentUserId,
        Institute : user["users"].Institute,
        GitHub : user["users"].GitHub,
        Linkedin : user["users"].Linkedin,
        imageURL : user["users"].imageURL,
        PhoneNumber : user["users"].PhoneNumber

      }));

    }).catch(err => {
      throw err;
    });

    return UserDto;
  }

  async AssignFieldToOffer(
    idField: number,
    idOffer: number,
  ): Promise<OfferOnFields> {
    try {
      return await this.prisma.offerOnFields.create({
        data: {
          OffersId: idOffer,
          FieldId: idField,
        },
      });
    } catch (error) {
      throw new BadRequestException(
          'El ID de la habilidad u oferta no existen.',
      );
    }
  }

  async FindFieldsOfOffer(idOffer: number): Promise<Fields[] | null> {
    let Fields : Fields[];

    await this.prisma.offerOnFields.findMany({
      where : { OffersId : idOffer },
      include: { fields : true }
    }).then(FieldsAndOffers => {


      if(!FieldsAndOffers){
        throw new BadRequestException(`No hay ninguna habilidad relacionado con la oferta
        de ID ${idOffer} o esa oferta no existe.`);
      }

      Fields = FieldsAndOffers.map( (field) => ({

        id : field["fields"].id,
        FieldName : field["fields"].FieldName,
        Description : field["fields"].Description

      }));

    }).catch(err => {
      throw err;
    });

    return Fields;
  }
}