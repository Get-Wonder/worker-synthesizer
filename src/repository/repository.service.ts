import { Inject, Injectable } from '@nestjs/common';
import * as pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

import { SceneStatus } from 'src/enums/scene-status.enum';

@Injectable()
export class RepositoryService {
  private pgPool: any;

  constructor() {
    this.pgPool = new pg.Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  public async updateScene(
    sceneId: string,
    sceneStatus: SceneStatus,
  ): Promise<void> {
    const client = await this.pgPool.connect();

    try {
      await client.query('BEGIN');
      await client.query(
        'UPDATE video_template_scenes SET status = $1 WHERE "id" = $2',
        [sceneStatus, sceneId],
      );
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  }

  public async getAudio(text: string, audioGroupId: string) {
    const client = await this.pgPool.connect();
    let audio;
    console.log('TEXT', text, 'audioGroupId', audioGroupId);
    try {
      audio = await client.query(
        'SELECT * FROM audios WHERE "text" = $1 AND "groupId" = $2',
        [text, audioGroupId],
      );
    } catch (err) {
      console.log('ERROR', err);
    } finally {
      client.release();
      return audio;
    }
  }

  public async getScene(sceneId: string): Promise<void> {
    const client = await this.pgPool.connect();

    let scene;

    try {
      scene = await client.query(
        'SELECT * FROM video_template_scenes WHERE id = $1',
        [sceneId],
      );
    } catch (err) {
    } finally {
      client.release();
      return scene;
    }
  }

  public async createClip(
    text: string,
    audioUrl: string,
    fileName: string,
    groupId: string,
  ): Promise<void> {
    const client = await this.pgPool.connect();
    console.log('connected');
    try {
      console.log('try');
      await client.query('BEGIN');
      console.log('begin');
      await client.query(
        `INSERT INTO audios (text, url, variables, "groupId") 
        VALUES ($1, $2, $3, $4);`,
        [text, audioUrl, fileName, groupId],
      );
      console.log('after insert');
      await client.query('COMMIT');
      console.log('commit');
    } catch (err) {
      console.log('ERROR', err);
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  }
}
