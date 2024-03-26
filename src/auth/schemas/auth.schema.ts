import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
    @Prop()
    name: string;

    @Prop({ unique: [true, 'Este e-mail já existe.'] })
    email: string;

    @Prop({ unique: [true, 'Este cpf já existe.'] })
    cpf: string;

    @Prop()
    password: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

