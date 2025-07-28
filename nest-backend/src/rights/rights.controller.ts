import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateRightDto } from './dto/create-right.dto';
import { UpdateRightDto } from './dto/update-right.dto';
import { RightsService } from './rights.service';

@Controller('rights')
export class RightsController {
  constructor(private readonly rightsService: RightsService) {}

  @Get('setup')
  @HttpCode(HttpStatus.OK)
  async setup(): Promise<void> {
    return this.rightsService.setup();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRightDto: CreateRightDto) {
    return this.rightsService.create(createRightDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  bulkCreate(@Body() createRightDtos: CreateRightDto[]) {
    return this.rightsService.bulkCreate(createRightDtos);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    if (search) {
      return this.rightsService.search(search);
    }
    return this.rightsService.findAll();
  }

  @Get('count')
  count() {
    return this.rightsService.count();
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.rightsService.findByCategory(category);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rightsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRightDto: UpdateRightDto,
  ) {
    return this.rightsService.update(id, updateRightDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rightsService.remove(id);
  }
}
