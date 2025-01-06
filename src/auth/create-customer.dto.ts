import { IsString, IsEmail, Length, IsPhoneNumber, IsNotEmpty } from "class-validator";

export class CreateCustomerDto {
    @IsString()
    name: string;

    @IsString()
    @IsNotEmpty()
    CustomerId: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8, undefined, { message: "Insert a password with length greater than 8 characters" })
    password: string;

    @IsPhoneNumber('ET')
    phoneNumber: string;

    role = 'customer'; // predefined
}
