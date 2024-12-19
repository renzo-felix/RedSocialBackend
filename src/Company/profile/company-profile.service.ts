import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PrismaClient} from '@prisma/client';
import {CompanyProfileDto, UpdateCompanyProfileDto} from './company-profile.dto';
import {validateCompanyPartialProfile} from "./validation/company-profile.validation";
import {OfertaSearchDto} from "../../Ofertas/DTO/OfertaDto";
import {SearchPracticeDto} from "../../Practices/Dto/PracticeDto";
import {SearchNotificationDto} from "../../Notifications/DTO/notification.dto";
import {PostUserDto} from "../../PostUser/DTO/postuser.dto";
import {ComentarioDto, ComentarioSearchDto,} from "../../Comentario/DTO/comentario.dto";
import {ReactionDto} from "../../ReactionPost/DTO/Reaction.dto";
import {FindCommentsByEntity} from "../../ModuleValidations/ComentariosMethods";

@Injectable()
export class CompanyProfileService {
  private prisma = new PrismaClient();

  async getAllProfiles(): Promise<CompanyProfileDto[] | null> {
    try {
      const profiles = await this.prisma.companyProfile.findMany();

      if (profiles.length === 0) {
        throw new HttpException(
            'No se encontraron perfiles de empresas.',
            HttpStatus.NOT_FOUND,
        );
      }

      return profiles.map((profile) => ({
        CompanyUserId: profile.CompanyUserId,
        Sunac: profile.Sunac,
        GitHub: profile.GitHub,
        IndustrySector: profile.IndustrySector,
        imageURL: profile.imageURL,
        PhoneNumber: profile.PhoneNumber,
        Address: profile.Address,
        InfoCorta: profile.InfoCorta,
        InfoLarga: profile.InfoLarga,
        PortadaImg: profile.PortadaImg
      }));
    } catch (error) {
      throw new HttpException(
          'Error al obtener los perfiles de empresas.',
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfileById(idcompanyprofile: number): Promise<CompanyProfileDto | null> {

    let profileDTO: CompanyProfileDto;

    await this.prisma.companyProfile.findUnique({
      where: {CompanyUserId: idcompanyprofile},
    }).then(profile => {

      if (!profile) {
        throw new HttpException('Perfil no encontrado.', HttpStatus.NOT_FOUND);
      }

      profileDTO = {
        CompanyUserId: profile.CompanyUserId,
        Sunac: profile.Sunac,
        Github: profile.GitHub,
        IndustrySector: profile.IndustrySector,
        imageURL: profile.imageURL,
        PhoneNumber: profile.PhoneNumber,
        Address: profile.Address,
        Description: profile.Description,
        InfoCorta : profile.InfoCorta,
        InfoLarga : profile.InfoLarga,
        PortadaImg : profile.PortadaImg
      };


    }).catch(() => {
      throw new HttpException(
          'Error al obtener el perfil de la empresa.',
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });


    return profileDTO;

  }

  /* En si no debería existir un createprofile, porque se crea automaticamente uno cuando se crea un user.
    async createProfile( profile: Omit<CompanyProfileDto, 'id'>, ): Promise<CompanyProfileDto | null> {
      try {
        const newProfile = await this.prisma.companyProfile.create({
          data: {
            Sunac: profile.Sunac,
            GitHub: profile.Github,
            IndustrySector: profile.IndustrySector,
            imageURL: profile.imageURL,
            PhoneNumber: profile.PhoneNumber,
            Address: profile["Address"],
            CompanyUser: { connect: { id: profile.CompanyUserId } },
          },
        });

        const profileDTO: CompanyProfileDto = {
          CompanyUserId: newProfile["CompanyUserId"],
          Sunac: newProfile["Sunac"],
          Github: newProfile["GitHub"],
          IndustrySector: newProfile["IndustrySector"],
          imageURL: newProfile["imageURL"],
          PhoneNumber: newProfile["PhoneNumber"],
          Address: newProfile["Address"],
        };

        return profileDTO;
      } catch (error) {
        throw new HttpException(
          'Error al crear el perfil de la empresa.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  */
  async updateProfile(idcompanyprofile: number, data: UpdateCompanyProfileDto): Promise<UpdateCompanyProfileDto | null> {

    const result = validateCompanyPartialProfile(data);
    let UpdateProfileCompany: UpdateCompanyProfileDto;

    await this.prisma.companyProfile.update({
      where: {CompanyUserId: idcompanyprofile},
      data: result,
    }).then(updateProfile => {

      UpdateProfileCompany = {
        Sunac: updateProfile.Sunac,
        Github: updateProfile.GitHub,
        IndustrySector: updateProfile.IndustrySector,
        imageURL: updateProfile.imageURL,
        PhoneNumber: updateProfile.PhoneNumber,
        Description: updateProfile.Description,
        Address: updateProfile.Address,
        InfoCorta : updateProfile.InfoCorta,
        InfoLarga : updateProfile.InfoLarga,
        PortadaImg : updateProfile.PortadaImg
      }

    }).catch(() => {
      throw new HttpException(
          'Error al actualizar el perfil de la empresa.',
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    return UpdateProfileCompany;
  }

  /* Lo configure para que si en caso borro un usuario borre con todo y profile.
  async deleteProfile(idcompanyprofile: number): Promise<CompanyProfile | null> {
    try {
      const deletedProfile = await this.prisma.companyProfile.delete({
        where: { CompanyUserId: idcompanyprofile },
      });

      return deletedProfile;
    } catch (error) {
      throw new HttpException(
        'Error al eliminar el perfil de la empresa.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  } */


  async FindOffersByCompany(idCompany: number): Promise<OfertaSearchDto[] | null> {

    let OfertasByCompany: OfertaSearchDto[];


    await this.prisma.companyProfile.findUnique({
      where: {CompanyUserId: idCompany},
      include: {Offers: true}
    }).then(Company => {


      OfertasByCompany = Company["Offers"].map((oferta) => ({
        id: oferta.id,
        DateLimite: oferta.DateLimite,
        DateInit: oferta.DateInit,
        Vacancies: oferta.Vacancies,
        RequireHours: oferta.RequireHours,
      }))

    }).catch(() => {
      throw new BadRequestException(`No existe la compañia con el id: ${idCompany}.`)
    })

    return OfertasByCompany;

  }

  async FindPracticesByCompany(idCompany: number): Promise<SearchPracticeDto[] | null> {
    let PracticesByCompany: SearchPracticeDto[];


    await this.prisma.companyProfile.findUnique({
      where: {CompanyUserId: idCompany},
      include: {Practices: true}
    }).then(Company => {


      PracticesByCompany = Company["Practices"].map((practice) => ({
        id: practice.id,
        Titulo: practice.Titulo,
        InfoCorta: practice.InfoCorta,
        InfoLarga: practice.InfoLarga,
        Finalized: practice.Finalized,
        InitDate: practice.InitDate,
      }))

    }).catch(() => {
      throw new BadRequestException(`No existe la compañia con el id: ${idCompany}.`)
    })

    return PracticesByCompany;

  }

  async FindNotificationsByCompany(idCompany: number): Promise<SearchNotificationDto[] | null> {

    let PracticesByCompany: SearchNotificationDto[];


    await this.prisma.companyProfile.findUnique({
      where: {CompanyUserId: idCompany},
      include: {Notifications: true}
    }).then(Company => {


      PracticesByCompany = Company["Notifications"].map((notification) => {

        if (notification.CompanyNotiId) {
          return {
            id: notification.id,
            Message: notification.Message,
            TypeNotification: notification.TypeNotification,
            CreateDate: notification.CreateDate,
            CompanyNotiId: notification.CompanyNotiId,
          }
        }


      })

    }).catch(() => {
      throw new BadRequestException(`No existe la compañia con el id: ${idCompany}.`)
    })

    return PracticesByCompany;

  }

  async FindPostUsersByCompany(idCompany: number): Promise<PostUserDto[] | null> {

    let PostUsersDto: PostUserDto[];

    await this.prisma.companyProfile.findUnique({
      where: {CompanyUserId: idCompany},
      include: {Post: true}
    }).then(Company => {

      PostUsersDto = Company["Post"].map((post) => {

        if (post.CompanyId) {
          return {
            id: post.id,
            PublicationDate: post.PublicationDate,
            TituloPost: post.TituloPost,
            Descripcion: post.Descripcion,
            ImgPostUrl: post.ImgPostUrl,
          }
        }

      })

    }).catch(() => {
      throw new BadRequestException(`No existe la compañia con el id: ${idCompany}.`)
    })


    return PostUsersDto;

  }

  async FindCommentsByCompany(idCompany: number): Promise<ComentarioDto[] | null> {

    let ComentarioCompanyDto: ComentarioDto[];

    await this.prisma.companyProfile.findUnique({
      where: {CompanyUserId: idCompany},
      include: {Comentario: true}
    }).then(Company => {

      ComentarioCompanyDto = Company["Comentario"].map((comentario) => {

        if ( comentario.CompanyId ) {

          let ComentarioDto : ComentarioDto = {
            id: comentario.id,
            ComentarioUser: comentario.ComentarioUser,
            PublicationDate: comentario.PublicationDate
          }

          if( comentario.PostId ) ComentarioDto.PostId = comentario.PostId
          else if( comentario.PracticeId) ComentarioDto.PracticeId = comentario.PracticeId
          else ComentarioDto.SobreEmpresaId = comentario.SobreEmpresaId

          return ComentarioDto;
        }

      })

    }).catch(() => {
      throw new BadRequestException(`No existe la compañia con el id: ${idCompany}.`)
    })

    return ComentarioCompanyDto;

  }

  async FindReactionsByCompany(idCompany : number) : Promise<ReactionDto[] | null>{

    let ReactionCompanyDto: ReactionDto[];

    await this.prisma.companyProfile.findUnique({
      where: {CompanyUserId: idCompany},
      include: {Reaccion: true}
    }).then(Company => {

      ReactionCompanyDto = Company["Reaccion"].map((reaccion) => {

        if ( reaccion.CompanyId ) {
          return {
            id: reaccion.id,
            ReactionDate: reaccion.ReactionDate,
            TypeReaction: reaccion.TypeReaction,
            PostId : reaccion.PostId
          }
        }

      })

    }).catch(() => {
      throw new BadRequestException(`No existe la compañia con el id: ${idCompany}.`)
    })

    return ReactionCompanyDto;

  }

  async FindCommentsAboutCompany(idCompany : number) : Promise<ComentarioSearchDto[] | null>{
    return FindCommentsByEntity("companyProfile", "ComentariosRecibidos", idCompany, "CompanyUserId");
  }

}