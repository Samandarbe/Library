import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { QuizController } from './quiz.controller';
import { QuizModel } from './quiz.model';
import { QuizService } from './quiz.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: QuizModel,
        schemaOptions: {
          collection: 'Quiz',
        },
      },
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
