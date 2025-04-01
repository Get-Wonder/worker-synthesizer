"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryService = void 0;
const common_1 = require("@nestjs/common");
const pg = require("pg");
const dotenv = require("dotenv");
dotenv.config();
let RepositoryService = class RepositoryService {
    constructor() {
        this.pgPool = new pg.Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
    }
    async updateScene(sceneId, sceneStatus) {
        const client = await this.pgPool.connect();
        try {
            await client.query('BEGIN');
            await client.query('UPDATE video_template_scenes SET status = $1 WHERE "id" = $2', [sceneStatus, sceneId]);
            await client.query('COMMIT');
        }
        catch (err) {
            await client.query('ROLLBACK');
        }
        finally {
            client.release();
        }
    }
    async getAudio(text, audioGroupId) {
        const client = await this.pgPool.connect();
        let audio;
        console.log('TEXT', text, 'audioGroupId', audioGroupId);
        try {
            audio = await client.query('SELECT * FROM audios WHERE "text" = $1 AND "groupId" = $2', [text, audioGroupId]);
        }
        catch (err) {
            console.log('ERROR', err);
        }
        finally {
            client.release();
            return audio;
        }
    }
    async getScene(sceneId) {
        const client = await this.pgPool.connect();
        let scene;
        try {
            scene = await client.query('SELECT * FROM video_template_scenes WHERE id = $1', [sceneId]);
        }
        catch (err) {
        }
        finally {
            client.release();
            return scene;
        }
    }
    async createClip(text, audioUrl, fileName, groupId) {
        const client = await this.pgPool.connect();
        console.log('connected');
        try {
            console.log('try');
            await client.query('BEGIN');
            console.log('begin');
            await client.query(`INSERT INTO audios (text, url, variables, "groupId") 
        VALUES ($1, $2, $3, $4);`, [text, audioUrl, fileName, groupId]);
            console.log('after insert');
            await client.query('COMMIT');
            console.log('commit');
        }
        catch (err) {
            console.log('ERROR', err);
            await client.query('ROLLBACK');
        }
        finally {
            client.release();
        }
    }
};
RepositoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RepositoryService);
exports.RepositoryService = RepositoryService;
//# sourceMappingURL=repository.service.js.map