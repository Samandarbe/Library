import { Injectable, NotFoundException } from '@nestjs/common';

import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { BOOK_NOT_FOUND } from './books.constants';
import { BooksModel } from './books.model';
import { BooksDto } from './dto/books.dto';
@Injectable()
export class BooksService {
  constructor(
    @InjectModel(BooksModel) private readonly booksModel: ModelType<BooksModel>,
  ) {}
  async getAll(text?: string) {
    if (text) {
      const query = { $text: { $search: text } };
      return this.booksModel.find(query).exec();
    }
    return this.booksModel.find({}).exec();
  }
  async getById(id: string) {
    return this.booksModel.findById(id).exec();
  }
  async updateManyBooks(dto: BooksDto[]) {
    return this.booksModel.insertMany(dto);
  }

  async getManyBooksRead() {
    return this.booksModel.find().sort({ manyBooksRead: -1 }).exec();
  }

  async createBook(dto: BooksDto) {
    return this.booksModel.create(dto);
  }

  async incrBusyCount(id: string) {
    return this.booksModel.findByIdAndUpdate(id, {
      $inc: { busyCount: 1, manyBooksRead: 1 },
    });
  }
  async decrBusyCount(id: string) {
    return this.booksModel.findOneAndUpdate(
      { id },
      { $inc: { busyCount: -1 } },
    );
  }

  async updateBook(id: string, dto: BooksDto) {
    return this.booksModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
  async deleteBook(id: string) {
    return this.booksModel.findByIdAndDelete(id);
  }
}
