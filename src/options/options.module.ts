import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { BooksModel } from 'src/books/books.model';
import { OptionsModel } from './options.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: OptionsModel,
        schemaOptions: {
          collection: 'Options',
        },
      },
    ]),
    BooksModel,
  ],
  providers: [OptionsService],
  controllers: [OptionsController],
  exports: [OptionsService],
})
export class OptionsModule {}
