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

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}$/, {
    message: "Formato de CPF inválido.",
  })
  cpf?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}|\d{14})$/, {
    message: "Formato de CNPJ inválido.",
  })
  cnpj?: string;

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

  @IsOptional()
  @IsString()
  @Min(3)
  @Max(200)
  razaoSocial?: string;

  @IsOptional()
  @IsString()
  @Min(3)
  @Max(200)
  nomeFantasia?: string;

  @IsEmail()
  @IsNotEmpty()
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

  @IsArray()
  @IsNotEmpty()
  vehicles: CreateVehicleDto[];
}
