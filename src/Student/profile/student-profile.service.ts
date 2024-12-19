import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Fields, PrismaClient, StudentProfile } from '@prisma/client';
import {
  StudentProfileDto,
  UpdateStudentProfileDto,
} from './student-profile.dto';
import { PracticeDTO } from '../../Practices/Dto/PracticeDto';
import { OfertaDto } from '../../Ofertas/DTO/OfertaDto';
import { NotificationDto } from '../../Notifications/DTO/notification.dto';
import { PostUserDto } from 'src/PostUser/DTO/postuser.dto';
import { ReactionDto } from 'src/ReactionPost/DTO/Reaction.dto';
import { ComentarioDto } from 'src/Comentario/DTO/comentario.dto';

@Injectable()
export class StudentProfileService {
  private prisma = new PrismaClient();

  async getAllProfiles(): Promise<StudentProfileDto[]> {
    try {
      const profiles = await this.prisma.studentProfile.findMany({
        include: {
          user: true,
        },
      });

      if (profiles.length === 0) {
        throw new HttpException(
            'No se encontraron perfiles de estudiantes.',
            HttpStatus.NOT_FOUND,
        );
      }

      const profileUserDTOs: StudentProfileDto[] = profiles.map((profile) => ({
        studentUserId: profile.studentUserId,
        PhoneNumber: profile.PhoneNumber,
        Institute: profile.Institute,
        imageURL: profile.imageURL,
        Linkedin: profile.Linkedin,
        GitHub: profile.GitHub,
        Description: profile.Description,
        Cycle: profile.Cycle,
        Career: profile.Career,
        PortadaImg : profile.PortadaImg

      }));

      return profileUserDTOs;
    } catch (error) {
      throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            response: null,
            error: 'Error al obtener los perfiles de estudiantes.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfileById(idstudentprofile: number): Promise<StudentProfileDto> {
    try {
      const profile = await this.prisma.studentProfile.findUnique({
        where: { studentUserId: idstudentprofile },
        include: {
          user: true,
        },
      });

      if (!profile) {
        throw new HttpException('Perfil no encontrado.', HttpStatus.NOT_FOUND);
      }

      const profileDTO: StudentProfileDto = {
        studentUserId: profile['studentUserId'],
        PhoneNumber: profile['PhoneNumber'],
        Institute: profile['Institute'],
        imageURL: profile['imageURL'],
        Linkedin: profile['Linkedin'],
        GitHub: profile['GitHub'],
        Description: profile['Description'],
        Cycle: profile['Cycle'],
        Career: profile['Career'],
        PortadaImg : profile['PortadaImg']
      };

      return profileDTO;
    } catch (error) {
      throw new HttpException(
          'Error al obtener el perfil del estudiante.',
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createProfile(
      profile: Omit<StudentProfileDto, 'id'>,
  ): Promise<StudentProfileDto | null> {
    try {
      const newProfile = await this.prisma.studentProfile.create({
        data: {
          PhoneNumber: profile.PhoneNumber,
          Institute: profile.Institute,
          imageURL: profile.imageURL,
          Linkedin: profile.Linkedin,
          GitHub: profile.GitHub,
          Description: profile.Description,
          Cycle: profile.Cycle,
          Career: profile.Career,
          PortadaImg : profile.PortadaImg,
          user: { connect: { id: profile.studentUserId } },
        },
      });

      const profileDTO: StudentProfileDto = {
        studentUserId: newProfile['studentUserId'],
        PhoneNumber: newProfile['PhoneNumber'],
        Institute: newProfile['Institute'],
        imageURL: newProfile['imageURL'],
        Linkedin: newProfile['Linkedin'],
        GitHub: newProfile['GitHub'],
        Description: newProfile['Description'],
        Cycle: newProfile['Cycle'],
        Career: newProfile['Career'],
        PortadaImg : newProfile['PortadaImg']
      };

      return profileDTO;
    } catch (error) {
      throw new HttpException(
          'Error al crear el perfil del estudiante.',
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfile(
      idstudentprofile: number,
      data: Partial<UpdateStudentProfileDto>,
  ): Promise<StudentProfile | null> {
    try {
      const updatedProfile = await this.prisma.studentProfile.update({
        where: { studentUserId: idstudentprofile },
        data: {
          PhoneNumber: data.PhoneNumber,
          Institute: data.Institute,
          imageURL: data.imageURL,
          Linkedin: data.Linkedin,
          GitHub: data.GitHub,
          Description: data.Description,
          Cycle: data.Cycle,
          Career: data.Career,
          PortadaImg : data.PortadaImg
        },
      });

      return updatedProfile;
    } catch (error) {
      throw new HttpException(
          'Error al actualizar el perfil del estudiante.',
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProfile(
      idstudentprofile: number,
  ): Promise<StudentProfile | null> {
    try {
      const deletedProfile = await this.prisma.studentProfile.delete({
        where: { studentUserId: idstudentprofile },
      });

      return deletedProfile;
    } catch (error) {
      throw new HttpException(
          'Error al eliminar el perfil del estudiante.',
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async FindFieldsOfStudent(studentId: number): Promise<Fields[] | null> {
    let FieldDto: Fields[];

    await this.prisma.studentOnField
        .findMany({
          where: { UserId: studentId },
          include: { Field: true },
        })
        .then((FieldsOfStudent) => {
          if (!FieldsOfStudent) {
            throw new BadRequestException(
                `No hay ninguna habilidad relacionado con el ID ${studentId} o no existe el usuario.`,
            );
          }

          FieldDto = FieldsOfStudent.map((field) => ({
            id: field['Field'].id,
            FieldName: field['Field'].FieldName,
            Description: field['Field'].Description,
          }));
        })
        .catch((err) => {
          throw err;
        });

    return FieldDto;
  }

  async FindPracticesOfStudent(
      studentId: number,
  ): Promise<PracticeDTO[] | null> {
    let etc: PracticeDTO[];

    await this.prisma.studentOnPractice
        .findMany({
          where: { UserId: studentId },
          include: { practice: true },
        })
        .then((PracticesAndStudents) => {
          if (!PracticesAndStudents) {
            throw new BadRequestException(
                `No hay ninguna practica relacionada con el ID ${studentId} o no existe el usuario.`,
            );
          }

          etc = PracticesAndStudents.map((PracticeDTO) => ({
            id: PracticeDTO['practice'].id,
            Titulo: PracticeDTO['practice'].Titulo,
            InfoLarga: PracticeDTO['practice'].InfoLarga,
            InfoCorta: PracticeDTO['practice'].InfoCorta,
            Finalized: PracticeDTO['practice'].Finalized,
            InitDate: PracticeDTO['practice'].InitDate,
            CompanyId: PracticeDTO['practice'].CompanyId,
          }));
        })
        .catch((err) => {
          throw err;
        });

    return etc;
  }

  async FindOffersOfStudent(studentId: number): Promise<OfertaDto[] | null> {
    let OfferDto: OfertaDto[];

    await this.prisma.studentOnOffers
        .findMany({
          where: { UserId: studentId },
          include: { offers: true },
        })
        .then((OffersAndStudents) => {
          if (!OffersAndStudents) {
            throw new BadRequestException(
                `No hay ninguna oferta relacionada con el ID ${studentId} o no existe el usuario.`,
            );
          }

          OfferDto = OffersAndStudents.map((OfferDto) => ({
            id: OfferDto['offers'].id,
            DateLimite: OfferDto['offers'].DateLimite,
            DateInit: OfferDto['offers'].DateInit,
            Vacancies: OfferDto['offers'].Vacancies,
            RequireHours: OfferDto['offers'].RequireHours,
            CompanyId: OfferDto['offers'].CompanyId,
          }));
        })
        .catch((err) => {
          throw err;
        });

    return OfferDto;
  }

  async FindNotificationsOfStudent(
      id: number,
  ): Promise<NotificationDto[] | null> {
    let NotiDto: NotificationDto[];

    await this.prisma.studentOnNotification
        .findMany({
          where: { StudentId: id },
          include: { Notification: true },
        })
        .then((NotificationAndStudents) => {
          if (!NotificationAndStudents) {
            throw new BadRequestException(
                `No hay ninguna notificación relacionada con el ID ${id} o no existe el usuario.`,
            );
          }

          NotiDto = NotificationAndStudents.map((Notification) => ({
            id: Notification['Notification'].id,
            Message: Notification['Notification'].Message,
            TypeNotification: Notification['Notification'].TypeNotification,
            CreateDate: Notification['Notification'].CreateDate,
            CompanyNotiId: Notification['Notification'].CompanyNotiId,
            PracticeNotiId: Notification['Notification'].PracticeNotiId,
          }));
        })
        .catch((err) => {
          throw err;
        });

    return NotiDto;
  }

  async FindPostOfStudent(studentId: number): Promise<PostUserDto[] | null> {
    let PostDto: PostUserDto[];

    await this.prisma.postUser
        .findMany({
          where: { StudentId: studentId },
          include: { Student: true },
        })
        .then((posts) => {
          if (!posts || posts.length === 0) {
            throw new BadRequestException(
                `No hay publicaciones relacionadas con el ID del estudiante ${studentId} o no existe el usuario.`,
            );
          }

          PostDto = posts.map((post) => ({
            id: post['id'],
            PublicationDate: post['PublicationDate'],
            TituloPost: post['TituloPost'],
            Descripcion: post['Description'],
            ImgPostUrl: post['ImgPostUrl'],
            CompanyId: post['CompanyId'],
            StudentId: post['StudentId'],
          }));
        })
        .catch((err) => {
          throw err;
        });

    return PostDto;
  }

  async FindCommentsOfStudent(
      studentId: number,
  ): Promise<ComentarioDto[] | null> {
    let CommentDto: ComentarioDto[];

    await this.prisma.comentario
        .findMany({
          where: { StudentId: studentId },
          include: { Student: true },
        })
        .then((comments) => {
          if (!comments || comments.length === 0) {
            throw new BadRequestException(
                `No hay comentarios relacionados con el ID del estudiante ${studentId} o no existe el usuario.`,
            );
          }

          CommentDto = comments.map((comment) => ({
            id: comment['id'],
            PublicationDate: comment['PublicationDate'],
            ComentarioUser: comment['ComentarioUser'],
            PostId: comment['PostId'],
            StudentId: comment['StudentId'],
            CompanyId: comment['CompanyId'],
          }));
        })
        .catch((err) => {
          throw err;
        });

    return CommentDto;
  }

  async FindReactionsOfStudent(
      studentId: number,
  ): Promise<ReactionDto[] | null> {
    let ReactionDto: ReactionDto[];

    await this.prisma.reaccion
        .findMany({
          where: { StudentId: studentId },
          include: { Student: true },
        })
        .then((reactions) => {
          if (!reactions || reactions.length === 0) {
            throw new BadRequestException(
                `No hay reacciones relacionadas con el ID del estudiante ${studentId} o no existe el usuario.`,
            );
          }

          ReactionDto = reactions.map((reaction) => ({
            id: reaction['id'],
            TypeReaction: reaction['TypeReaction'],
            ReactionDate: reaction['ReactionDate'],
            PostId: reaction['PostId'],
            StudentId: reaction['StudentId'],
            CompanyId: reaction['CompanyId'],
          }));
        })
        .catch((err) => {
          throw err;
        });

    return ReactionDto;
  }

  async AssignStudentToStudent(
      followerId: number,
      followeeId: number,
  ): Promise<string> {
    if (followerId === followeeId) {
      throw new BadRequestException(
          'Un estudiante no se puede seguir a si mismo.',
      );
    }

    const existingFollow = await this.prisma.follows.findUnique({
      where: {
        FollowedById_FollowingId: {
          FollowedById: followerId,
          FollowingId: followeeId,
        },
      },
    });

    if (existingFollow) {
      throw new BadRequestException('Ya sigues a este estudiante.');
    }

    await this.prisma.follows.create({
      data: {
        FollowedById: followerId,
        FollowingId: followeeId,
      },
    });

    return `El estudiante con ID ${followerId} ahora sigue al estudiante con ID ${followeeId}.`;
  }

  async NotAssignStudentToStudent(
      followerId: number,
      followeeId: number,
  ): Promise<string> {
    const existingFollow = await this.prisma.follows.findUnique({
      where: {
        FollowedById_FollowingId: {
          FollowedById: followerId,
          FollowingId: followeeId,
        },
      },
    });

    if (!existingFollow) {
      throw new BadRequestException('No sigues a este estudiante.');
    }

    await this.prisma.follows.delete({
      where: {
        FollowedById_FollowingId: {
          FollowedById: followerId,
          FollowingId: followeeId,
        },
      },
    });

    return `El estudiante con ID ${followerId} ha dejado de seguir al estudiante con ID ${followeeId}.`;
  }

  async FindFollowersByStudent( studentId: number): Promise<StudentProfileDto[]> {
    let followersDto: StudentProfileDto[];

    await this.prisma.follows.findMany({
      where: { FollowingId: studentId },
      include: {
        followedBy: {
          include: {
            user: {
              select: {
                Name: true,
                LastName: true,
              },
            },
          },
        },
      },
    }).then((FollowersAndStudents) => {

      if (!FollowersAndStudents || FollowersAndStudents.length === 0) {
        throw new BadRequestException(
            'No se encontraron seguidores para este estudiante.',
        );
      }

      followersDto = FollowersAndStudents.map((follower) => ({
        studentUserId: follower['followedBy'].studentUserId,
        Description: follower['followedBy'].Description,
        Career: follower['followedBy'].Career,
        Cycle: follower['followedBy'].Cycle,
        GitHub: follower['followedBy'].GitHub,
        Linkedin: follower['followedBy'].Linkedin,
        imageURL: follower['followedBy'].imageURL,
        Institute: follower['followedBy'].Institute,
        Name: follower['followedBy'].user.Name,
        LastName: follower['followedBy'].user.LastName,
      }));

    }).catch((err) => {
      throw err;
    });

    return followersDto;
  }

  async FindFollowsByStudent(studentId: number): Promise<StudentProfileDto[]> {
    let followsDto: StudentProfileDto[];

    await this.prisma.follows.findMany({
      where: { FollowedById: studentId },
      include: {
        following: {
          include: {
            user: {
              select: {
                Name: true,
                LastName: true,
              },
            },
          },
        },
      },
    }).then( (FollowsAndStudents) => {

      if (!FollowsAndStudents || FollowsAndStudents.length === 0) {
        throw new BadRequestException(
            'No se encontraron estudiantes seguidos por este usuario.',
        );
      }

      followsDto = FollowsAndStudents.map((follow) => ({
        studentUserId: follow['following'].studentUserId,
        Description: follow['following'].Description,
        Career: follow['following'].Career,
        Cycle: follow['following'].Cycle,
        GitHub: follow['following'].GitHub,
        Linkedin: follow['following'].Linkedin,
        imageURL: follow['following'].imageURL,
        Institute: follow['following'].Institute,
        Name: follow['following'].user.Name,
        LastName: follow['following'].user.LastName,
      }));

    }).catch((err) => {
      throw err;
    });

    return followsDto;
  }
}
