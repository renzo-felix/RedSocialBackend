import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StudentProfileService } from './student-profile.service';
import { StudentProfileDto, UpdateStudentProfileDto } from './student-profile.dto';
import {
  Fields,
} from '@prisma/client';
import { PracticeDTO } from 'src/Practices/Dto/PracticeDto';
import { OfertaDto } from '../../Ofertas/DTO/OfertaDto';
import { NotificationDto } from '../../Notifications/DTO/notification.dto';
import { ComentarioDto } from '../../Comentario/DTO/comentario.dto';
import { ReactionDto } from '../../ReactionPost/DTO/Reaction.dto';

@Controller('student-profile')
export class StudentProfileController {
  constructor(private readonly studentProfileService: StudentProfileService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProfiles(): Promise<StudentProfileDto[] | null> {
    return this.studentProfileService.getAllProfiles();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProfileById( @Param('id', ParseIntPipe) id: number, ): Promise<StudentProfileDto> {
    return this.studentProfileService.getProfileById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
      @Body() data: Omit<StudentProfileDto, 'id'> & { studentUserId: number },
  ): Promise<StudentProfileDto> {
    return this.studentProfileService.createProfile(data);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateProfile( @Param('id', ParseIntPipe) id: number, @Body() data: Partial<UpdateStudentProfileDto>,): Promise<StudentProfileDto | null> {
    return this.studentProfileService.updateProfile(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async dile( @Param('id', ParseIntPipe) id: number, ): Promise<void> {
    await this.studentProfileService.deleteProfile(id);
  }

  @Get('/FindHabilitiesByStudent/:id')
  @HttpCode(HttpStatus.OK)
  async getStudentHabilities(@Param('id', ParseIntPipe) id: number): Promise<Fields[] | null> {
    return this.studentProfileService.FindFieldsOfStudent(id);
  }

  @Get('/FindPracticesByStudent/:id')
  @HttpCode(HttpStatus.OK)
  async getStudentPractices(@Param('id', ParseIntPipe) id: number): Promise<PracticeDTO[] | null> {
    return this.studentProfileService.FindPracticesOfStudent(id);
  }

  @Get('/FindOffersByStudent/:id')
  @HttpCode(HttpStatus.OK)
  async getStudentOffers(@Param('id', ParseIntPipe) id: number): Promise<OfertaDto[] | null> {
    return this.studentProfileService.FindOffersOfStudent(id);
  }

  @Get('/FindNotificationsByStudent/:id')
  @HttpCode(HttpStatus.OK)
  async getStudentNotifications(@Param('id', ParseIntPipe) id: number): Promise<NotificationDto[] | null> {
    return this.studentProfileService.FindNotificationsOfStudent(id);
  }

  @Get('/FindOffersByStudent/:id')
  @HttpCode(HttpStatus.OK)
  async getStudentPosts(@Param('id', ParseIntPipe) id: number): Promise<OfertaDto[] | null> {
    return this.studentProfileService.FindOffersOfStudent(id);
  }

  @Get('/FindCommentsByStudent/:id')
  @HttpCode(HttpStatus.OK)
  async getStudentComments(@Param('id', ParseIntPipe) id: number): Promise<ComentarioDto[] | null> {
    return this.studentProfileService.FindCommentsOfStudent(id);
  }

  @Get('/FindReactionsByStudent/:id')
  @HttpCode(HttpStatus.OK)
  async getStudentReactions(@Param('id', ParseIntPipe) id: number): Promise<ReactionDto[] | null> {
    return this.studentProfileService.FindReactionsOfStudent(id);
  }

  @Post(':id/follow-user/:userid')
  @HttpCode(HttpStatus.CREATED)
  async followStudent( @Param('id', ParseIntPipe) followedById: number,  @Param('userid', ParseIntPipe) followingId: number,): Promise<string> {
    return this.studentProfileService.AssignStudentToStudent(followedById, followingId);
  }

  @Delete(':id/unfollow-user/:userid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollowStudent( @Param('id', ParseIntPipe) followedById: number, @Param('userid', ParseIntPipe) followingId: number,): Promise<string> {
    return this.studentProfileService.NotAssignStudentToStudent(followedById, followingId);
  }

  @Get('/followers/:id')
  @HttpCode(HttpStatus.OK)
  async getFollowers(@Param('id', ParseIntPipe) id: number,): Promise<StudentProfileDto[] |  null> {
    return this.studentProfileService.FindFollowersByStudent(id);
  }

  @Get('/follows/:id')
  @HttpCode(HttpStatus.OK)
  async getFollows( @Param('id', ParseIntPipe) id: number,): Promise<StudentProfileDto[] | null> {
    return this.studentProfileService.FindFollowsByStudent(id);
  }
}
