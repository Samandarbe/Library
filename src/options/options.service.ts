import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { optionsDto } from './dto/options.dto';
import { OptionsModel } from './options.model';

@Injectable()
export class OptionsService {
  constructor(
    @InjectModel(OptionsModel)
    private readonly optionsModel: ModelType<OptionsModel>,
  ) {}
  async get() {
    return this.optionsModel.findOne(null).exec();
  }
  async getByRegion(region) {
    return this.optionsModel.findOne(region).exec();
  }
  async getById(id: string) {
    return this.optionsModel.findById(id).exec();
  }

  async createOptions(dto: optionsDto) {
    return this.optionsModel.findOneAndUpdate(null, dto, {
      upsert: true,
      new: true,
    });
  }

  async updateOptions(dto: optionsDto) {
    return this.optionsModel.findOneAndUpdate(null, dto, { new: true }).exec();
  }
  async deleteOptions(id: string) {
    return this.optionsModel.findByIdAndDelete(id);
  }
}
