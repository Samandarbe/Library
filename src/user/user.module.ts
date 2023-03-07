import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { OptionsModule } from 'src/options/options.module';
import { SelectBookModule } from 'src/select-book/select-book.module';
import { AdminModel } from '../auth/admin.model';
import { FilesService } from './files.service';
import { UserController } from './user.controller';
import { UserModel } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: 'Users',
        },
      },
      {
        typegooseClass: AdminModel,
        schemaOptions: {
          collection: 'Admins',
        },
      },
    ]),
    ConfigModule,
    SelectBookModule,
    OptionsModule,
  ],
  controllers: [UserController],
  providers: [UserService, FilesService, ConfigService],
  exports: [UserService],
})
export class UserModule {}
