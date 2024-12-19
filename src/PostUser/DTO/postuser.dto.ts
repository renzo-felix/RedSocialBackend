import {Type} from 'class-transformer'


export class PostUserDto{

    id? : number;

    @Type(() => Date)
    PublicationDate? : Date;

    TituloPost : string;
    Descripcion : string;
    ImgPostUrl? : string;

    CompanyId? : number;
    StudentId? : number;

}

export class UpdatePostUserDto{

    @Type(() => Date)
    PublicationDate? : Date;

    TituloPost? : string;
    Descripcion? : string;
    ImgPostUrl? : string;

}
