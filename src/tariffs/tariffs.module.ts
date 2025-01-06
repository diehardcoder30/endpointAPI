import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tariff } from './entity';
import { TariffsService } from './tariffs.service';

@Module({
    imports: [TypeOrmModule.forFeature([Tariff])],
    exports:[TariffsService],
    
    providers: [TariffsService]
})
export class TariffsModule {
   
}
