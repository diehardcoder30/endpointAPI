import { IsEmail, IsNotEmpty, ValidateIf } from "class-validator";

export class LoginCustomerDto {
  @ValidateIf(o => !o.email)  
  @IsNotEmpty({ message: "Admin role" })
  CustomerId: string;

  @ValidateIf(o => !o.customerId)  // If CustomerId is not provided, email is required
  @IsEmail({}, { message: "Invalid email format." })
  email: string;

  @IsNotEmpty({ message: "Password is required." })
  password: string;
  role:string
}
