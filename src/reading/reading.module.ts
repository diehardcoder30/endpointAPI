import { Module } from '@nestjs/common';
import { ReadingService } from './reading.service';
import { ReadingController } from './reading.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {CustomerReading} from './entity'
import { TariffsModule } from 'src/tariffs/tariffs.module';

import { Customer } from 'src/auth/entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerReading, Customer]), TariffsModule],
  providers: [ReadingService],
  
  controllers: [ReadingController]
})

export class ReadingModule {}
