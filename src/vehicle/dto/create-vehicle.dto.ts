import { IsNotEmpty, IsString, Min, Max } from "class-validator";

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @Min(3)
  @Max(50)
  brand: string;

  @IsString()
  @IsNotEmpty()
  @Min(3)
  @Max(50)
  model: string;

  @IsString()
  @IsNotEmpty()
  @Min(3)
  @Max(50)
  yearManufacture: string;

  @IsString()
  @IsNotEmpty()
  @Min(3)
  @Max(50)
  color: string;

  @IsString()
  @IsNotEmpty()
  @Min(3)
  @Max(50)
  plate: string;

  @IsString()
  @IsNotEmpty()
  @Min(3)
  @Max(50)
  chassisNumber: string;

  @IsString()
  @IsNotEmpty()
  @Min(3)
  @Max(50)
  engineNumber: string;
}
