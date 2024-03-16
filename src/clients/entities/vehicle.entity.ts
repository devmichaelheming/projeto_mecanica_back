import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type VehicleDocument = HydratedDocument<Vehicle>;

@Schema()
export class Vehicle {
  @Prop({ unique: true })
  id: string;

  @Prop()
  brand: string;

  @Prop()
  model: string;

  @Prop()
  yearManufacture: string;

  @Prop()
  color: string;

  @Prop()
  plate: string;

  @Prop()
  chassisNumber: string;

  @Prop()
  engineNumber: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
