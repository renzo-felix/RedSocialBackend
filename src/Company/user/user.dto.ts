import { Type } from 'class-transformer';
import {CompanyProfileDto, UpdateCompanyProfileDto} from '../profile/company-profile.dto';

export class CompanyUserDto {
  id?: number;
  Username: string;
  email: string;
  Password: string;
  @Type(() => CompanyProfileDto)
  CompanyPerfil?: CompanyProfileDto;
}

export class CreateCompanyDto {
  id?: number;
  Username: string;
  Password: string;
  email: string;
  Sunac : string;
  IndustrySector : string;
  @Type(() => CompanyProfileDto)
  CompanyPerfil?: CompanyProfileDto;
}

export class UpdateCompanyDto {

  Username?: string;
  Password?: string;
  email?: string;

}

export class UpdateGeneralCompany{

  Username?: string;
  Password?: string;
  email?: string;
  UserProfile? : UpdateCompanyProfileDto;

}