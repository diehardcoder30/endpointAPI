import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ReadingDto {
    @IsNumber()        
    @IsNotEmpty()       
    currentReading: number;


    @IsNotEmpty()       
    @IsString()       
    customerCustomerId: string;

    
}
