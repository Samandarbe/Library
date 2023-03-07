import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { QuizDto } from './dto/quiz.dto';
import { QuizModel } from './quiz.model';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(QuizModel)
    private readonly quizModel: ModelType<QuizModel>,
  ) {}
  async getQuizAll() {
    return this.quizModel.find({}).exec();
  }

  async getById(id: string) {
    return this.quizModel.findById(id).exec();
  }

  async createQuiz(dto: QuizDto) {
    return this.quizModel.create(dto);
  }

  async updateQuiz(id: string, dto: QuizDto) {
    return this.quizModel.findByIdAndUpdate(id, dto).exec();
  }

  async deleteQuiz(id: string) {
    return this.quizModel.findByIdAndDelete(id);
  }
}
