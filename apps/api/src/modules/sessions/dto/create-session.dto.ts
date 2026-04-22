import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
} from 'class-validator';
import { SKILL_LEVELS, type SkillLevel } from '@sport-match/shared';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  venueId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  date!: string; // ISO date: YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  startTime!: string; // HH:mm

  @IsString()
  @IsNotEmpty()
  endTime!: string; // HH:mm

  @IsString()
  @IsEnum(Object.values(SKILL_LEVELS))
  @IsNotEmpty()
  skillLevel!: SkillLevel;

  @IsNumber()
  @Min(2)
  maxPlayers: number = 16;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  priceLabel?: string;
}

export class UpdateSessionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  priceLabel?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
