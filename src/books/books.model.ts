/* eslint-disable @typescript-eslint/no-empty-interface */
import { index, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface BooksModel extends Base {}
@index({ inventoryNumber: 'text', author: 'text', title: 'text' })
export class BooksModel extends TimeStamps {
  @prop()
  timeOfWriting: string;

  @prop()
  inventoryNumber: string;

  @prop()
  author: string;

  @prop()
  title: string;

  @prop()
  yearOfPublication: string;

  @prop()
  department: string;

  @prop()
  note: string;

  @prop()
  url: string;

  @prop()
  totalCount: number;

  @prop({ default: 0 })
  busyCount: number;

  @prop({ default: 0 })
  manyBooksRead: number;

  @prop()
  photo: string;
}
