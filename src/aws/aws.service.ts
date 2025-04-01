import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { execSync } from 'child_process';
import * as path from 'path';
import * as os from 'os';
import { Readable } from 'stream';

@Injectable()
export class AwsService {
  private bucketName = '';
  private doSpacesEndpoint = '';
  
  constructor() {
    this.bucketName = process.env.JINGLE_BUCKET;
    this.doSpacesEndpoint = process.env.DO_SPACES_ENDPOINT;
  }

  parseS3Url(url: string): { bucket: string; key: string; query: string } {
    const bucket = url.split('.')[0].split('//').pop();
    const [key, query] = url.split('/').slice(3).join('/').split('?');
    return { bucket, key, query };
  }

  public downloadFile(url: string, dest: string): Promise<any> {
    const { bucket, key } = this.parseS3Url(url);
    console.log('KEY ##########################', key);
    const s3: S3 = this.getS3();
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

  private streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  public async uploadJingle(
    file: any,
    options?: { acl?: string },
  ): Promise<any> {
    try {
      // Create temporary files
      const tempInputPath = path.join(os.tmpdir(), `input-${Date.now()}.mp3`);
      const tempOutputPath = path.join(os.tmpdir(), `output-${Date.now()}.mp3`);

      // Handle different input types
      if (file.buffer) {
        // If it's already a buffer, write it directly
        await fs.promises.writeFile(tempInputPath, file.buffer);
      } else if (file instanceof Readable || file.pipe) {
        // If it's a stream, convert to buffer first
        const buffer = await this.streamToBuffer(file);
        await fs.promises.writeFile(tempInputPath, buffer);
      } else {
        throw new Error('Invalid file format. Expected Buffer or ReadStream.');
      }

      // Use FFmpeg to compress the audio while maintaining quality
      execSync(`ffmpeg -i "${tempInputPath}" -map_metadata 0 -c:a libmp3lame -q:a 2 "${tempOutputPath}"`, {
        stdio: 'inherit',
      });

      // Read the compressed file
      const compressedBuffer = await fs.promises.readFile(tempOutputPath);

      // Clean up temporary files
      await fs.promises.unlink(tempInputPath);
      await fs.promises.unlink(tempOutputPath);

      const fileKey = `jingle/clips/${file.name}.mp3`;
      console.log('UPLOADING CLIPS', fileKey);
      const s3: S3 = this.getS3();

      return new Promise((resolve, reject) => {
        s3.putObject(
          {
            Bucket: this.bucketName,
            Key: fileKey,
            Body: compressedBuffer,
            ACL: options?.acl ?? 'public-read',
            ContentType: 'audio/mpeg',
          },
          (error) => {
            if (!error) {
              resolve(
                `https://${this.bucketName}.${this.doSpacesEndpoint}/${fileKey}`,
              );
            } else {
              reject(
                new Error(
                  `DOSpacesService_ERROR: ${
                    error.message || error.code || 'Something went wrong'
                  }`,
                ),
              );
            }
          },
        );
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      throw error;
    }
  }

  public uploadWonderchatVideo(
    file: any,
    chatbotId: string,
    options?: { acl?: string },
  ): Promise<any> {
    const fileKey = `${chatbotId}/clips/${file.name}.mp4`;
    const s3: S3 = this.getS3();
    return new Promise((resolve, reject) => {
      s3.putObject(
        {
          Bucket: this.bucketName,
          Key: fileKey,
          Body: file.buffer,
          ACL: options?.acl ?? 'public-read',
          ContentType: 'video/mp4',
        },
        (error) => {
          if (!error) {
            resolve(
              `https://${this.bucketName}.${this.doSpacesEndpoint}/${fileKey}`,
            );
          } else {
            reject(
              new Error(
                `DOSpacesService_ERROR: ${
                  error.message || error.code || 'Something went wrong'
                }`,
              ),
            );
          }
        },
      );
    });
  }

  private getS3(): S3 {
    return new S3({
      endpoint: process.env.DO_SPACES_ENDPOINT,
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET,
    });
  }
}