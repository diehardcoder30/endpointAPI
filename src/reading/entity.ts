import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "src/auth/entity";
@Entity()
export class CustomerReading {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  
  currentReading: number;

  @Column({default: 100})
  previousReading: number;
 
  @Column({default:1, type:'int'})
  dueBill:number

  @OneToOne(() => Customer)
  @JoinColumn({ name: 'customerCustomerId' }) // Make sure this is the foreign key name
  customer: Customer;
  @Column({ nullable: true })
  recentTransaction: string;
}
