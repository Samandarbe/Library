import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  BadRequestException,
  NotFoundException,
  HttpStatus,
  HttpCode,
  Res,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { USER_NOT_FOUND } from 'src/user/user.constants';
import { UserService } from 'src/user/user.service';
import {
  BOOK_COUNT_ERROR,
  BOOK_NOT_FOUND,
  headingColumnNames,
  headingColumnNamesManyBooks,
  headingColumnUzbNames,
} from './books.constants';

import { BooksService } from './books.service';
import { BooksDto } from './dto/books.dto';
import { toSelectDto } from './dto/toSelect.dto';
import * as xl from 'excel4node';
import { Response } from 'express';
import * as path from 'path';
import * as xlsx from 'xlsx';

import { SelectBookService } from 'src/select-book/select-book.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 } from 'uuid';
@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly userService: UserService,
    private readonly selectBookService: SelectBookService,
  ) {}

  @Get('export/many-books-read')
  async getAllManyBooksImport(@Res() res: Response) {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Worksheet Name');

    const data = await this.booksService.getAll();

    let headingColumnIndex = 1;
    headingColumnNamesManyBooks.forEach((heading) => {
      ws.cell(1, headingColumnIndex++).string(heading);
    });

    let rowIndex = 2;
    data.forEach((record) => {
      let columnIndex = 1;
      headingColumnNames.forEach((columnName) => {
        ws.cell(rowIndex, columnIndex++).string(record[columnName]);
      });
      rowIndex++;
    });
    const url = path.join(process.cwd(), 'uploads/booksE/books.xlsx');
    wb.write(url, (err, data) => {
      res.download(url);
    });
  }
  @Get('export/all-books')
  async getAllBooksImport(@Res() res: Response) {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Worksheet Name');

    let data = await this.booksService.getAll();
    data = JSON.parse(JSON.stringify(data));

    let headingColumnIndex = 1;
    headingColumnUzbNames.forEach((heading) => {
      ws.cell(1, headingColumnIndex++).string(heading);
    });

    let rowIndex = 2;
    data.forEach((record) => {
      let columnIndex = 1;
      headingColumnNames.forEach((columnName) => {
        ws.cell(rowIndex, columnIndex++).string(record[columnName]);
      });
      rowIndex++;
    });
    const url = path.join(process.cwd(), 'uploads/booksE/books.xlsx');
    wb.write(url, (err, data) => {
      res.download(url);
    });
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const data = xlsx.read(file.buffer);

    const body = data.SheetNames;

    const parsedData = [];
    for (let i = 0; i <= body.length; i++) {
      const tempData = xlsx.utils.sheet_to_json(data.Sheets[body[i]]);

      parsedData.push(...tempData);
    }
    console.log(parsedData);

    this.booksService.updateManyBooks(parsedData);
  }

  @Get()
  async getBooksAll(@Query('text') text: string) {
    return this.booksService.getAll(text);
  }
  @Get('manyBookRead')
  async getManyBookRead() {
    return this.booksService.getManyBooksRead();
  }

  @Get(':id')
  async getBooksById(@Param('id', IdValidationPipe) id: string) {
    return this.booksService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async createBook(@Body() dto: BooksDto) {
    return this.booksService.createBook(dto);
  }

  // @UseGuards(JwtAuthGuard)
  // @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('toSelect')
  async selectBook(@Body() dto: toSelectDto) {
    const book = await this.booksService.getById(dto.bookId);
    const user = await this.userService.getUserById(dto.userId);
    if (!book) {
      throw new NotFoundException(BOOK_NOT_FOUND);
    }
    if (book.totalCount == book.busyCount) {
      throw new NotFoundException(BOOK_COUNT_ERROR);
    }
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    const id = v4();
    await this.selectBookService.createSelectBook({
      book: dto.bookId,
      user: dto.userId,
      id,
    });
    await this.userService.addBookToSelect(dto.userId, dto.bookId, id);
    return this.booksService.incrBusyCount(dto.bookId);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('toRead')
  async readBook(@Body() dto: toSelectDto) {
    // const book = await this.booksService.getById(dto.bookId);
    const user = await this.userService.getUserById(dto.userId);
    // if (!book) {
    //   throw new NotFoundException(BOOK_NOT_FOUND);
    // }
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    await this.userService.addBookToReadBooks(dto.userId, dto.bookId);

    return this.booksService.decrBusyCount(dto.bookId);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async updateBook(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: BooksDto,
  ) {
    return this.booksService.updateBook(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBook(@Param('id', IdValidationPipe) id: string) {
    return this.booksService.deleteBook(id);
  }
}
