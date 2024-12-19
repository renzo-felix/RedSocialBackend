import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { HabilitiesService } from './habilities.service';
import { Fields, StudentOnField, OfferOnFields } from '@prisma/client';
import {StudentProfileDto} from "../Student/profile/student-profile.dto";
import {OfertaDto} from "../Ofertas/DTO/OfertaDto";

@Controller('field')
export class HabilitiesControler {
  constructor(private readonly HabilitiesService: HabilitiesService) {}

  @Get()
  async getAll(): Promise<Fields[]> {
    return this.HabilitiesService.GetAllHabilities();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Fields> {
    return this.HabilitiesService.GetHabilitiesById(id);
  }

  @Put(':id')
  async updateHability(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Fields>,
  ): Promise<Fields> {
    return this.HabilitiesService.PutHabilityById(id, data);
  }

  @Post()
  async postHability(@Body() data: Omit<Fields, 'id'>): Promise<Fields> {
    return this.HabilitiesService.PostHabilitie(data);
  }

  @Delete(':id')
  async deleteHability(@Param('id', ParseIntPipe) id: number) {
    return this.HabilitiesService.DeleteHabilityById(id);
  }

  @Post(':idfield/field-assign-to-user/:idstudent')
  async AssignHabilityToStudent(
    @Param('idstudent', ParseIntPipe) idStudent: number,
    @Param('idfield', ParseIntPipe) idField: number,
  ): Promise<StudentOnField> {
    return this.HabilitiesService.AssignHabilityToStudent(idStudent, idField);
  }


  @Get('/FindStudentsByHability/:id')
  async FindStudentsOfHability(
    @Param('id', ParseIntPipe) idField: number,
  ): Promise<StudentProfileDto[]> {
    return this.HabilitiesService.FindStudentsOfHability(idField);
  }

  @Post(':idfield/field-assign-to-offer/:idoffer')
  async AssignHabilityToOffer(
    @Param('idoffer', ParseIntPipe) idOffer: number,
    @Param('idfield', ParseIntPipe) idField: number,
  ): Promise<OfferOnFields> {
    return this.HabilitiesService.AssignHabilityToOffer(idOffer, idField);
  }

  @Get('/FindOffersByHability/:id')
  async FindOffersOfHability(
    @Param('id', ParseIntPipe) idField: number,
  ): Promise<OfertaDto[]> {
    return this.HabilitiesService.FindOffersOfHability(idField);
  }

}
