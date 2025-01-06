import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber } from "class-validator";

export class PaymentMethodDto{

    @IsNotEmpty()
    @IsPhoneNumber('ET')
    phoneNumber:string

    
    @IsNotEmpty()
    @IsEmail()
    email:string

    @IsNotEmpty()
    CustomerId: string
}