/* eslint-disable @typescript-eslint/no-empty-interface */
import { index, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ObjectId } from 'mongoose';
import { BooksModel } from 'src/books/books.model';

export enum Nationality {
  Uzb = 'Uzb',
  Rus = 'Rus',
}
export class UserSelectBookModel {
  @prop({ autopopulate: true, ref: BooksModel })
  book: Ref<BooksModel>;

  @prop()
  givenDate: number;

  @prop()
  returnDate: Date;

  @prop()
  id: string;
}

export interface UserModel extends Base {}
@index({ firstName: 'text', lastName: 'text', patronymic: 'text', id: 'text' })
export class UserModel extends TimeStamps {
  @prop()
  firstName: string;

  @prop()
  lastName: string;

  @prop()
  patronymic: string;

  @prop({ enum: Nationality })
  nationality: Nationality;

  @prop()
  dob: string;

  @prop()
  workPlace: string;

  @prop()
  profession: string;

  @prop()
  placeStudy: string;

  @prop()
  address: string;

  @prop()
  phone: string;

  @prop()
  photo: string;

  @prop({ default: 0 })
  userManyBooksRead: number;

  @prop({ type: () => [UserSelectBookModel] })
  selectBooks: UserSelectBookModel[];

  @prop({ autopopulate: true, ref: BooksModel })
  readBooks: Ref<BooksModel>[];

  @prop({ unique: true })
  id: string;
}
