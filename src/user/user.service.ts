import { Injectable, UseGuards } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { OptionsService } from 'src/options/options.service';
import { SelectBookService } from 'src/select-book/select-book.service';
import { AdminModel } from '../auth/admin.model';
import { UserDto } from './dto/user.dto';
import { generateId } from './user.functions';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    @InjectModel(AdminModel) private readonly adminModel: ModelType<AdminModel>,
    private readonly optionsService: OptionsService,
    private readonly selectBookService: SelectBookService,
  ) {}

  @UseGuards(JwtAuthGuard)
  async getAllUsers(text?: string) {
    if (text) {
      const query = { $text: { $search: text } };
      return this.userModel.find(query).exec();
    }
    return this.userModel.find({}).exec();
  }

  async getUserManyBooksRead() {
    return this.userModel.find().sort({ userManyBooksRead: -1 }).exec();
  }

  async getUserById(id: string) {
    return this.userModel
      .findById(id, null)
      .populate({ path: 'readBooks selectBooks.book' })
      .exec();
  }

  @UseGuards(JwtAuthGuard)
  async createUser(dto: UserDto) {
    const id = generateId();
    dto.id = `BE-${id}`;
    return this.userModel.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  async updateUser(id: string, dto: UserDto) {
    return this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async updateManyUsers(dto: UserDto[]) {
    dto.forEach((e) => {
      const id = generateId();
      e.id = `BE-${id}`;
    });
    return this.userModel.insertMany(dto);
  }

  @UseGuards(JwtAuthGuard)
  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async addBookToSelect(id: string, bookId: string, uid: string) {
    const newDate = new Date();
    const givenDate = newDate;
    const options = await this.optionsService.get();
    const returnDay = newDate.getDate() + options.returnDate;
    const returnDate = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      returnDay,
    );
    return this.userModel.findByIdAndUpdate(
      id,
      {
        $push: {
          selectBooks: { book: bookId, returnDate, givenDate, id: uid },
        },
        $inc: { userManyBooksRead: 1 },
      },
      { new: true },
    );
  }
  async addBookToReadBooks(id: string, bookId: string) {
    const user = await this.userModel.findById(id);

    const bid = user.selectBooks.find((e: any) => e.id == bookId).book;
    await this.selectBookService.deleteSelectBookByUid(bookId);
    return this.userModel.findByIdAndUpdate(
      id,
      {
        $pull: { selectBooks: { id: bookId } },
        $push: { readBooks: bid },
      },
      { new: true },
    );
  }
}
