import { Injectable, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { Connection } from 'typeorm';
import { COFFEE_BRANDS } from './coffees-constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import coffeesConfig from './config/coffees.config';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeeBrandsFactory {
    create() {
        return ['buddy brew', 'nescafe'];
    }

}

@Module({
    imports: [
        TypeOrmModule.forFeature([Coffee, Flavor, Event]),
        ConfigModule.forFeature(coffeesConfig)
    ],
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        CoffeeBrandsFactory,
        {
            provide: COFFEE_BRANDS,
            useFactory: async (connection: Connection): Promise<string[]> => {
                // const coffeeBrands = await connection.query('SELECT * ...');
                const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe'])
                return coffeeBrands;
            },
            inject: [Connection],
        }
    ],
    exports: [CoffeesService],
})
export class CoffeesModule { }
