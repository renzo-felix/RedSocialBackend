import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StudentUserService } from './student-user.service';
import { StudentUser } from '.prisma/client';
import { StudentUserDto, CreateStudentDto, UpdateStudentDto } from './user.dto';

@Controller('student-user')
export class StudentUserController {
  constructor(private readonly studentUserService: StudentUserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllStudents(): Promise<StudentUserDto[] | null> {
    return this.studentUserService.getAllStudents();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param('id', ParseIntPipe) idStudentUser,
  ): Promise<StudentUserDto> {
    return this.studentUserService.getStudentById(idStudentUser);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStudent(
    @Body() studentUser: CreateStudentDto,
  ): Promise<StudentUserDto> {
    return this.studentUserService.createStudent(studentUser);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateStudent(
    @Param('id', ParseIntPipe) idStudentUser: number,
    @Body() data: UpdateStudentDto,
  ): Promise<StudentUser | null> {
    return this.studentUserService.updateStudentUser(idStudentUser, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStudent(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.studentUserService.deleteStudent(id);
  }
}
