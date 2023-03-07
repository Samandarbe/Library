import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Res,
} from '@nestjs/common';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { SelectBooksDto } from './dto/selectBook.dto';
import { UpdateSelectBooksDto } from './dto/updateSelectBook.dto';
import { SelectBookService } from './select-book.service';
import { Response } from 'express';
import * as xl from 'excel4node';
import * as fs from 'fs';
import * as path from 'path';
import { headingColumnNames } from './select-book.constants';
@Controller('select-book')
export class SelectBookController {
  constructor(private readonly selectBookService: SelectBookService) {}

  @Get('export/duty')
  async getAllUsersImport(@Res() res: Response) {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Worksheet Name');
    let data: any = await this.selectBookService.getDutyBook();
    data = JSON.parse(JSON.stringify(data));
    console.log(data);

    let headingColumnIndex = 1;
    headingColumnNames.forEach((heading) => {
      ws.cell(1, headingColumnIndex++).string(heading);
    });

    let rowIndex = 2;
    data.forEach((record) => {
      let columnIndex = 1;
      headingColumnNames.forEach((columnName) => {
        if (columnName == 'user') {
          ws.cell(rowIndex, columnIndex++).string(
            `${record.user.lastName} ${record.user.firstName} ${record.user.patronymic}`,
          );
        } else if (columnName == 'book') {
          ws.cell(rowIndex, columnIndex++).string(`${record.book.title}`);
        } else if (columnName == 'givenDate') {
          ws.cell(rowIndex, columnIndex++).string(
            new Date(record.givenDate).toString(),
          );
        } else {
          ws.cell(rowIndex, columnIndex++).string(record[columnName]);
        }
      });
      rowIndex++;
    });
    try {
      const url = path.join(process.cwd(), 'uploads/booksE/select-books.xlsx');
      wb.write(url, (err, data) => {
        res.download(url);
      });
      // const stream = fs.createReadStream(url);
      // return new StreamableFile(stream);
    } catch (err) {
      console.log(err);
    }
  }

  @Get()
  async getBooksAll() {
    return this.selectBookService.getAll();
  }
  @Get('duty')
  async getDutyBook() {
    return this.selectBookService.getDutyBook();
  }
  @Get(':id')
  async getBooksById(@Param('id', IdValidationPipe) id: string) {
    return this.selectBookService.getById(id);
  }

  // @Get('user/:id')
  // async getBooksByUserId(@Param('id', IdValidationPipe) id: string) {
  //   return this.selectBookService.getByUserId(id);
  // }

  // @Get('book/:book')
  // async getBooksBookById(@Param('book', IdValidationPipe) book: string) {
  //   return this.selectBookService.getByBookId(book);
  // }

  @Post()
  async createSelectBook(@Body() dto: SelectBooksDto) {
    return this.selectBookService.createSelectBook(dto);
  }

  @Patch(':id')
  async updateSelectBook(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateSelectBooksDto,
  ) {
    return this.selectBookService.updateSelectBook(id, dto);
  }

  @Delete(':id')
  async deleteBook(@Param('id', IdValidationPipe) id: string) {
    return this.selectBookService.deleteSelectBook(id);
  }
}
