import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';
import { RepositoryService } from 'src/repository/repository.service';
import { WorkerProcessor } from './worker.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'jingle-queue',
    }),
  ],
  providers: [WorkerProcessor, AwsService, RepositoryService],
})
export class WorkerModule {}
