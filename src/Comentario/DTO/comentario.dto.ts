import {Type} from 'class-transformer'


export class ComentarioDto{

    id? : number;

    @Type(() => Date)
    PublicationDate? : Date;

    ComentarioUser : string;

    @Type( () => Number)
    CompanyId? : number;

    @Type(() => Number)
    StudentId? : number;

    @Type(() => Number)
    PostId? : number;

    @Type(() => Number)
    PracticeId? : number;

    @Type(() => Number)
    SobreEmpresaId? : number;

}


export class ComentarioSearchDtoStudent{

    id? : number;

    Institute : string;
    imageURL ? : string;
    UserName : string;

    @Type(() => Date)
    PublicationDate? : Date;

    ComentarioUser : string;

}

export class ComentarioSearchDtoCompany {

    id? : number;

    CompanyName : string;
    IndustrySector : string;
    imageURL : string;

    @Type(() => Date)
    PublicationDate? : Date;

    ComentarioUser : string;



}

export class ComentarioSearchDto{

    ComentarioStudent? : ComentarioSearchDtoStudent;
    ComentarioCompany? : ComentarioSearchDtoCompany;

}

export class UpdateComentarioDto{

    ComentarioUser? : string;

}