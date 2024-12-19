
export class PracticeDTO {

  id?: number;

  Titulo : string

  InfoCorta? : string

  InfoLarga : string

  Finalized?: boolean;

  InitDate?: Date;

  CompanyId: number;

}

export class SearchPracticeDto{

  id?: number;

  Titulo : string

  InfoCorta? : string

  InfoLarga : string

  Finalized?: boolean;

  InitDate?: Date;

}

export class UpdatePracticeDTO{

  Finalized? : boolean;

  InitDate?: Date;

  Titulo? : string;

  InfoCorta? : string;

  InfoLarga? : string;

}
