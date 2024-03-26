import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Min
} from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    user: string;

    @IsNotEmpty()
    @IsString()
    @Min(6)
    password: string;
}
