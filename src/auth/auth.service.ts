import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from "@nestjs/mongoose";
import { AuthDocument, Auth } from "./schemas/auth.schema";
import { Model } from "mongoose";
import { SignUpDto } from "./dto/signup.dto";
import { SignInDto } from "./dto/signin.dto";
import { ResponseSignIn } from "./auth.controller";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Auth.name)
        private authModel: Model<AuthDocument>,
        private jwtService: JwtService,
    ) { }

    async signUp(signUpDto: SignUpDto): Promise<ResponseSignIn> {
        const { name, email, cpf, password } = signUpDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        const auth = await this.authModel.create({
            name,
            email,
            cpf,
            password: hashedPassword,
        });

        const token = this.jwtService.sign({ id: auth._id });

        return {
            sucesso: true,
            user: {
                name: auth.name,
                email: auth.email,
                access_token: token,
            }
        }
    }

    async signIn(signInDto: SignInDto): Promise<ResponseSignIn> {
        const { user, password } = signInDto;

        const auth = await this.authModel.findOne({ $or: [{ email: user }, { cpf: user }] });

        if (!auth) {
            throw new UnauthorizedException('O E-mail/CPF ou senha estão incorretos.');
        }

        const isPasswordMatched = await bcrypt.compare(password, auth.password);

        if (!isPasswordMatched) {
            throw new UnauthorizedException('O E-mail/CPF ou senha estão incorretos.');
        }

        const token = this.jwtService.sign({ id: auth._id });

        return {
            sucesso: true,
            user: {
                name: auth.name,
                email: auth.email,
                access_token: token,
            }
        }
    }
}

