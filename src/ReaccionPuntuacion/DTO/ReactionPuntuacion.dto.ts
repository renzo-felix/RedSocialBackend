import {Type} from 'class-transformer'


export class ReactionPuntuacionDto{

    id? : number;

    @Type(() => Date)
    ReaccionDate? : Date;

    Puntuacion : number;

    @Type(() => Number)
    StudentId : number;

    @Type(() => Number)
    PracticeId : number;

    //@Type(() => Number)
    //ComentarioId : number;

}

export class ReactionPuntuacionSearchDtoStudent{

    id? : number;

    @Type(() => Date)
    ReaccionDate? : Date;

    Puntuacion : number;

    Institute : string;
    imageURL? : string;
    UserName : string;

}

export class UpdateReactioPuntuacionDto{

    Puntuacion? : number;

}
