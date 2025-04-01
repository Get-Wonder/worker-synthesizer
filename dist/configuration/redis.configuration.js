"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConfig = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.redisConfig = {
    settings: {
        maxStalledCount: 0
    },
    redis: {
        host: process.env.REDIS_HOSTNAME,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
    },
};
//# sourceMappingURL=redis.configuration.js.map