import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHostProfileDto {
  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @IsString()
  @IsOptional()
  bio?: string;
}

export class UpdateHostProfileDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  bio?: string;
}
