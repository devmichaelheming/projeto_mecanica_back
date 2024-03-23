import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Min
} from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @Min(6)
    password: string;
}
