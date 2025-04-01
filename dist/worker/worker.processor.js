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
exports.WorkerProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const path_1 = require("path");
const aws_service_1 = require("../aws/aws.service");
const repository_service_1 = require("../repository/repository.service");
const fs = require("fs");
var child_process = require('child_process');
const crypto = require("crypto");
let WorkerProcessor = class WorkerProcessor {
    constructor(awsService, repositoryService) {
        this.awsService = awsService;
        this.repositoryService = repositoryService;
    }
    async render(job) {
        var _a, _b;
        const tmpWorkingDir = (0, path_1.join)(process.cwd(), `./tmp/`);
        const outputDir = (0, path_1.join)(process.cwd(), '/Output/');
        const text = (_a = job === null || job === void 0 ? void 0 : job.data) === null || _a === void 0 ? void 0 : _a.text;
        const count = (_b = job === null || job === void 0 ? void 0 : job.data) === null || _b === void 0 ? void 0 : _b.count;
        const SALT = process.env.SALT;
        console.log('job.data', job.data, 'count', count);
        const addSalt = (text) => {
            return text + SALT;
        };
        const createMD5 = (text) => {
            const textWithSalt = addSalt(text);
            return crypto.createHash("md5").update(textWithSalt).digest("hex");
        };
        try {
            console.log('Generando Audio');
            const display = ':1';
            const xauthority = '/root/.Xauthority';
            console.log('antes app.py');
            const output = await child_process.execSync(`python3 app.py --phonetics "${text}" --count ${count}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                }
                if (stderr) {
                    console.log('stderr', stderr);
                }
                console.log('output', stdout);
            });
            if (!fs.existsSync('/root/Downloads/IONOS/worker/Output/jingle_MixDown.wav')) {
                return { error: true };
            }
            console.log('Wav generated');
        }
        catch (e) {
            console.log('AN ERROR OCURRED WHILE GENERATING THE WAV', e);
        }
        console.log('Uploading clips');
        const files = fs.readdirSync('Output');
        let clipUrl = '';
        try {
            for (let i = 0; i < files.length; i++) {
                const buffer = fs.createReadStream((0, path_1.join)('Output', files[i]));
                const fileName = createMD5(text);
                const file = { name: fileName, buffer: buffer };
                clipUrl = await this.awsService.uploadJingle(file);
                console.log('clipUrl', clipUrl);
            }
        }
        catch (e) {
            console.log('ERROR', e);
        }
        if (job.data.jobNumber === job.data.totalJobs) {
        }
        fs.rmSync(outputDir, { recursive: true, force: true });
        fs.mkdirSync(outputDir);
        console.log('CLIP URL ANTES RETURN', clipUrl);
        return { clipUrl };
    }
};
__decorate([
    (0, bull_1.Process)('generate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkerProcessor.prototype, "render", null);
WorkerProcessor = __decorate([
    (0, bull_1.Processor)('jingle-queue'),
    __metadata("design:paramtypes", [aws_service_1.AwsService,
        repository_service_1.RepositoryService])
], WorkerProcessor);
exports.WorkerProcessor = WorkerProcessor;
//# sourceMappingURL=worker.processor.js.map