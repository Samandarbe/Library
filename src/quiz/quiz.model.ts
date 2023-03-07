/* eslint-disable @typescript-eslint/no-empty-interface */
import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface QuizModel extends Base {}
export class QuizModel extends TimeStamps {
  @prop()
  bookName: string;

  @prop()
  description: string;

  @prop()
  author: string;
}
