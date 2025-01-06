import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tariff } from './entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class TariffsService {
    constructor(
        @InjectRepository(Tariff)
        private readonly tariffRepository: Repository<Tariff>,
    ) {}
    async findTariffByRange(number: number): Promise<any> {
        const [rows] = await this.tariffRepository.query(
            `
            SELECT *
            FROM tariffs
            WHERE min <= ? AND max >= ?
               OR (min <= ? AND max IS NULL)
            `,
            [number, number, number] // Bind the parameter for all three placeholders
        );
        return rows;
    }
    

    
}
