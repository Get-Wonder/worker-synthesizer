import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { join } from 'path';
import { AwsService } from 'src/aws/aws.service';
import { RepositoryService } from 'src/repository/repository.service';
import * as AdmZip from 'adm-zip';
import * as fs from 'fs';
var child_process = require('child_process');
import { SceneStatus } from 'src/enums/scene-status.enum';
import fetch from 'node-fetch';
import path from 'path';
import axios from 'axios';
import * as crypto from "crypto";

@Processor('jingle-queue')
export class WorkerProcessor {
  constructor(
    private awsService: AwsService,
    private repositoryService: RepositoryService,
  ) { }

  @Process('generate')
  async render(job: Job<any>): Promise<{ clipUrl: string } | { error: boolean }> {
    const tmpWorkingDir = join(process.cwd(), `./tmp/`);
    const outputDir = join(process.cwd(), '/Output/');
    const text = job?.data?.text;
    const count = job?.data?.count
    const SALT = process.env.SALT;

    console.log('job.data', job.data, 'count', count);

    const addSalt = (text: string) => {
      return text + SALT;
    };
  
    const createMD5 = (text: string) => {
      const textWithSalt = addSalt(text);
      return crypto.createHash("md5").update(textWithSalt).digest("hex");
    };


    try {
      console.log('Generando Audio');
      // const json = `python3 app.py --phonetics ${stringArray} --count ${count} && exit`;

      // const finalJson = json.replace(/\\/g, '/');

      // fs.writeFileSync('command.txt', finalJson, 'utf8');

      // fs.writeFileSync('Render.bat', '', 'utf8');
      // fs.appendFileSync('Render.bat', '@echo off \n');
      // fs.appendFileSync('Render.bat', 'title Render \n');
      // fs.appendFileSync(
      //   'Render.bat',
      //   `python Executer.py "Administrator:  Render"`,
      // );

      // fs.writeFileSync('Supervisor.bat', '', 'utf8');
      // fs.appendFileSync('Supervisor.bat', '@echo off \n');
      // fs.appendFileSync('Supervisor.bat', 'title Supervisor \n');
      // fs.appendFileSync('Supervisor.bat', 'python supervisor.py Render');

      // child_process.exec('./render.sh', {
      // });

      const display = ':1'; 
      const xauthority = '/root/.Xauthority';
      console.log('antes app.py')
      // await child_process.execSync('sudo chmod -R 777 /root/Downloads/IONOS/worker/Output')
      // const output = await child_process.execSync(`su amaze && export DISPLAY=${display} && export XAUTHORITY=${xauthority} && python3 app.py --phonetics "${text}" --count ${count}`, (error, stdout, stderr) => {
      //   if (error) {
      //     console.log(error)
      //   }
      //   if (stderr) {
      //     console.log('stderr', stderr)
      //   }
      //   console.log('output', stdout)
      // })

      const output = await child_process.execSync(`python3 app.py --phonetics "${text}" --count ${count}`, (error, stdout, stderr) => {
        if (error) {
          console.log(error)
        }
        if (stderr) {
          console.log('stderr', stderr)
        }
        console.log('output', stdout)
      })

      if (!fs.existsSync('/root/Downloads/IONOS/worker/Output/jingle_MixDown.wav')) {
        return { error: true }
      }

      // child_process.execSync('./supervisor.sh');


      // child_process.execSync(
      //   `voicefixer --infile ${voice}audio.wav --outfile ${voice}audioFixed.wav`,
      // );

      // fs.rename(`${outputDir}output.wav`, `${outputDir}${name}.wav`, () => {
      //   console.log('audio file moved');
      // });

      console.log('Wav generated');
    } catch (e) {
      console.log('AN ERROR OCURRED WHILE GENERATING THE WAV', e);
    }

    console.log('Uploading clips');

    const files = fs.readdirSync('Output');
    let clipUrl: any = ''
    try {
      for (let i = 0; i < files.length; i++) {
        const buffer = fs.createReadStream(join('Output', files[i]));

        const fileName = createMD5(text)

        const file: any = { name: fileName, buffer: buffer };

        clipUrl = await this.awsService.uploadJingle(file);

        console.log('clipUrl', clipUrl);

        // await this.repositoryService.createClip(text, clipUrl, fileName, groupId);
      }
    } catch (e) {
      console.log('ERROR', e)
    }

    if (job.data.jobNumber === job.data.totalJobs) {
      // await finalJobCleaning(sceneId);
    }
    fs.rmSync(outputDir, { recursive: true, force: true });
    fs.mkdirSync(outputDir);
    console.log('CLIP URL ANTES RETURN', clipUrl)
    return { clipUrl }
  }
}
