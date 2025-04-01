import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisConfig } from './configuration/redis.configuration';
import { BullModule } from '@nestjs/bull';
import { WorkerModule } from './worker/worker.module';
import { AwsModule } from "./aws/aws.module"
import { RepositoryModule } from "./repository/repository.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot(redisConfig),
    WorkerModule,
    RepositoryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
