import { Module } from '@nestjs/common';
import { CompanyUserService } from './company-user.service';
import { CompanyUserController } from './company-user.controller';
import { CompanyProfileService } from '../profile/company-profile.service';

@Module({
  controllers: [CompanyUserController],
  providers: [CompanyUserService, CompanyProfileService],
  exports: [CompanyUserService],
})
export class CompanyUserModule {}
