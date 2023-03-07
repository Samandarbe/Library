import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { SelectBookModel } from './select-book.model';
import { v4 } from 'uuid';
import { SelectBooksDto } from './dto/selectBook.dto';
import { UpdateSelectBooksDto } from './dto/updateSelectBook.dto';
import { OptionsService } from 'src/options/options.service';
import { optionsDto } from 'src/options/dto/options.dto';
@Injectable()
export class SelectBookService {
  constructor(
    @InjectModel(SelectBookModel)
    private readonly selectBookModel: ModelType<SelectBookModel>,
    private readonly optionsService: OptionsService,
  ) {}

  async getAll() {
    return this.selectBookModel
      .find({})
      .sort({ returnDate: 1 })
      .populate({ path: 'user book' })
      .exec();
  }

  async getById(id: string) {
    return this.selectBookModel
      .findById(id)
      .populate({ path: 'user book' })
      .exec();
  }

  async getDutyBook() {
    return this.selectBookModel
      .find({ returnDate: { $lt: Date.now() } })
      .populate({ path: 'user book' })
      .exec();
  }

  // async getByUserId(uId: string) {
  //   return this.selectBookModel.findById(uId).exec();
  // }

  // async getByBookId(book: string) {
  //   return this.selectBookModel.findById(book).exec();
  // }

  async createSelectBook(dto) {
    const newDate = new Date();
    dto.givenDate = newDate;
    const options = await this.optionsService.get();
    const returnDate = newDate.getDate() + options.returnDate;
    dto.returnDate = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      returnDate,
    );

    return this.selectBookModel.create(dto);
  }

  async updateSelectBook(id: string, dto: UpdateSelectBooksDto) {
    return this.selectBookModel.findByIdAndUpdate(id, dto).exec();
  }

  async deleteSelectBook(id: string) {
    return this.selectBookModel.findByIdAndDelete(id);
  }
  async deleteSelectBookByUid(id: string) {
    return this.selectBookModel.findOneAndDelete({ id });
  }

  async deleteSelectALLBook(userId: string) {
    return this.selectBookModel.deleteMany({ user: userId });
  }
}
