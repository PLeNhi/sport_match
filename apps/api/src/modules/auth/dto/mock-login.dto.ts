import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class MockLoginDto {
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsOptional()
  name?: string;
}
