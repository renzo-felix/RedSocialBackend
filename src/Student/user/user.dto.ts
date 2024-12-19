import { Type } from 'class-transformer';
import { StudentProfileDto } from '../profile/student-profile.dto';

export class StudentUserDto {
    id?: number;
    Name: string;
    LastName: string;
    email:string;
    Password: string;
    @Type(() => StudentProfileDto)
    UserProfile?: StudentProfileDto;
}

export class CreateStudentDto {
    id?: number;
    Name: string;
    LastName: string;
    Password: string;
    email:string;
    @Type(() => StudentProfileDto)
    UserProfile?: StudentProfileDto;
}

export class UpdateStudentDto {
    Name?: string;
    LastName?: string;
    Password?: string;
    email?: string;
    @Type(() => StudentProfileDto)
    UserProfile?: StudentProfileDto;
}
