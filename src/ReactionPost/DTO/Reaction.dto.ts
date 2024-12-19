import {Type} from 'class-transformer'


export class ReactionDto{

    id? : number;

    @Type(() => Date)
    ReactionDate? : Date;

    TypeReaction : string;

    @Type( () => Number)
    CompanyId? : number;

    @Type(() => Number)
    StudentId? : number;

    @Type(() => Number)
    PostId : number;

}

export class ReactionSearchDtoStudent{

    id? : number;

    @Type(() => Date)
    ReactionDate? : Date;

    TypeReaction : string;

    Institute : string;
    imageURL? : string;
    UserName : string;

}

export class ReactionSearchDtoCompany{

    id? : number;

    @Type(() => Date)
    ReactionDate? : Date;

    TypeReaction : string;

    CompanyName : string;
    IndustrySector : string;
    imageURL : string;

}

export class ReactionSearchDto{

    ReactionStudent? : ReactionSearchDtoStudent;
    ReactionCompany? : ReactionSearchDtoCompany;

}

export class UpdateReactionDto{

    TypeReaction? : string;

}