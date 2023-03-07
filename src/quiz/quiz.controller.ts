import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Res,
  Post,
} from '@nestjs/common';
import * as xl from 'excel4node';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { QuizDto } from './dto/quiz.dto';
import { excelHeader } from './quiz.constants';
import { QuizService } from './quiz.service';
import * as path from 'path';
import { Response } from 'express';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}
  @Get()
  async getQuizAll() {
    return this.quizService.getQuizAll();
  }
  @Get(':id')
  async getQuizById(@Param('id', IdValidationPipe) id: string) {
    return this.quizService.getById(id);
  }

  @Post()
  async createSelectQuiz(@Body() dto: QuizDto) {
    return this.quizService.createQuiz(dto);
  }

  @Patch(':id')
  async updateSelectQuiz(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: QuizDto,
  ) {
    return this.quizService.updateQuiz(id, dto);
  }

  @Delete(':id')
  async deleteQuiz(@Param('id', IdValidationPipe) id: string) {
    return this.quizService.deleteQuiz(id);
  }
  @Get('export/all')
  async getAllQuizExport(@Res() res: Response) {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Worksheet Name');
    let data = await this.quizService.getQuizAll();
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
      const url = path.join(process.cwd(), 'uploads/quiz/quiz.xlsx');
      wb.write(path.resolve(url), (err, data) => {
        res.download(url);
      });
      // const stream = fs.createReadStream(url);
      // return new StreamableFile(stream);
    } catch (err) {
      console.log(err);
    }
  }
}
