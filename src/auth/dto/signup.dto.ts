import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    Min,
} from "class-validator";


export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}$/, {
        message: "Invalid CPF format",
    })
    cpf: string;

    @IsNotEmpty()
    @IsString()
    @Min(6)
    password: string;
}
