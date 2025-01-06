import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CalculateDto {
  
    @IsNotEmpty()       
    @IsString()       
    customerCustomerId: string;
}
