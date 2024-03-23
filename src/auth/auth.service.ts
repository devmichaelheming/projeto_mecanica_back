import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from "@nestjs/mongoose";
import { AuthDocument, Auth } from "./schemas/auth.schema";
import { Model } from "mongoose";
import { SignUpDto } from "./dto/signup.dto";
import { SignInDto } from "./dto/signin.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Auth.name)
        private authModel: Model<AuthDocument>,
        private jwtService: JwtService,
    ) { }

    async signUp(signUpDto: SignUpDto): Promise<{ access_token: string }> {
        const { name, email, password } = signUpDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        const auth = await this.authModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = this.jwtService.sign({ id: auth._id });

        return {
            access_token: token
        }
    }

    async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
        const { email, password } = signInDto;

        const auth = await this.authModel.findOne({ email });

        if (!auth) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordMatched = await bcrypt.compare(password, auth.password);

        if (!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const token = this.jwtService.sign({ id: auth._id });

        return {
            access_token: token
        }
    }
}

