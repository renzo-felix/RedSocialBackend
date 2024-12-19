import { Module } from '@nestjs/common';
import { StudentProfileController } from './student-profile.controller';
import { StudentProfileService } from './student-profile.service';
import { StudentUserModule } from '../user/student-user.module';

@Module({
  imports: [StudentUserModule],
  controllers: [StudentProfileController],
  providers: [StudentProfileService],
})
export class StudentProfileModule {}
