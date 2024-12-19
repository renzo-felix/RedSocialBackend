
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { StudentUserModule } from 'src/Student/user/student-user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { CompanyUserModule } from 'src/Company/user/company-user.module';

@Module({
  imports: [
    StudentUserModule,
    CompanyUserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
