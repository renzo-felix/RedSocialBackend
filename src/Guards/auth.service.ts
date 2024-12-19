
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StudentUserService } from 'src/Student/user/student-user.service';
import { JwtService } from '@nestjs/jwt';
import { CompanyUserService } from 'src/Company/user/company-user.service';

@Injectable()
export class AuthService {
  constructor(
    private studentUserService: StudentUserService,
    private companyUserService: CompanyUserService,
    private jwtService: JwtService
  ) { }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string, type: string, data: any }> {
    const user = await this.studentUserService.findOne(email);
    if (user) {
      if (user?.Password !== password) {
        throw new UnauthorizedException();
      } else {
        const payload = { userId: user.id, type: 'student' };
        return {
          access_token: await this.jwtService.signAsync(payload),
          type: 'student',
          data: {
            id: user.id,
            Name: user.Name,
            LastName: user.LastName,
            email: user.email,
            UserProfile: user["UserProfile"]
          }
        };
      }
    } else {
      const company = await this.companyUserService.findOne(email);
      if (company?.Password !== password) {
        throw new UnauthorizedException();
      } else {
        const payload = { userId: company.id, type: 'company' };
        return {
          access_token: await this.jwtService.signAsync(payload),
          type: 'company',
          data: {
            id: company.id,
            Username: company.Username,
            email: company.email,
            CompanyProfile: company["CompanyPerfil"]
          }
        };
      }
    }

  }
}
