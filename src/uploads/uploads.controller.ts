import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as nPath from 'path';

@Controller('uploads')
export class UploadsController {
  @Get('user')
  getHello(): string {
    return 'hello';
  }

  @Get('user/:path')
  async getUserImage(@Param('path') path: string) {
    const url = nPath.resolve(
      nPath.join(process.cwd(), '/uploads/user/', path),
    );

    const stream = createReadStream(url);
    return new StreamableFile(stream);
  }
}
