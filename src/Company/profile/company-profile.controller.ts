import { Controller, Get, Put, Param, Body, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { CompanyProfileService } from './company-profile.service';
import { CompanyProfileDto, UpdateCompanyProfileDto } from './company-profile.dto';
import {OfertaSearchDto} from "../../Ofertas/DTO/OfertaDto";
import {SearchPracticeDto} from "../../Practices/Dto/PracticeDto";
import {SearchNotificationDto} from "../../Notifications/DTO/notification.dto";
import {PostUserDto} from "../../PostUser/DTO/postuser.dto";
import {
  ComentarioDto, ComentarioSearchDto,
} from "../../Comentario/DTO/comentario.dto";
import {ReactionDto} from "../../ReactionPost/DTO/Reaction.dto";

@Controller('company-profile')
export class CompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProfiles(): Promise<CompanyProfileDto[] | null> {
    return this.companyProfileService.getAllProfiles();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProfileById(@Param('id', ParseIntPipe) id: number): Promise<CompanyProfileDto | null> {
    return this.companyProfileService.getProfileById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateCompanyProfileDto): Promise<UpdateCompanyProfileDto | null> {
    return this.companyProfileService.updateProfile(id, data);
  }

  @Get('/FindOffersByCompany/:idCompany')
  async FindOffersByUser(@Param('idCompany', ParseIntPipe) idCompany : number) : Promise<OfertaSearchDto[] | null>{
    return this.companyProfileService.FindOffersByCompany(idCompany);
  }

  @Get('/FindPracticesByCompany/:idCompany')
  async FindPracticesByCompany(@Param('idCompany', ParseIntPipe) idCompany : number) : Promise<SearchPracticeDto[] | null>{
    return this.companyProfileService.FindPracticesByCompany(idCompany);
  }

  @Get('/FindNotificationsByCompany/:idCompany')
  async FindNotificationsByCompany(@Param('idCompany', ParseIntPipe) idCompany : number) : Promise<SearchNotificationDto[] | null>{
    return this.companyProfileService.FindNotificationsByCompany(idCompany);
  }

  @Get('/FindPostUsersByCompany/:idCompany')
  async FindPostUsersByCompany(@Param('idCompany', ParseIntPipe) idCompany : number) : Promise<PostUserDto[] | null>{
    return this.companyProfileService.FindPostUsersByCompany(idCompany);
  }

  @Get('/FindCommentsByCompany/:idCompany')
  async FindCommentsByCompany(@Param('idCompany', ParseIntPipe) idCompany : number) : Promise<ComentarioDto[] | null>{
    return this.companyProfileService.FindCommentsByCompany(idCompany);
  }

  @Get('/FindReactionsByCompany/:idCompany')
  async FindReactionsByCompany(@Param('idCompany', ParseIntPipe) idCompany : number) : Promise<ReactionDto[] | null>{
    return this.companyProfileService.FindReactionsByCompany(idCompany);
  }

  @Get('/FindCommentsAboutCompany/:idCompany')
  async FindCommentsAboutCompany(@Param('idCompany', ParseIntPipe) idCompany : number) : Promise<ComentarioSearchDto[] | null>{
    return this.companyProfileService.FindCommentsAboutCompany(idCompany);
  }

}
