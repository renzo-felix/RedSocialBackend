import { Type } from 'class-transformer'


export class OfertaDto{

    id? : number;

    @Type(() => Date)
    DateLimite : Date;

    @Type(() => Date)
    DateInit? : Date;

    Vacancies : number;
    RequireHours : number;
    CompanyId : number;

}

export class OfertaSearchDto{
    id? : number;

    @Type(() => Date)
    DateLimite : Date;

    @Type(() => Date)
    DateInit? : Date;

    Vacancies : number;
    RequireHours : number;
}

export class UpdateOfertaDto{

    @Type(() => Date)
    DateInit? : Date;
    @Type(() => Date)
    DateLimite? : Date;
    Vacancies? : number;
    RequireHours? : number;

}