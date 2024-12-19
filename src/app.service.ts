import { Injectable } from '@nestjs/common';
import {StudentProfileController} from './Student/profile/student-profile.controller'
import {HabilitiesControler} from './Habilities/habilities.controler'
import {NotificationController} from './Notifications/notification.controller'
import {OfertaController} from './Ofertas/oferta.controller'
import {PracticeController} from './Practices/practice.controller'
import {CompanyProfileController} from './Company/profile/company-profile.controller'
import { AuthController } from './Guards/auth.controller';

@Injectable()
export class AppService {

  StudentProfile : StudentProfileController;
  Hability : HabilitiesControler;
  Notification : NotificationController;
  Oferta : OfertaController;
  Practice : PracticeController;
  CompanyProfile : CompanyProfileController;


  getHello(): string {
    return 'Hello World!';
  }
}
