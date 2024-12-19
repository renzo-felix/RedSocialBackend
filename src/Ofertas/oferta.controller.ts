import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  ParseIntPipe,
  Param,
  Body,
} from '@nestjs/common';

import { OfertaService } from './oferta.service';
import { Fields, OfferOnFields, StudentOnOffers } from '@prisma/client';
import { OfertaDto, UpdateOfertaDto } from "./DTO/OfertaDto";
import { StudentProfileDto } from "../Student/profile/student-profile.dto";

@Controller('oferta')
export class OfertaController {
  constructor(private readonly ofertaservice: OfertaService) {}

  @Get()
  async getAllOffer(): Promise<OfertaDto[] | null> {
    return this.ofertaservice.GetAllOffer();
  }

  @Get(':id')
  async getByIdOffer(@Param('id', ParseIntPipe) idOffert): Promise<OfertaDto> {
    return this.ofertaservice.GetOfferById(idOffert);
  }

  @Post()
  async postOffer(@Body() data: Omit<OfertaDto, 'id'>): Promise<OfertaDto | null> {
    return this.ofertaservice.PostOffer(data);
  }

  @Put(':id')
  async updateOffer(
    @Param('id', ParseIntPipe) idOffer: number,
    @Body() data: UpdateOfertaDto,
  ): Promise<UpdateOfertaDto | null> {
    return this.ofertaservice.UpdateOffer(idOffer, data);
  }

  @Delete(':id')
  async deleteOffer(
    @Param('id', ParseIntPipe) idOffer: number,
  ): Promise<OfertaDto | null> {
    return this.ofertaservice.DeleteOffer(idOffer);
  }

  @Post(':id/offer-assign-to-user/:userid') // Algo así pensado hacer esto pero no se si estaría bien ;b
  async AssignOfferToUser(
    @Param('userid', ParseIntPipe) idUser: number,
    @Param('id', ParseIntPipe) idOffer,
  ): Promise<StudentOnOffers | null> {
    return this.ofertaservice.AssignOfferToUser(idUser, idOffer);
  }


  @Get('/FindUsersByOffer/:id')
  async FindUsersOfOffer(
    @Param('id', ParseIntPipe) idOffer: number,
  ): Promise<StudentProfileDto[] | null> {
    return this.ofertaservice.FindUsersOfOffer(idOffer);
  }

  @Post(':offerid/offer-assign-to-field/:fieldid')
  async AssignFieldsToOffer(
    @Param('fieldid', ParseIntPipe) idField: number,
    @Param('offerid', ParseIntPipe) idOffer,
  ): Promise<OfferOnFields> {
    return this.ofertaservice.AssignFieldToOffer(idField, idOffer);
  }

  @Get('/FindFieldsByOffer/:id')
  async FindFieldsOfOffer(
    @Param('id', ParseIntPipe) idOffer: number,
  ): Promise<Fields[] | null> {
    return this.ofertaservice.FindFieldsOfOffer(idOffer);
  }
}
