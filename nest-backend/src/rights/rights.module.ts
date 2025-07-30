import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RightsRepository } from './rights.repository';
import { RightEntity } from './entities/right.entity';
import { RightsController } from './rights.controller';
import { RightsService } from './rights.service';

@Module({
  imports: [TypeOrmModule.forFeature([RightEntity])],
  controllers: [RightsController],
  providers: [RightsService, RightsRepository],
  exports: [RightsService, RightsRepository],
})
export class RightsModule {}
