import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health.controller';
import { TripsModule } from './modules/trips/trips.module';
import { LocationsModule } from './modules/locations/locations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    TripsModule,
    LocationsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
