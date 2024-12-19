import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentUserModule } from './Student/user/student-user.module';
import { StudentProfileModule } from './Student/profile/student-profile.module';
import { CompanyUserModule } from './Company/user/company-user.module';
import { CompanyProfileModule } from './Company/profile/company-profile.module';
import { HabilitiesModule } from './Habilities/habilities.module';
import { NotificationModule } from './Notifications/notification.module';
import { OfertaModule } from './Ofertas/oferta.module';
import { PracticeModule } from './Practices/practice.module';
import { ComentarioModule } from './Comentario/Comentario.module'
import { PostuserModule } from './PostUser/postuser.module'
import { ReactionModule } from "./ReactionPost/reaction.module";
import { ReactionpuntuacionModule } from "./ReaccionPuntuacion/reactionpuntuacion.module";
import { AuthModule } from './Guards/auth.module';

@Module({
  imports: [
    HabilitiesModule,
    NotificationModule,
    StudentUserModule,
    StudentProfileModule,
    CompanyUserModule,
    CompanyProfileModule,
    PracticeModule,
    OfertaModule,
    ComentarioModule,
    PostuserModule,
    ReactionModule,
    ReactionpuntuacionModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
