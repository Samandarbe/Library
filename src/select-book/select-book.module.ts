import { Module } from '@nestjs/common';
import { SelectBookService } from './select-book.service';
import { SelectBookController } from './select-book.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { SelectBookModel } from './select-book.model';
import { OptionsModule } from 'src/options/options.module';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: SelectBookModel,
        schemaOptions: {
          collection: 'SelectBook',
        },
      },
    ]),
    OptionsModule,
  ],
  providers: [SelectBookService],
  controllers: [SelectBookController],
  exports: [SelectBookService],
})
export class SelectBookModule {}
