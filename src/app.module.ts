import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './auth/entity';
import { ReadingModule } from './reading/reading.module';
import { CustomerReading } from './reading/entity';
import { TariffsService } from './tariffs/tariffs.service';
import { TariffsModule } from './tariffs/tariffs.module';
import { Tariff } from './tariffs/entity';

@Module({
  imports: [TypeOrmModule.forRoot({
          type:'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '',
          database: 'kotari_tracker',
          entities: [Customer, CustomerReading, Tariff],
          synchronize:true, //avoid data loss
  
  
      }), AuthModule, ReadingModule, TariffsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
