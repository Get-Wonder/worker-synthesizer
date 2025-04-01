import { BullRootModuleOptions } from '@nestjs/bull';
import * as dotenv from 'dotenv';
dotenv.config();

export const redisConfig: BullRootModuleOptions = {
  settings: {
    maxStalledCount: 0
  },
  redis: {
    host: process.env.REDIS_HOSTNAME,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
};
