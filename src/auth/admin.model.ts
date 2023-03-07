/* eslint-disable @typescript-eslint/no-empty-interface */
import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface AdminModel extends Base {}
export class AdminModel extends TimeStamps {
  @prop({ unique: true })
  login: string;

  @prop()
  password: string;
}
