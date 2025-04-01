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
exports.AwsService = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs = require("fs");
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const path = require("path");
const os = require("os");
const stream_1 = require("stream");
let AwsService = class AwsService {
    constructor() {
        this.bucketName = '';
        this.doSpacesEndpoint = '';
        this.bucketName = process.env.JINGLE_BUCKET;
        this.doSpacesEndpoint = process.env.DO_SPACES_ENDPOINT;
    }
    parseS3Url(url) {
        const bucket = url.split('.')[0].split('//').pop();
        const [key, query] = url.split('/').slice(3).join('/').split('?');
        return { bucket, key, query };
    }
    downloadFile(url, dest) {
        const { bucket, key } = this.parseS3Url(url);
        console.log('KEY ##########################', key);
        const s3 = this.getS3();
        const params = {
            Bucket: bucket,
            Key: key,
        };
        const writeStream = fs.createWriteStream(dest);
        return new Promise((resolve, reject) => {
            const readStream = s3.getObject(params).createReadStream();
            readStream.on('error', (e) => {
                console.log('ERROR', e);
                writeStream.destroy();
                reject(e);
            });
            writeStream.once('finish', () => {
                resolve(true);
            });
            readStream.pipe(writeStream);
        });
    }
    streamToBuffer(stream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        });
    }
    async uploadJingle(file, options) {
        try {
            const tempInputPath = path.join(os.tmpdir(), `input-${Date.now()}.mp3`);
            const tempOutputPath = path.join(os.tmpdir(), `output-${Date.now()}.mp3`);
            if (file.buffer) {
                await fs.promises.writeFile(tempInputPath, file.buffer);
            }
            else if (file instanceof stream_1.Readable || file.pipe) {
                const buffer = await this.streamToBuffer(file);
                await fs.promises.writeFile(tempInputPath, buffer);
            }
            else {
                throw new Error('Invalid file format. Expected Buffer or ReadStream.');
            }
            (0, child_process_1.execSync)(`ffmpeg -i "${tempInputPath}" -map_metadata 0 -c:a libmp3lame -q:a 2 "${tempOutputPath}"`, {
                stdio: 'inherit',
            });
            const compressedBuffer = await fs.promises.readFile(tempOutputPath);
            await fs.promises.unlink(tempInputPath);
            await fs.promises.unlink(tempOutputPath);
            const fileKey = `jingle/clips/${file.name}.mp3`;
            console.log('UPLOADING CLIPS', fileKey);
            const s3 = this.getS3();
            return new Promise((resolve, reject) => {
                var _a;
                s3.putObject({
                    Bucket: this.bucketName,
                    Key: fileKey,
                    Body: compressedBuffer,
                    ACL: (_a = options === null || options === void 0 ? void 0 : options.acl) !== null && _a !== void 0 ? _a : 'public-read',
                    ContentType: 'audio/mpeg',
                }, (error) => {
                    if (!error) {
                        resolve(`https://${this.bucketName}.${this.doSpacesEndpoint}/${fileKey}`);
                    }
                    else {
                        reject(new Error(`DOSpacesService_ERROR: ${error.message || error.code || 'Something went wrong'}`));
                    }
                });
            });
        }
        catch (error) {
            console.error('Error processing audio:', error);
            throw error;
        }
    }
    uploadWonderchatVideo(file, chatbotId, options) {
        const fileKey = `${chatbotId}/clips/${file.name}.mp4`;
        const s3 = this.getS3();
        return new Promise((resolve, reject) => {
            var _a;
            s3.putObject({
                Bucket: this.bucketName,
                Key: fileKey,
                Body: file.buffer,
                ACL: (_a = options === null || options === void 0 ? void 0 : options.acl) !== null && _a !== void 0 ? _a : 'public-read',
                ContentType: 'video/mp4',
            }, (error) => {
                if (!error) {
                    resolve(`https://${this.bucketName}.${this.doSpacesEndpoint}/${fileKey}`);
                }
                else {
                    reject(new Error(`DOSpacesService_ERROR: ${error.message || error.code || 'Something went wrong'}`));
                }
            });
        });
    }
    getS3() {
        return new aws_sdk_1.S3({
            endpoint: process.env.DO_SPACES_ENDPOINT,
            accessKeyId: process.env.DO_SPACES_KEY,
            secretAccessKey: process.env.DO_SPACES_SECRET,
        });
    }
};
AwsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AwsService);
exports.AwsService = AwsService;
//# sourceMappingURL=aws.service.js.map