import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
  Max,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Min(3)
  @Max(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Min(3)
  @Max(100)
  surname: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}$/, {
    message: "Invalid CPF format",
  })
  cpf: string;

  @IsBoolean()
  @IsNotEmpty()
  active: boolean;
}
