import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import {TypeOrmModule} from '@nestjs/typeorm'
import { AuthService } from './auth.service';
import { Customer } from './entity';
import { JwtModule } from '@nestjs/jwt';
import { CustomerReading } from 'src/reading/entity';



@Module({
    imports: [TypeOrmModule.forFeature([Customer, CustomerReading]),
    JwtModule.register({
        secret:'somesecretwillthinkaboutit',
        
        //no expiration of the jwt token

    })
],

    controllers: [AuthController],
    providers: [AuthService]

})
export class AuthModule {

}
