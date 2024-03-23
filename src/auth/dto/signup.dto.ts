import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Min,
} from "class-validator";

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @Min(6)
    password: string;
}
