import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './create-customer.dto';
import {LoginCustomerDto} from './login-customer.dto'
import { Customer } from './entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomerReading } from 'src/reading/entity';


@Injectable()
export class AuthService {
   
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>, private readonly jwtService:JwtService,
        @InjectRepository(CustomerReading)
        private readonly readingRepository: Repository<CustomerReading>
    ){}
    async createAccount(creatcustomerdto:CreateCustomerDto):Promise<Customer>{
        const {name, password, email, phoneNumber, CustomerId, role} = creatcustomerdto;
        const existingUser = await this.customerRepository.findOne({where: [{email}, {phoneNumber}, {CustomerId}]})
         //noted  that it is connected with an 'or' condition
       
        if(existingUser){
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDto = {
            name,
            password: hashedPassword,
            email,
            phoneNumber,
            CustomerId,
            role
        }
        console.log(creatcustomerdto)
        
        
        
        const customer = this.customerRepository.create(newDto)
        const reading = this.readingRepository.create({
            customer: customer,
            previousReading: 100,
            currentReading:0
        })
        
        await this.customerRepository.save(customer)
        await this.readingRepository.save(reading)
        return customer
    
        
        

    }
    async loginAccount(logincustomerdto:LoginCustomerDto):Promise<any>{
        
        const {CustomerId, email, password, role} = logincustomerdto
    
        const loginUser = await this.customerRepository.findOne({where:[{CustomerId}, {email}]})
        if(!loginUser){
            throw new HttpException("The user isn't signed in redirect to the signup option", HttpStatus.UNAUTHORIZED)
        }
        const isValid = await bcrypt.compare(loginUser.password, password)
        if(isValid){
            //sign jwt token
           const payload = {
              role:loginUser.role,
              email:loginUser.email
           }
           const token = this.jwtService.sign(payload)
           return {
            message:"Successfully logged in",
            token:token,
            role:loginUser.role
           }
        }
        else {
            throw new HttpException('wrong credential', HttpStatus.BAD_REQUEST)
        }
        

    }


}

