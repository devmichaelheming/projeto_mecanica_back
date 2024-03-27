import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
  Max,
  IsNumber,
  IsOptional,
  IsArray,
} from "class-validator";
import { CreateVehicleDto } from "./create-vehicle.dto";

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  typePerson: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsOptional()
  @IsString()
  @Min(3)
  @Max(100)
  name?: string;

  @IsOptional()
  @IsString()
  @Min(3)
  @Max(100)
  surname?: string;

  @IsNotEmpty()
  @IsString()
  @Min(3)
  @Max(200)
  razaoSocial?: string;

  @IsOptional()
  @IsString()
  @Min(3)
  @Max(200)
  nomeFantasia?: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  cellPhone: string;

  @IsBoolean()
  @IsNotEmpty()
  whatsapp: boolean;

  @IsString()
  @IsNotEmpty()
  cep: string;

  @IsString()
  @IsNotEmpty()
  rua: string;

  @IsNumber()
  @IsNotEmpty()
  numero: number;

  @IsString()
  @IsNotEmpty()
  bairro: string;

  @IsString()
  @IsNotEmpty()
  cidade: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsArray()
  @IsOptional()
  vehicles?: CreateVehicleDto[];
}
