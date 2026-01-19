import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { BatchService } from './services/batch.service';
import { ConnectionJob } from './jobs/connection.job';
import { BatchController } from './batch.controller';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, HttpModule],
  controllers: [BatchController],
  providers: [BatchService, ConnectionJob],
  exports: [BatchService],
})
export class BatchModule {}
