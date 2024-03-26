import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { SignInDto } from "./dto/signin.dto";
import { AuthGuard } from "./auth.guard";
import { Public } from "./metadataKeys";

export interface ResponseSignIn {
    sucesso?: boolean;
    user?: {
        name: string;
        email: string;
        access_token: string;
    }
}

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('/signup')
    signUp(@Body() signUnDto: SignUpDto): Promise<ResponseSignIn> {
        return this.authService.signUp(signUnDto)
    }

    @Public()
    @Post('/signin')
    signIn(@Body() signInDto: SignInDto): Promise<ResponseSignIn> {
        return this.authService.signIn(signInDto);
    }

    @UseGuards(AuthGuard)
    @Get('/profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
