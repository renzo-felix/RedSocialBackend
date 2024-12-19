import { Module } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { PracticeController } from './practice.controller';
import { PrismaClient } from '@prisma/client';
@Module({
  controllers: [PracticeController],
  providers: [PracticeService, PrismaClient],
})
export class PracticeModule {}
