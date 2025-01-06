import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReadingDto } from './reading.dto';
import { Repository, DataSource } from 'typeorm';
import { CustomerReading } from './entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { TariffsService } from 'src/tariffs/tariffs.service';
import { Customer } from 'src/auth/entity';
import { CalculateDto } from './calculate.dto';
import { v4 as uuidv4 } from 'uuid';
import { PaymentMethodDto } from './payment.dto';

@Injectable()
export class ReadingService {
  constructor(
    @InjectRepository(CustomerReading)
    private readonly readingRepository: Repository<CustomerReading>, 
    @InjectRepository(Customer)  private readonly customerRepository: Repository<Customer>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly tariffsService: TariffsService
  ) {}

  private async findCustomerByCustomerId(customerCustomerId: string) {
    const customer = await this.customerRepository
      .findOne({ where: { CustomerId: customerCustomerId } });
    console.log(customer);

    if (!customer) {
      throw new HttpException("Customer not found", HttpStatus.NOT_FOUND);
    }
    return customer;
  }

  private async findCustomerReadingByCustomerId(customerId: string): Promise<CustomerReading | undefined> {
    return await this.readingRepository.findOne({
      where: { customer: { CustomerId: customerId } },
      relations: ['customer'],
    });
  }

  async TakeReading(readingDto: ReadingDto): Promise<any> {
    const { currentReading, customerCustomerId } = readingDto;
    const customer = await this.findCustomerByCustomerId(customerCustomerId);
    const userReading = await this.findCustomerReadingByCustomerId(customer.CustomerId);

    if (!userReading) {
      throw new HttpException("Customer reading not found", HttpStatus.NOT_FOUND);
    }

    console.log('Customer and CustomerReading Found:', customer, userReading);

    userReading.currentReading = currentReading;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(userReading);
      await queryRunner.commitTransaction();

      return {
        updatedReading: userReading.previousReading,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        "Error occurred when trying to update the database",
        HttpStatus.BAD_REQUEST
      );
    } finally {
      await queryRunner.release();
    }
  }

  async calculateTariff(calculatedto: CalculateDto): Promise<any> {
    const customer = await this.findCustomerReadingByCustomerId(calculatedto.customerCustomerId);
    console.log(customer);
    if(customer.currentReading === 0) {
        return {
            message:"No need there is not due bill"
        }
    }
    let consumption = 0;
    if (customer.previousReading > customer.currentReading) {
      const maxReading = 9999; 
      consumption = (maxReading - customer.previousReading) + customer.currentReading;
    } else {
      consumption = customer.currentReading - customer.previousReading;
      let test = await this.tariffsService.findTariffByRange(consumption);
    }
    console.log(consumption, customer.dueBill);

    let totalCost = 0;

    while (consumption > 0) {
    
      console.log("entered the loop")
      const tariff = await this.tariffsService.findTariffByRange(consumption);
      consumption -= tariff.min;
      totalCost += tariff.year_2019;
    }
     console.log("leave loop")
    customer.dueBill += Math.floor(totalCost);
    customer.previousReading = customer.currentReading;
    customer.currentReading = 0;
    if (customer.dueBill === 0) {
        return {
          message: "No due bill"
        };
      }
    await this.readingRepository.save(customer);
  }

  async PaymentMethod(paymentdto: PaymentMethodDto) {
    const uniqueCode = uuidv4();
    const { phoneNumber, email, CustomerId } = paymentdto;

    const customer = await this.findCustomerReadingByCustomerId(CustomerId);
    const amount = customer.dueBill;
    if (isNaN(amount) || amount <= 0) {
      throw new HttpException('Invalid amount', HttpStatus.BAD_REQUEST);
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer CHASECK_TEST-8lj2ZAmO4w5vqX6fUzVssI3I7Hb21WYY");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "amount": amount,
      "currency": "ETB",
      "email": email,
      "first_name": "Bilen",
      "last_name": "Gizachew",
      "phone_number": phoneNumber,
      "tx_ref": uniqueCode,
      "callback_url": "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
      "return_url": "",
      "customization[title]": "Payment for my favourite merchant",
      "customization[description]": "I love online payments",
      "meta[hide_receipt]": "true"
    });

 
    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'manual'
    });
    const result = await response.json();
    console.log(result);

   
    return this.pollPaymentStatus(uniqueCode, 18, 10000, CustomerId);
  }

  
  private async pollPaymentStatus(txRef: string, maxRetries, interval, CustomerId:string ): Promise<string> {
    let attempts = 0;
    return new Promise((resolve, reject) => {
      const poll = setInterval(async () => {
        attempts++;
        const status = await this.checkPaymentStatus(txRef, CustomerId);

        if (status === "success") {
          clearInterval(poll);
          resolve("Payment successful");
        } else if (status === "failed") {
          clearInterval(poll);
          reject("Payment failed");
        } else if (attempts >= maxRetries) {
          clearInterval(poll);
          reject("Polling timed out");
        }
      }, interval);
    });
  }

  // Step 4: Check Payment Status
  private async checkPaymentStatus(txRef: string, CustomerId): Promise<string> {
    const customer = await this.findCustomerReadingByCustomerId(CustomerId);
    const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer CHASECK_TEST-8lj2ZAmO4w5vqX6fUzVssI3I7Hb21WYY",
      },
    });

    const data = await response.json();
    console.log('Payment verification result:', data);

    if (data.status === "success") {
      customer.dueBill = 0
      await this.readingRepository.save(customer)
      return data.data.status; // 'success', 'failed', or 'pending'
    } else {
      throw new HttpException("Error verifying payment", HttpStatus.BAD_REQUEST);
    }
  }
}
