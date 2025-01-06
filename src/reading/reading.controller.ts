import { Body, Controller, Post } from '@nestjs/common';
import { ReadingService } from './reading.service';
import {ReadingDto} from './reading.dto'
import { CalculateDto } from './calculate.dto';
import { PaymentMethodDto } from './payment.dto';

@Controller()
export class ReadingController {
    constructor(private readonly readingService: ReadingService, ){}
    @Post('reading')
    async TakeReading(@Body() readingdto:ReadingDto){

         this.readingService.TakeReading(readingdto)
    }
    @Post('calculate')

    async calculateTariff(@Body() calculatedto: CalculateDto):Promise<any>{
        this.readingService.calculateTariff(calculatedto)
    }
    @Post('payment')
    async PaymentMethod(@Body() paymentdto: PaymentMethodDto){
        this.readingService.PaymentMethod(paymentdto)
    }
}

