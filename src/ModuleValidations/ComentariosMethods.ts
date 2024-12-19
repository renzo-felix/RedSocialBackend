import {ComentarioSearchDto} from "../Comentario/DTO/comentario.dto";
import {BadRequestException} from "@nestjs/common";
import {ReactionSearchDto} from "../ReactionPost/DTO/Reaction.dto";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function FindCommentsByEntity(Entity : string, ComentarioType : string, id : number, fieldName : string = "id") : Promise<ComentarioSearchDto[] | null> {

    let ComentarioDto: ComentarioSearchDto[];

    const WhereCondition = { [fieldName] : id } as any;


    await prisma[Entity].findUnique({
        where: WhereCondition,
        include: {
            [ComentarioType]: {
                include: {
                    Student: {
                        include: {user: true}
                    }
                    , Company: {
                        include: {CompanyUser: true}
                    }
                }
            }
        }
    }).then(SearchPostUser => {

        // Si tengo campos dentro de campos, si intentas acceder de forma directo no dejará
        // Pero si accedes al primer campo que estabas buscando, pues ahí si te dejará ingresar
        // a los demás.
        ComentarioDto = SearchPostUser[ComentarioType].map((comentario) => {

            if (comentario.StudentId) {

                const StudentProfile = comentario.Student;
                const StudentUser = comentario.Student.user;

                return {
                    ComentarioStudent: {
                        id: comentario.id,
                        Institute: StudentProfile.Institute,
                        imageURL: StudentProfile.imageURL,
                        UserName: (StudentUser.Name + ' ' + StudentUser.LastName),
                        PublicationDate: comentario.PublicationDate,
                        ComentarioUser: comentario.ComentarioUser
                    }
                }

            } else {
                const CompanyProfile = comentario.Company;
                const CompanyUser = comentario.Company.CompanyUser;

                return {
                    ComentarioCompany: {
                        id: comentario.id,
                        IndustrySector: CompanyProfile.IndustrySector,
                        imageURL: CompanyProfile.imageURL,
                        CompanyName: CompanyUser.Username,
                        PublicationDate: comentario.PublicationDate,
                        ComentarioUser: comentario.ComentarioUser
                    }
                }

            }

        })

    }).catch((error) => {
        throw new BadRequestException(`No existe el ${Entity} con ID ${id}`);
    })


    return ComentarioDto;
}

export async function FindReactionsByEntity(Entity : string, id : number) : Promise<ReactionSearchDto[] | null> {

    let ReactionDto: ReactionSearchDto[];

    await prisma[Entity].findUnique({
        where: {id: id},
        include: {
            Reaccion: {
                include: {
                    Student: {
                        include: {user: true}
                    }, Company: {
                        include: {CompanyUser: true}
                    }
                }
            }
        }
    }).then(SearchPostUser => {


        ReactionDto = SearchPostUser["Reaccion"].map((reaccion) => {


            if (reaccion.StudentId) {

                const StudentProfile = reaccion.Student;
                const StudentUser = reaccion.Student.user;

                return {
                    ReactionStudent: {
                        id: reaccion.id,
                        Institute: StudentProfile.Institute,
                        imageURL: StudentProfile.imageURL,
                        UserName: (StudentUser.Name + ' ' + StudentUser.LastName),
                        ReactionDate: reaccion.ReactionDate,
                        TypeReaction: reaccion.TypeReaction
                    }
                };

            } else {
                const CompanyProfile = reaccion.Company;
                const CompanyUser = reaccion.Company.CompanyUser;

                return {
                    ReactionCompany: {
                        id: reaccion.id,
                        IndustrySector: CompanyProfile.IndustrySector,
                        imageURL: CompanyProfile.imageURL,
                        CompanyName: CompanyUser.Username,
                        ReactionDate: reaccion.ReactionDate,
                        TypeReaction: reaccion.TypeReaction
                    }
                };

            }


        })

    }).catch(() => {
        throw new BadRequestException(`No existe el ${Entity} con ID ${id}`);
    })

    return ReactionDto;

}

export async function LikeAndDislikeEntity(Entity : string, id : number) : Promise<[number, number]> {

    let Likes: number = 0;
    let DisLikes: number = 0;

    await prisma[Entity].findUnique({
        where: {id: id},
        include: {Reaccion: true}
    }).then(SearchPostUser => {

        SearchPostUser["Reaccion"].map((reaccion) => {

            if (reaccion.TypeReaction == "like") ++Likes;
            else if (reaccion.TypeReaction == "dislike") ++DisLikes;

        })


    }).catch(() => {
        throw new BadRequestException(`No existe el ${Entity} con ID ${id}`)
    })

    return [Likes, DisLikes];

}