import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { optionsDto } from './dto/options.dto';
import { RolesGuard } from './guards/role.guard';
import { OptionsService } from './options.service';
@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}
  @Get()
  @UseGuards(RolesGuard)
  async getBooksAll() {
    return this.optionsService.get();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  async getBooksById(@Param('id', IdValidationPipe) id: string) {
    return this.optionsService.getById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  async createSelectBook(@Body() dto: optionsDto) {
    return this.optionsService.createOptions(dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  async updateSelectBook(@Body() dto: optionsDto) {
    return this.optionsService.updateOptions(dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  async deleteBook(@Param('id', IdValidationPipe) id: string) {
    return this.optionsService.deleteOptions(id);
  }
}
