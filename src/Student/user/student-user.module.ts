import { Module } from '@nestjs/common';
import { StudentUserController } from './student-user.controller';
import { StudentUserService } from './student-user.service';
import { StudentProfileService } from '../profile/student-profile.service';

@Module({
  controllers: [StudentUserController],
  providers: [StudentUserService, StudentProfileService],
  exports: [StudentUserService],
})
export class StudentUserModule {}
