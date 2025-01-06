import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Tariff {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  min: number
  @Column()
  max: number;
  @Column()
  average:number
  @Column('decimal', { precision: 10, scale: 2 })
  current_rate: number;
}
