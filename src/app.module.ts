import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './auth/entity';
import { ReadingModule } from './reading/reading.module';
import { CustomerReading } from './reading/entity';
import { TariffsService } from './tariffs/tariffs.service';
import { TariffsModule } from './tariffs/tariffs.module';
import { Tariff } from './tariffs/entity';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [TypeOrmModule.forRoot(
   {
  type: 'mysql',
  host: 'bt17yhulbhdq8jyaqfb8-mysql.services.clever-cloud.com',
  port: 3306,
  username: 'u7y1hqee0qd8g9t7',
  password: 'w1iL9ob93daJhhmKZg8E',
  database: 'bt17yhulbhdq8jyaqfb8', 
  entities: [Customer, CustomerReading, Tariff],
  synchronize: true, 
}
  ), AuthModule, ReadingModule, TariffsModule, ContactModule],
  controllers: [],

  providers: [],
})
export class AppModule {}

