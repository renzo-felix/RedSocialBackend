import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {StudentProfileController} from "./Student/profile/student-profile.controller";
import {HabilitiesControler} from "./Habilities/habilities.controler";
import {NotificationController} from "./Notifications/notification.controller";
import {OfertaController} from "./Ofertas/oferta.controller";
import {PracticeController} from "./Practices/practice.controller";
import {CompanyProfileController} from "./Company/profile/company-profile.controller";
import { AuthController } from './Guards/auth.controller';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  getStudentProfile() : StudentProfileController{
    return this.appService.StudentProfile;
  }

  getHability() : HabilitiesControler{
    return this.appService.Hability;
  }

  getNotification() : NotificationController{
    return this.appService.Notification;
  }

  getOferta() : OfertaController{
    return this.appService.Oferta;
  }

  getPractice() : PracticeController{
    return this.appService.Practice;
  }

  getCompanyProfile() : CompanyProfileController{
    return this.appService.CompanyProfile;
  }

}
