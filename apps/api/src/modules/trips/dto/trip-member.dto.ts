import { TripRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AddTripMemberDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(TripRole)
  role!: TripRole;
}

export class UpdateTripMemberDto {
  @IsEnum(TripRole)
  role!: TripRole;
}

export class RemoveTripMemberDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;
}
