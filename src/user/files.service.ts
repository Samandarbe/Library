import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { path } from 'app-root-path';
import { v4 } from 'uuid';
import { format } from 'date-fns';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from './dto/mFile.class';
@Injectable()
export class FilesService {
  constructor(private readonly ConfigService: ConfigService) {}

  async saveFiles(file: MFile) {
    const uploadFolder = `${path}/uploads/user`;
    await ensureDir(uploadFolder);
    const name = `user-${v4()}`;
    const baseUrl = this.ConfigService.get('BASE_URL');

    await writeFile(`${uploadFolder}/${name}.webp`, file.buffer);

    const res = {
      url: `${baseUrl}/api/uploads/user/${name}.webp`,
      name: file.originalname,
    };

    return res;
  }

  async convertFiles(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
