/* eslint-disable @typescript-eslint/no-empty-interface */
import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface OptionsModel extends Base {}
export class OptionsModel extends TimeStamps {
  @prop()
  region: string;

  @prop()
  returnDate: number;
}
