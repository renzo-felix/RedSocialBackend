import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {CompanyUserDto, CreateCompanyDto, UpdateCompanyDto, UpdateGeneralCompany} from './user.dto';
import { CompanyUserService } from './company-user.service';

@Controller('company-user')
export class CompanyUserController {
  constructor(
    private readonly companyUserService: CompanyUserService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllCompanies(): Promise<CompanyUserDto[] | null> {
    return this.companyUserService.getAllCompanies();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getCompanyById(@Param('id', ParseIntPipe) id): Promise<CompanyUserDto | null> {
    return this.companyUserService.getCompanyById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCompany(@Body() data: CreateCompanyDto): Promise<CompanyUserDto | null> {
    return this.companyUserService.createCompany(data);
  }

  @Put(':id')
  async updateCompanyUser( @Param('id', ParseIntPipe) idCompanyUser: number, @Body() data: UpdateCompanyDto, ): Promise<UpdateCompanyDto | null> {
    return this.companyUserService.updateCompanyUser(idCompanyUser, data);
  }

  @Delete(':id')
  async deleteCompany( @Param('id', ParseIntPipe) id: number):  Promise<CompanyUserDto | null> {
    return await this.companyUserService.deleteCompany(id);
  }

  @Put('/UpdateGeneralInformationCompany/:idCompany')
  async  UpdateGeneralInformationCompany(@Param('idCompany', ParseIntPipe) idCompany : number,
  @Body() UpdateCompany : UpdateGeneralCompany ) : Promise<UpdateGeneralCompany | null>{
    return this.companyUserService.UpdateGeneralInformationCompany(idCompany, UpdateCompany);
  }

}
