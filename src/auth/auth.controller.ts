import { Body, Controller, Post } from '@nestjs/common';
import { CreateCustomerDto} from './create-customer.dto'
import { AuthService } from './auth.service';
import { LoginCustomerDto } from './login-customer.dto';



@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService){
        

    }
    @Post('signup')
    async createAccount(@Body() createcustomerdto:CreateCustomerDto){
        

        this.authService.createAccount(createcustomerdto)
    }
    @Post('/signin')
    async loginAccount(@Body() logincustomerdto:LoginCustomerDto){
        this.authService.loginAccount(logincustomerdto)
    }
    
}
