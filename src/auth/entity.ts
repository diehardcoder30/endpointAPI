import { Entity, Column, PrimaryColumn } from "typeorm";
@Entity()
export class Customer {
    @Column()
    name: string;
    @PrimaryColumn()
    CustomerId:string
    @Column()
    password: string
    @Column()
    email: string;
    @Column()
    phoneNumber: string
    @Column({default:'customer'})
    role: string;
}