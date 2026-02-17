import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

@Module({
  imports: [PrismaModule, ExpensesModule],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}
