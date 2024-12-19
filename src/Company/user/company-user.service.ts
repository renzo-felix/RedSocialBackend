import {BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException,} from '@nestjs/common';
import {CompanyUser, PrismaClient} from '@prisma/client';
import {HandlingErrorOfSearchById} from './error-handling/company-user.error';
import {CompanyUserDto, CreateCompanyDto, UpdateCompanyDto, UpdateGeneralCompany} from './user.dto';
import {validateCompanyUser, validatePartialCompanyUser,} from './validation/company-user.validation';
import {UpdateCompanyProfileDto} from "../profile/company-profile.dto";
import {CompanyProfileService} from "../profile/company-profile.service";

@Injectable()
export class CompanyUserService {
  private prisma = new PrismaClient();

  async findOne(email: string): Promise<CompanyUser | null> {
    try {
      return await this.prisma.companyUser.findFirst({
        where: {email},
        include: { CompanyPerfil: true },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          response: null,
          error: 'Error al obtener la compania',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllCompanies(): Promise<CompanyUserDto[] | null> {
    try {
      const companies = await this.prisma.companyUser.findMany({
        include: { CompanyPerfil: true },
      });

      if (!companies || companies.length === 0) {
        throw new NotFoundException('No se tiene registrado algún usuario.');
      }

      return companies.map((company) => ({
        id: company.id,
        Username: company.Username,
        email: company.email,
        Password: company.Password,
        CompanyPerfil: company.CompanyPerfil
      }));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          response: null,
          error: 'Error al obtener los usuarios',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCompanyById(idcompanyuser: number): Promise<CompanyUserDto | null> {

      let CompanyUserDto : CompanyUserDto;
      await this.prisma.companyUser.findUnique({
        where: { id: idcompanyuser },
        include: { CompanyPerfil: true },
      }).then(company => {
        if (!company) {
          throw new NotFoundException(
              `Compañia con el ID ${idcompanyuser} no existe.`,
          );
        }
        CompanyUserDto = {
          id: company.id,
          Username: company.Username,
          email: company.email,
          Password: company.Password,
          CompanyPerfil: company.CompanyPerfil
        }
      }).catch(error => {
        if (error instanceof NotFoundException) {
          throw error;
        }

        throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              response: null,
              error: 'Error al obtener el usuario',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

      return CompanyUserDto;

  }

  async createCompany(data: CreateCompanyDto): Promise<CompanyUserDto | null> {
    const result = validateCompanyUser(data);

    let CompanyUserDto : CompanyUserDto;
    await this.prisma.companyUser.create({
      data: {
        Username: result.Username,
        Password: result.Password,
        email: result.email,
      },
    }).then(company => {

      CompanyUserDto = {
        id : company.id,
        Username : company.Username,
        email : company.email,
        Password : company.Password
      }

    }).catch( error => {
      HandlingErrorOfSearchById(error);
      throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            response: null,
            error: 'Error al crear el usuario',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    await this.prisma.companyProfile.create({
      data : {
        IndustrySector : result.IndustrySector,
        CompanyUser : {
          connect : { id : CompanyUserDto.id }
        },
        Sunac : result.Sunac
      }
    }).then(companyProfile => {

      CompanyUserDto.CompanyPerfil = companyProfile;

    }).catch(() => {
      throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            response: null,
            error: 'Error al crear el usuario',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
      )
    })

    return CompanyUserDto;
  }

  async updateCompanyUser(
    id: number,
    data: UpdateCompanyDto,
  ): Promise<UpdateCompanyDto | null> {

    const result = validatePartialCompanyUser(data);

    let UpdateCompanyDto : UpdateCompanyDto;
    await this.prisma.companyUser.update({
      where: { id },
      data: result,
    }).then(UpdateCompany => {

      UpdateCompanyDto = {
        email : UpdateCompany.email,
        Username : UpdateCompany.Username,
        Password : UpdateCompany.Password
      }

    }).catch(error => {

      HandlingErrorOfSearchById(error);
      throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            response: null,
            error: 'Error al actualizar el usuario',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
      );

    });

    return UpdateCompanyDto;

  }

  async deleteCompany(idCompanyUser: number): Promise<CompanyUserDto | null> {
    const existingUser = await this.prisma.companyUser.findUnique({
      where: { id: idCompanyUser },
    });

    if (!existingUser) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    let CompanyUserDto : CompanyUserDto;
    await this.prisma.companyUser.delete({
      where: { id: idCompanyUser },
      include : { CompanyPerfil: true }
    }).then(DeleteCompany => {

      CompanyUserDto = {
        id : DeleteCompany.id,
        Password : DeleteCompany.Password,
        Username : DeleteCompany.Username,
        email : DeleteCompany.email,
        CompanyPerfil : DeleteCompany["CompanyPerfil"]
      }

    }).catch(error => {
      HandlingErrorOfSearchById(error);
      throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            response: null,
            error: 'Error al eliminar el usuario',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
    return CompanyUserDto;
  }


  async UpdateGeneralInformationCompany( idCompany : number, UpdateCompany : UpdateGeneralCompany )  : Promise<UpdateGeneralCompany | null> {


    let UpdateGeneralCompany : UpdateGeneralCompany;

    const UpdateCompanyUser : UpdateCompanyDto = {
      Username : UpdateCompany.Username,
      Password : UpdateCompany.Password,
      email : UpdateCompany.email
    };

    const ResultUpdateCompanyUser = await this.updateCompanyUser(idCompany, UpdateCompanyUser);

    UpdateGeneralCompany = {
      Username : ResultUpdateCompanyUser.Username,
      Password : ResultUpdateCompanyUser.Password,
      email : ResultUpdateCompanyUser.email
    }


    let UpdateCompanyProfile : UpdateCompanyProfileDto;

    if(!UpdateCompany.UserProfile) UpdateCompanyProfile = {}
    else UpdateCompanyProfile = UpdateCompany.UserProfile;



      let companyProfileService: CompanyProfileService = new CompanyProfileService();

      UpdateGeneralCompany.UserProfile =
          await companyProfileService.updateProfile(idCompany, UpdateCompanyProfile);
      (companyProfileService as any) = null;




    return UpdateGeneralCompany;
  }

}
