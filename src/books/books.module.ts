import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { SelectBookModule } from 'src/select-book/select-book.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { BooksController } from './books.controller';
import { BooksModel } from './books.model';
import { BooksService } from './books.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: BooksModel,
        schemaOptions: {
          collection: 'Books',
        },
      },
    ]),
    UserModule,
    SelectBookModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
