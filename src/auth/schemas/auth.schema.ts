import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
    @Prop()
    name: string;

    @Prop({ unique: [true, 'Duplicate email entered'] })
    email: string;

    @Prop()
    password: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

