import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { PrismaClient, StudentUser } from '@prisma/client';
import { StudentUserDto, UpdateStudentDto, CreateStudentDto } from './user.dto';
import { validateStudentUser, validatePartialStudentUser,} from './validation/student-user.validation';
import { HandlingErrorOfSearchById } from './error-handling/student-user.error';

@Injectable()
export class StudentUserService {
  private prisma = new PrismaClient();

  async findOne(email: string): Promise<StudentUser | null> {
    try {
      const user = await this.prisma.studentUser.findFirst({
        where: { email },
        include: { UserProfile: true },
      });

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          response: null,
          error: 'Error al obtener el usuario'+ error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllStudents(): Promise<StudentUserDto[] | null> {
    try {
      const students = await this.prisma.studentUser.findMany({
        include: { UserProfile: true },
      });

      if (!students || students.length === 0) {
        throw new NotFoundException('No se tiene registrado algún usuario.');
      }

      const studentUserDTOs: StudentUserDto[] = students.map((student) => ({
        id: student.id,
        Name: student.Name,
        LastName: student.LastName,
        email: student.email,
        Password: student.Password,
        UserProfile: student["UserProfile"],
      }));

      return studentUserDTOs;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          response: null,
          error: 'Error al obtener los usuarios',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getStudentById(idstudentuser: number): Promise<StudentUserDto> {
    try {
      const student = await this.prisma.studentUser.findUnique({
        where: { id: idstudentuser },
        include: { UserProfile: true },
      });

      if (!student) {
        throw new NotFoundException(
          `Estudiante con el ID ${idstudentuser} no existe.`,
        );
      }

      return {
        id: student["id"],
        Name: student["Name"],
        LastName: student["LastName"],
        email: student["email"],
        Password: student["Password"],
        UserProfile: student["UserProfile"]
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          response: null,
          error: 'Error al obtener el usuario',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createStudent(data: CreateStudentDto): Promise<StudentUserDto | null> {
    const result = validateStudentUser(data);

    try {
      const student = await this.prisma.studentUser.create({
        data: {
          Name: result.Name,
          LastName: result.LastName,
          Password: result.Password,
          email: result.email,
        },
      });

      const profileData = data.UserProfile ?? {
        Institute: '',
        GitHub: '',
        Linkedin: '',
        imageURL: '',
        PhoneNumber: '',
        Description: '',
        Career: '',
        Cycle: null,
      };

      const userProfile = await this.prisma.studentProfile.create({
        data: {
          Institute: profileData.Institute,
          GitHub: profileData.GitHub,
          Linkedin: profileData.Linkedin,
          imageURL: profileData.imageURL,
          PhoneNumber: profileData.PhoneNumber,
          Description: profileData.Description,
          Career: profileData.Career,
          Cycle: profileData.Cycle,
          studentUserId: student["id"],
        },
      });

      return {
        id: student["id"],
        Name: student["Name"],
        LastName: student["LastName"],
        email: student["email"],
        Password: student["password"],
        //UserProfile: userProfile,
      };
    } catch (error) {
      HandlingErrorOfSearchById(error);
      throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            response: null,
            error: 'Error al crear el usuario',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }  

  async updateStudentUser( id: number, data: UpdateStudentDto,): Promise<StudentUser | null> {
    const result = validatePartialStudentUser(data); 
  
    try {
      return await this.prisma.studentUser.update({
        where: { id },
        data: {
          ...(data.Name && { Name: data.Name }), 
          ...(data.LastName && { LastName: data.LastName }),
          ...(data.Password && { Password: data.Password }), 
          ...(data.email && { email: data.email }),
        },
      });
    } catch (error) {
      HandlingErrorOfSearchById(error); 
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          response: null,
          error: 'Error al actualizar el usuario',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteStudent(idStudentUser: number): Promise<StudentUser | null> {
    try {
      const existingUser = await this.prisma.studentUser.findUnique({
        where: { id: idStudentUser },
      });
      if (!existingUser) {
        throw new BadRequestException('Usuario no encontrado.');
      }
  
      const existingProfile = await this.prisma.studentProfile.findUnique({
        where: { studentUserId: idStudentUser },
      });
      if (existingProfile) {
        await this.prisma.studentProfile.delete({
          where: { studentUserId: idStudentUser },
        });
      }
  
      const deletedUser = await this.prisma.studentUser.delete({
        where: { id: idStudentUser },
      });
      return deletedUser;
    } catch (error) {
      HandlingErrorOfSearchById(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          response: null,
          error: 'Error al eliminar el usuario',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}