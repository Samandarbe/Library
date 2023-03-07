import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Res,
  StreamableFile,
  BadRequestException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { MFile } from './dto/mFile.class';
import { UserDto } from './dto/user.dto';
import { FilesService } from './files.service';
import { UserService } from './user.service';
import { Response } from 'express';
import * as xlsx from 'xlsx';
import * as xl from 'excel4node';
import * as fs from 'fs';
import * as path from 'path';
import {
  DUPLICATE_ERROR,
  excelHeader,
  USER_NOT_DELETE,
} from './user.constants';
import { SelectBookService } from 'src/select-book/select-book.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly filesService: FilesService,
    private readonly selectBookService: SelectBookService,
  ) {}

  @Get('export')
  async getAllUsersImport(@Res() res: Response) {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Worksheet Name');
    let data = await this.userService.getAllUsers();
    data = JSON.parse(JSON.stringify(data));
    let headingColumnIndex = 1;
    excelHeader.forEach((title) => {
      ws.cell(1, headingColumnIndex++).string(title);
    });

    let rowIndex = 2;
    data.forEach((record) => {
      let columnIndex = 1;
      excelHeader.forEach((columnName) => {
        ws.cell(rowIndex, columnIndex++).string(record[columnName]);
      });
      rowIndex++;
    });

    // const fileName = new Date().getTime() + 'data.xlsx';

    try {
      const url = path.join(process.cwd(), 'uploads/users/users.xlsx');
      wb.write(path.resolve(url), (err, data) => {
        res.download(url);
      });
      // const stream = fs.createReadStream(url);
      // return new StreamableFile(stream);
    } catch (err) {
      console.log(err);
    }
  }
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const data = xlsx.read(file.buffer);
    const body = data.SheetNames;

    const parsedData = [];
    for (let i = 0; i <= body.length; i++) {
      const tempData = xlsx.utils.sheet_to_json(data.Sheets[body[i]]);

      parsedData.push(...tempData);
    }
    try {
      const users = await this.userService.updateManyUsers(parsedData);
      return users;
    } catch (error) {
      throw new BadRequestException(DUPLICATE_ERROR);
    }
  }

  @Get()
  async getAllUsers(@Query('text') text: string) {
    return this.userService.getAllUsers(text);
  }
  @Get('userManyBooksRead')
  async getUserManyBooksRead() {
    return this.userService.getUserManyBooksRead();
  }

  @Get(':id')
  async getUserById(@Param('id', IdValidationPipe) id: string) {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('photo'))
  @Post()
  async createUser(
    @Body() dto: UserDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    let save = new MFile(photo);
    if (photo.mimetype.includes('image')) {
      const buffer = await this.filesService.convertFiles(photo.buffer);
      save = {
        originalname: `${photo.originalname.split('.')[0]}.webp`,
        buffer,
      };
    }
    const photoResponse = await this.filesService.saveFiles(save);
    return this.userService.createUser({ ...dto, photo: photoResponse.url });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async updateUser(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UserDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    let photoResponse = null;
    if (photo) {
      let save = new MFile(photo);
      if (photo.mimetype.includes('image')) {
        const buffer = await this.filesService.convertFiles(photo.buffer);
        save = {
          originalname: `${photo.originalname.split('.')[0]}.webp`,
          buffer,
        };
      }
      photoResponse = await this.filesService.saveFiles(save);
    }
    const form = { ...dto };
    if (photoResponse) {
      form.photo = photoResponse.url;
    }
    return this.userService.updateUser(id, form);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id', IdValidationPipe) id: string) {
    const user = await this.userService.getUserById(id);
    if (user.selectBooks.length > 0) {
      throw new BadRequestException(USER_NOT_DELETE);
    }

    await this.selectBookService.deleteSelectALLBook(id);

    return this.userService.deleteUser(id);
  }
}
