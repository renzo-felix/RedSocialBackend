import { Module } from '@nestjs/common';
import { HabilitiesControler } from './habilities.controler';
import { HabilitiesService } from './habilities.service';

@Module({
  controllers: [HabilitiesControler],
  providers: [HabilitiesService],
})
export class HabilitiesModule {}
