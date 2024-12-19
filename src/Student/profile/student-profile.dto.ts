import { Type } from 'class-transformer';

export class StudentProfileDto {
  Institute?: string | null;
  GitHub?: string | null;
  Linkedin?: string | null;
  imageURL?: string | null;
  PhoneNumber?: string | null;
  Description?: string | null;
  Cycle?: number | null;
  Career?: string | null;
  studentUserId: number;
  PortadaImg? : string | null;

  @Type(() => Number)
  Habilities?: number[];

  @Type(() => Number)
  Offers?: [];
  @Type(() => Number)
  Practices?: [];

  @Type(() => Number)
  Projects?: number[];

  @Type(() => Number)
  Notifications?: [];

  @Type(() => Number)
  FollowedBy?: number[];
  @Type(() => Number)
  Following?: number[];
}

export class UpdateStudentProfileDto {
  Institute?: string | null;
  GitHub?: string | null;
  Linkedin?: string | null;
  imageURL?: string | null;
  PhoneNumber?: string | null;
  Cycle?: number | null;
  Career?: string | null;
  Description?: string | null;
  PortadaImg? : string | null;
}
