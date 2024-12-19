import {
  Body,
  Controller,
  Delete,
  Get, Param,
  ParseIntPipe,
  Post, Put
} from '@nestjs/common';

import {PracticeDTO, UpdatePracticeDTO} from './Dto/PracticeDto';
import { PracticeService } from './practice.service';
import { StudentOnPractice } from '@prisma/client';
import {NotificationDto} from "../Notifications/DTO/notification.dto";
import {StudentProfileDto} from "../Student/profile/student-profile.dto";
import {ComentarioSearchDto} from "../Comentario/DTO/comentario.dto";
import {ReactionPuntuacionSearchDtoStudent} from "../ReaccionPuntuacion/DTO/ReactionPuntuacion.dto";
@Controller('practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Get()
  async GetAll(): Promise<PracticeDTO[] | null> {
    return this.practiceService.GetAllPractices();
  }
  @Get(':id')
  async GetById(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('id', ParseIntPipe) idPractice,
  ): Promise<PracticeDTO | null> {
    return this.practiceService.GetByIdPractice(idPractice);
  }

  @Post()
  async PostPractice(
    //para crear esto crea primero un usuario compañia luego un compai profile y recien puedes usar esto
    @Body() NuevoPractice: Omit<PracticeDTO, 'id'>, // Excluye el `id` ya que es autogenerado
  ): Promise<PracticeDTO | null> {
    return this.practiceService.PostPactice(NuevoPractice);
  }
  @Delete(':id')
  async deletePractice(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('id', ParseIntPipe) idPractice: number,
  ): Promise<PracticeDTO | null> {
    return this.practiceService.deletePractice(idPractice);
  }
  @Put(':id')
  async UpdatePractice(@Param('id', ParseIntPipe) idPractice : number
  , @Body() Practice : UpdatePracticeDTO) : Promise<UpdatePracticeDTO> | null{
    return this.practiceService.updatePractice(idPractice, Practice);
  }

  @Post(':idPractice/practice-assign-to-user/:idStudent')
  async AssignUserToPractice(
    @Param('idPractice', ParseIntPipe) idPractice: number,
    @Param('idStudent', ParseIntPipe) idStudent: number,
  ): Promise<StudentOnPractice | null> {
    return this.practiceService.AssignUserToPractice(idPractice, idStudent);
  }

  @Get('/FindUsersByPractice/:id') // id del usuario
  async FindUsersByPractice(
    @Param('id', ParseIntPipe) idPractice: number,
  ): Promise<StudentProfileDto[]> {
    return this.practiceService.FindUsersByPractice(idPractice);
  }

  /* no se usa.
  @Post(':id1/assign-to-notification/:id2') //debe estar creado un a compañia antes
  async AssignNotificationToPractice(
    @Param('id1', ParseIntPipe) IdPractice : number,
    @Param('id2', ParseIntPipe) IdNotification : number
  ): Promise<Practice | null> {
    return this.practiceService.AssignNotificationToPractice(IdPractice, IdNotification);
  }

   */

  @Get('/FindNotificationByPractice/:id')
  async FindNotificationsByPractice(
    @Param('id', ParseIntPipe) idPractice: number,
  ): Promise<NotificationDto[] | null> {
    return this.practiceService.FindNotificationsByPractice(idPractice);
  }

  @Get('/FindCommentsByPractice/:id')
  async FindCommentsByPractice(
      @Param('id', ParseIntPipe) idPractice: number,
  ): Promise<ComentarioSearchDto[] | null> {
    return this.practiceService.FindCommentsByPractice(idPractice);
  }

  @Get('/FindReactionsPuntuacionByPractice/:id')
  async FindReactionsByPractice(
      @Param('id', ParseIntPipe) idPractice : number
  ) : Promise<ReactionPuntuacionSearchDtoStudent[] | null>{
    return this.practiceService.FindReactionsPuntuacionByPractice(idPractice);
  }


}
