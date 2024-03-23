import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { SignInDto } from "./dto/signin.dto";
import { AuthGuard } from "./auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/signup')
    signUp(@Body() signUnDto: SignUpDto): Promise<{ access_token: string }> {
        return this.authService.signUp(signUnDto)
    }

    @Get('/signin')
    signIn(@Body() signInDto: SignInDto): Promise<{ access_token: string }> {
        return this.authService.signIn(signInDto);
    }

    @UseGuards(AuthGuard)
    @Get('/profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
