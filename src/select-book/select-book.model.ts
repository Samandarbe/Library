/* eslint-disable @typescript-eslint/no-empty-interface */
import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { BooksModel } from 'src/books/books.model';
import { UserModel } from 'src/user/user.model';

export interface SelectBookModel extends Base {}
export class SelectBookModel extends TimeStamps {
  @prop({ unique: true })
  id: string;

  @prop({ autopopulate: true, ref: UserModel })
  user: Ref<UserModel>;

  @prop({ autopopulate: true, ref: BooksModel })
  book: Ref<BooksModel>;

  @prop()
  givenDate: number;

  @prop()
  returnDate: Date;
}
