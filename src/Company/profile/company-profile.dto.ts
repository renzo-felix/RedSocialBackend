import { Type } from 'class-transformer';

export class CompanyProfileDto{
    Sunac?: string | null;
    Github?: string | null;
    IndustrySector?: string | null;
    imageURL?: string | null;
    PhoneNumber?: string | null;
    Description?: string | null;
    Address?: string | null;
    CompanyUserId: number;
    InfoCorta? : string | null;
    InfoLarga? : string | null;
    PortadaImg? : string | null;

    @Type(() => Number)
    Offers?: number[];
    @Type(() => Number)
    Practices?: number[];
    @Type(() => Number)
    Notifications?: number[];
    @Type(() => Number)
    Post?: number[];
    @Type(() => Number)
    Comentario?: number[];
    @Type(() => Number)
    Reaccion?: number[];
}

export class UpdateCompanyProfileDto {
  Sunac?: string | null;
  Github?: string | null;
  IndustrySector?: string | null;
  imageURL?: string | null;
  PhoneNumber?: string | null;
  Description?: string | null;
  Address?: string | null;
  InfoCorta? : string | null;
  InfoLarga? : string | null;
  PortadaImg? : string | null;
}