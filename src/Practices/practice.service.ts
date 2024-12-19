import {BadRequestException, HttpException, HttpStatus, Injectable,} from '@nestjs/common';

import {PracticeDTO, UpdatePracticeDTO} from './Dto/PracticeDto';
import { PrismaClient, StudentOnPractice } from '@prisma/client';
import {validateParcialPractice, validatePractice} from "./Validaciones/validatepractice";
import {HandlingErrorOfSearchById} from '../Notifications/ManejoDeErrores/Errores';
import {NotificationDto} from "../Notifications/DTO/notification.dto";
import {StudentProfileDto} from "../Student/profile/student-profile.dto";
import {ComentarioSearchDto} from "../Comentario/DTO/comentario.dto";
import {
  FindCommentsByEntity,
} from "../ModuleValidations/ComentariosMethods";
import {ReactionPuntuacionSearchDtoStudent} from "../ReaccionPuntuacion/DTO/ReactionPuntuacion.dto";

@Injectable()
export class PracticeService {
  constructor(private readonly prisma: PrismaClient) {}

  async GetAllPractices(): Promise<PracticeDTO[] | null> {
    try {
      const practicas = await this.prisma.practice.findMany();

      if(!practicas || practicas.length === 0){
        throw new HttpException("No hay practicas disponibles" , HttpStatus.NO_CONTENT)
      }


      return practicas.map((practice) => ({

        id: practice.id,
        Titulo : practice.Titulo,
        InfoLarga : practice.InfoLarga,
        InfoCorta : practice.InfoCorta,
        Finalized: practice.Finalized,
        InitDate: practice.InitDate,
        CompanyId: practice.CompanyId,

      }));

    } catch (error) {
      throw error;
    }
  }

  async GetByIdPractice(idPractice: number): Promise<PracticeDTO | null> {

    let PracticeDto : PracticeDTO;
      await this.prisma.practice.findUnique({
        where: { id: idPractice },
        include: {
          Company: true,
          Users: true,
          Notifications: true,
        },
      }).then(PracticeById => {

        if(!PracticeById){
          throw new BadRequestException(`La practica con el ID ${idPractice} no existe.`);
        }

        PracticeDto = {
          id : PracticeById.id,
          Titulo : PracticeById.Titulo,
          InfoCorta : PracticeById.InfoCorta,
          InfoLarga : PracticeById.InfoLarga,
          Finalized : PracticeById.Finalized,
          InitDate : PracticeById.InitDate,
          CompanyId : PracticeById.CompanyId
        }


      }).catch(error => {
        throw error;
      });

      return PracticeDto;

  }

  async PostPactice(
    NuevoPractice: Omit<PracticeDTO, 'id'>,
  ): Promise<PracticeDTO | null> {

    let PracticeDto : PracticeDTO;
    const validePractice = await validatePractice(NuevoPractice);

    await this.prisma.practice.create({
      data: {
        Titulo : NuevoPractice.Titulo,
        InfoCorta : NuevoPractice.InfoCorta,
        InfoLarga : NuevoPractice.InfoLarga,
        Finalized: NuevoPractice.Finalized,
        InitDate: validePractice.data.InitDate,
        CompanyId: validePractice.data.CompanyId,
      },
    }).then(PostPractice => {

      PracticeDto = {
        id : PostPractice.id,
        Titulo : PostPractice.Titulo,
        InfoCorta : PostPractice.InfoCorta,
        InfoLarga : PostPractice.InfoLarga,
        Finalized : PostPractice.Finalized,
        InitDate : PostPractice.InitDate,
        CompanyId : PostPractice.CompanyId
      }

    }).catch(() => {
      throw new BadRequestException("Los campos enviados son incorrectos.");
    });


    return PracticeDto;

  }

  async updatePractice(
    idPractice: number,
    practice: UpdatePracticeDTO,
  ): Promise<UpdatePracticeDTO | null> {

    const validatePractice = validateParcialPractice(practice);
    let UpdatePracticeDto : UpdatePracticeDTO;

    await this.prisma.practice.update({

      where: { id: idPractice },
      data: validatePractice.data,

    }).then(UpdatePractice => {

      UpdatePracticeDto = {
        Finalized : UpdatePractice.Finalized,
        InitDate : UpdatePractice.InitDate,
        Titulo : UpdatePractice.Titulo,
        InfoCorta : UpdatePractice.InfoCorta,
        InfoLarga : UpdatePractice.InfoLarga
      }


    }).catch(error => {
      HandlingErrorOfSearchById(error);
    })

    return UpdatePracticeDto;
  }

  async deletePractice(idPractice: number): Promise<PracticeDTO | null> {

    let PracticeDto : PracticeDTO;
    await this.prisma.practice.delete({
      where : {id : idPractice}
    }).then(DeletePractice => {

      PracticeDto = {
        id : DeletePractice.id,
        Titulo : DeletePractice.Titulo,
        InfoLarga : DeletePractice.InfoLarga,
        InfoCorta : DeletePractice.InfoCorta,
        InitDate : DeletePractice.InitDate,
        Finalized : DeletePractice.Finalized,
        CompanyId : DeletePractice.CompanyId
      }

    }).catch(error => {
      HandlingErrorOfSearchById(error);
    })

    return PracticeDto;

  }
  async AssignUserToPractice(
    idPractice: number,
    idStudent: number,
  ): Promise<StudentOnPractice | null> {

    try {
      return await this.prisma.studentOnPractice.create({
        data: {
          UserId: idStudent,
          PracticeId: idPractice,
        },
      });
    } catch (err) {
      throw new BadRequestException(
        'El ID del estudiante o práctica no existen.',
      );
    }

  }


  async FindUsersByPractice(
    idPractice: number,
  ): Promise<StudentProfileDto[] | null> {


    let StudentProfileDto : StudentProfileDto[] = [];
    await this.prisma.studentOnPractice.findMany({
      where: { PracticeId: idPractice },
      include: {
        users: true,
      },
    }).then(SearchPractices => {

      for(let i = 0; i < SearchPractices.length; ++i){
        const result = SearchPractices[i];

        StudentProfileDto.push({
          Institute : result["users"].Institute,
          GitHub : result["users"].GitHub,
          Linkedin : result["users"].Linkedin,
          imageURL : result["users"].imageURL,
          PhoneNumber : result["users"].PhoneNumber,
          studentUserId : result["users"].studentUserId
        })

      }

    }).catch(() => {
      throw new BadRequestException(`La practica con el ID ${idPractice} no existe.`);
    });

    return StudentProfileDto;

  }

  /*
   async  AssignNotificationToPractice(IdPractice : number,
                                      IdNotification: number
   ): Promise<Practice | null> {

      await this.prisma.notification.findUnique({
        where : {id : IdNotification}
      }).then(notification => {

        if(!notification){
          throw new BadRequestException(`La notificación con ID ${IdNotification} no existe.`)
        }
        if(notification.CompanyNotiId){
          throw new HttpException(
              "La notificación ya le pertenece a una compañía, no se puede cambiar.",
              HttpStatus.BAD_REQUEST
          );
        }
      }).catch(error => {
        throw error;
      })

      const result = await this.prisma.practice.update({
        where : {id : IdPractice},
        data : {
          Notifications : {
            connect : {id : IdNotification}
          }
        }
      })

     if(!result){
       throw new BadRequestException(`La practica con el ID ${IdPractice} no existe`);
     }

     return result;

   }

   */

   async FindNotificationsByPractice(idPractice : number) : Promise<NotificationDto[] | null>{

    let notificationDto : NotificationDto[];
      await this.prisma.practice.findUnique({
        where : {id : idPractice},
        include : {Notifications : true}
      }).then(practice => {

        notificationDto = practice["Notifications"].map(
            (notification) => ({
              id : notification.id,
              Message: notification.Message,
              TypeNotification: notification.TypeNotification,
              CreateDate: notification.CreateDate,

            }));

      }).catch(() => {
        throw new BadRequestException(`No existe la practica con ID ${idPractice}`)
      })

      return notificationDto;
   }


   async FindCommentsByPractice( idPractice : number ) : Promise<ComentarioSearchDto[] | null >{
     return FindCommentsByEntity("practice", "Comentario", idPractice);
   }

   async FindReactionsPuntuacionByPractice( idPractice : number ) : Promise<ReactionPuntuacionSearchDtoStudent[] | null>{

     let ReactionPuntuacionStudent : ReactionPuntuacionSearchDtoStudent[];

     await this.prisma.practice.findUnique({
       where : { id : idPractice },
       include : {
         ReaccionPuntuacion : {
           include : {
             Student : {
               include : { user : true }
             }
           }
         }
       }
     }).then(SearchReactionPuntuacion => {

       ReactionPuntuacionStudent = SearchReactionPuntuacion["ReaccionPuntuacion"].map((ReactionPuntuacion) =>{

         const StudentProfile = ReactionPuntuacion.Student;
         const StudentUser = ReactionPuntuacion.Student.user;


         return {

           id : ReactionPuntuacion.id,
           Institute: StudentProfile.Institute,
           imageURL: StudentProfile.imageURL,
           UserName: (StudentUser.Name + ' ' + StudentUser.LastName),
           ReaccionDate : ReactionPuntuacion.ReaccionDate,
           Puntuacion : ReactionPuntuacion.Puntuacion


         }


       })

     }).catch(() => {
       throw new BadRequestException(`La practica con el ID ${idPractice} no existe.`);
     })


     return ReactionPuntuacionStudent;

   }



}