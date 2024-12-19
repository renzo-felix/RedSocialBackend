import { Type } from 'class-transformer'

export class NotificationDto{

    id? : number;
    Message : string;
    TypeNotification : string;
    CreateDate : Date;

    @Type( () => Number)
    Students? : number[]

    @Type( () => Number)
    CompanyNotiId?: number

    @Type(() => Number)
    PracticeNotiId?: number

}

export class SearchNotificationDto {

    id? : number;
    Message : string;
    TypeNotification : string;
    CreateDate : Date;

    @Type( () => Number)
    CompanyNotiId?: number

    @Type(() => Number)
    PracticeNotiId?: number

}

export class UpdateNotificationDto{

    Message? : string | null;
    TypeNotification? : string | null;

}