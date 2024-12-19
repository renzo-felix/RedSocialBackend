import {
  Get,
  Post,
  Put,
  Delete,
  Controller,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  StudentOnNotification,
} from '@prisma/client';
import { NotificationDto, UpdateNotificationDto } from './DTO/notification.dto'
import {CompanyProfileDto} from "../Company/profile/company-profile.dto";
import {PracticeDTO} from "../Practices/Dto/PracticeDto";

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getAll(): Promise<NotificationDto[] | null> {
    return this.notificationService.GetAllNotifications();
  }

  @Get(':id')
  async getId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificationDto | null> {
    return this.notificationService.GetIdNotification(id);
  }

  @Put(':id')
  async updateNotification(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateNotificationDto,
    ): Promise<UpdateNotificationDto | null> {
    return this.notificationService.UpdateNotification(id, data);
  }

  @Post()
  async postNotification(
    @Body() data: Omit<NotificationDto, 'id'>,
  ): Promise<NotificationDto | null> {
    return this.notificationService.PostNotification(data);
  }

  @Delete(':id')
  async deleteNotification(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificationDto | null> {
    return this.notificationService.DeleteNotificationById(id);
  }

  @Post(':id1/notification-assign-to-student/:id2')
  async AssingNotificationToStudent(
    @Param('id1', ParseIntPipe) idNotification: number,
    @Param('id2', ParseIntPipe) idStudent,
  ): Promise<StudentOnNotification | null> {
    return this.notificationService.AssingNotificationToStudent(
      idNotification,
      idStudent,
    );
  }

  @Get("/FindstudentByNotification/:id")
  async FindStudentsOfNotification(
    @Param('id', ParseIntPipe) idNotification: number,
  ): Promise<StudentOnNotification[] | null> {
    return this.notificationService.FindStudentsOfNotification(idNotification);
  }

  @Get("/FindNotificationByStudent/:id")
  async FindNotificationToStudent(
    @Param('id', ParseIntPipe) idStudent: number,
  ): Promise<NotificationDto[] | null> {
    return this.notificationService.FindNotificationsToStudent(idStudent);
  }

  @Get("/FindCompanyByNotification/:id")
  async FindCompanyByNotification(
    @Param('id', ParseIntPipe) idNotification: number,
  ): Promise<CompanyProfileDto | null> {
    return this.notificationService.FindCompanyByNotification(idNotification);
  }

  @Get("/FindPracticeByNotification/:id")
  async FindPracticeOfNotification(
    @Param('id', ParseIntPipe) idNotification: number,
  ): Promise<PracticeDTO | null> {
    return this.notificationService.FindPracticeOfNotification(idNotification);
  }
}
