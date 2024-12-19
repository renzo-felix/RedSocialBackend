import {BadRequestException, HttpException, HttpStatus, Injectable,} from '@nestjs/common';
import {PrismaClient, StudentOnNotification,} from '@prisma/client';
import {validateNotification, validatePartialNotification,} from './Validaciones/NotificationValidations';
import {HandlingErrorOfSearchById} from './ManejoDeErrores/Errores';
import {NotificationDto, UpdateNotificationDto} from './DTO/notification.dto'
import {CompanyProfileDto} from "../Company/profile/company-profile.dto";
import {PracticeDTO} from "../Practices/Dto/PracticeDto";

@Injectable()
export class NotificationService {
  private prisma = new PrismaClient();

  async GetAllNotifications(): Promise<NotificationDto[] | null> {

    try{
      const notifications = await this.prisma.notification.findMany();

      if (!notifications || notifications.length === 0) {
        throw new HttpException(
            'No hay notificaciones disponibles',
            HttpStatus.NO_CONTENT,
        );
      }

      return notifications.map((notification) => {

        if (notification.PracticeNotiId) {
          return {
            // en cada iteración del map, se tiene que retornar si se quiere poner sintaxis.
            id: notification.id,
            Message: notification.Message,
            TypeNotification: notification.TypeNotification,
            CreateDate: notification.CreateDate,
            PracticeNotiId: notification.PracticeNotiId
          };
        } else {
          return {
            id: notification.id,
            Message: notification.Message,
            TypeNotification: notification.TypeNotification,
            CreateDate: notification.CreateDate,
            CompanyNotiId: notification.CompanyNotiId
          };
        }

      });
    }
    catch (error){
      throw error;
    }

  }

  async GetIdNotification(
    idNotification: number,
  ): Promise<NotificationDto | null> {

      let NotiDto : NotificationDto;
      await this.prisma.notification.findUnique({
        where: { id: idNotification },
        include: {
          Students: true,
          CompanyNoti: true,
          PracticeNoti: true,
        },
      }).then(NotificationById => {

        if(!NotificationById){
          throw new BadRequestException(
              `La notificación con el ID ${idNotification} no existe.`,
          );
        }


         NotiDto = {
          id : NotificationById.id,
          Message : NotificationById.Message,
          TypeNotification : NotificationById.TypeNotification,
          CreateDate : NotificationById.CreateDate
        }

        if (NotificationById.CompanyNotiId) NotiDto.CompanyNotiId = NotificationById.CompanyNotiId
        else NotiDto.PracticeNotiId = NotificationById.PracticeNotiId


      }).catch(error => {
        throw error
      });

      return NotiDto;

  }

  async UpdateNotification(
    id: number,
    data: UpdateNotificationDto,
  ): Promise<UpdateNotificationDto | null> {


    const ValidateNotification = await validatePartialNotification(data);
    let UpdateNotiDto : UpdateNotificationDto;

    await this.prisma.notification.update({
      where: { id: id },
      data: ValidateNotification.data
    }).then(UpdateNotification => {

      UpdateNotiDto = {
        Message : UpdateNotification.Message,
        TypeNotification : UpdateNotification.TypeNotification
      }

    }).catch(error => {
      HandlingErrorOfSearchById(error);
      return null;
    });

    return UpdateNotiDto;

  }

  async DeleteNotificationById(id: number): Promise<NotificationDto | null> {

      let NotiDTO : NotificationDto;


      await this.prisma.notification.delete({
        where: { id: id },
      }).then(deleteNotification => {

        NotiDTO = {
          id : deleteNotification.id,
          Message: deleteNotification.Message,
          TypeNotification: deleteNotification.TypeNotification,
          CreateDate: deleteNotification.CreateDate
        };

        if (deleteNotification.CompanyNotiId) NotiDTO.CompanyNotiId = deleteNotification.CompanyNotiId
        if (deleteNotification.PracticeNotiId) NotiDTO.PracticeNotiId = deleteNotification.PracticeNotiId


      }).catch(error => {
        HandlingErrorOfSearchById(error);
      })

    return NotiDTO;
  }

  async PostNotification(
    data: Omit<NotificationDto, 'id'>,
  ): Promise<NotificationDto | null> {

    const result = await validateNotification(data);

    let NotiDTO : NotificationDto;

    await this.prisma.notification.create({
      data: {
        Message: result.data.Message,
        TypeNotification: result.data.TypeNotification,
        CreateDate: result.data.CreateDate,
        CompanyNotiId: result.data.CompanyNotiId, // si alguna de las 2 no está, se pondrá como undefined.
        PracticeNotiId: result.data.PracticeNotiId
      }

    }).then(CreateNoti => {

       NotiDTO = {
        Message : CreateNoti.Message,
        TypeNotification : CreateNoti.TypeNotification,
        CreateDate : CreateNoti.CreateDate
      }

      if (CreateNoti.CompanyNotiId) NotiDTO.CompanyNotiId = CreateNoti.CompanyNotiId
      else NotiDTO.PracticeNotiId = CreateNoti.PracticeNotiId

    }).catch(() => {

      throw new BadRequestException("Los campos enviados son incorrectos.");

    });

    return NotiDTO;


  }

  async AssingNotificationToStudent(
    idNotification: number,
    idStudent: number,
  ): Promise<StudentOnNotification | null> {
    try {
      return await this.prisma.studentOnNotification.create({
        data: {
          NotificationId: idNotification,
          StudentId: idStudent,
        },
      });
    } catch (error) {
      HandlingErrorOfSearchById(error);
      return null;
    }
  }

  /* Este método debe ir en el service de students.*/
  async FindStudentsOfNotification(
    idNotification: number,
  ): Promise<StudentOnNotification[] | null> {
    const result = await this.prisma.studentOnNotification.findMany({
      where: { NotificationId: idNotification },
      include: {
        Student: true,
      },
    });

    if (!result || result.length === 0) {
      console.log(
        `A ningun usuario le ha llegado la notificación de Id: ${idNotification}.`,
      );
      return null;
    }


    return result;
  }

  async FindNotificationsToStudent(
    idStudent: number,
  ): Promise<NotificationDto[] | null> {

    const result = await this.prisma.studentOnNotification.findMany({
      where: { StudentId: idStudent },
      include: { Notification: true },
    });

    if (!result || result.length === 0) {
      console.log(
        `No se ha registrado ninguna notificación al estudiante de ID: ${idStudent}.`,
      );
    }

    return await Promise.all(result.map(async (notification) => {
      return await this.GetIdNotification(notification.NotificationId);
    }));
  }

  async FindCompanyByNotification(
    idNotification: number,
  ): Promise<CompanyProfileDto | null> {

    let idCompany : number;
    await this.prisma.notification.findUnique({
      where : {id : idNotification}
    }).then(notification => {

      if(!notification.CompanyNotiId){
        `La notificación ${idNotification} no le pertenece
       a una compañia, es una notificación de la practica con ID ${notification.PracticeNotiId}`
      }
      else idCompany = notification.CompanyNotiId;

    }).catch(error => {
      HandlingErrorOfSearchById(error);
    })

    let CompanyDto : CompanyProfileDto;
    await this.prisma.companyProfile.findUnique({
      where : {CompanyUserId : idCompany}
    }).then(company => {

      CompanyDto = {
        Sunac : company.Sunac,
        Github : company.GitHub,
        IndustrySector : company.IndustrySector,
        imageURL : company.imageURL,
        PhoneNumber : company.PhoneNumber,
        CompanyUserId : company.CompanyUserId
      }

    }).catch(error => {
      HandlingErrorOfSearchById(error);
    })

    return CompanyDto;

  }

  async FindPracticeOfNotification(
      idNotification: number,
  ): Promise<PracticeDTO | null> {

    let idPractice : number;
    await this.prisma.notification.findUnique({
      where: { id: idNotification },
      include: {
        PracticeNoti: true,
      },
    }).then(notification => {

      if(!notification.PracticeNotiId){
        throw new BadRequestException(`La notificación de ID ${idNotification} no le pertenece a alguna practica.`);
      }

      idPractice = notification.PracticeNotiId;

    }).catch(error => {
      throw error
    })

    let PracticeDto : PracticeDTO;
    await this.prisma.practice.findUnique({
      where : {id : idPractice}
    }).then(Practice => {

      PracticeDto = {
        id : Practice.id,
        Titulo : Practice.Titulo,
        InfoCorta : Practice.InfoCorta,
        InfoLarga : Practice.InfoLarga,
        CompanyId : Practice.CompanyId,
        InitDate : Practice.InitDate,
        Finalized : Practice.Finalized
      }

    }).catch(err => {
      HandlingErrorOfSearchById(err);
    })

    return PracticeDto;

  }
}