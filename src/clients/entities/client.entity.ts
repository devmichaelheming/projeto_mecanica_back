import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client {
  @Prop()
  typePerson: string;

  @Prop()
  cpf: string;

  @Prop()
  cnpj: string;

  @Prop()
  name: string;

  @Prop()
  surname: string;

  @Prop()
  razaoSocial: string;

  @Prop()
  nomeFantasia: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  cellPhone: string;

  @Prop()
  whatsapp: boolean;

  @Prop()
  cep: string;

  @Prop()
  rua: string;

  @Prop()
  numero: string;

  @Prop()
  bairro: string;

  @Prop()
  cidade: string;

  @Prop()
  estado: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
