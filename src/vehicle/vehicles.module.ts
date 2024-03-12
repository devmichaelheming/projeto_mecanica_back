import { Module } from "@nestjs/common";
import { VehiclesService } from "./vehicles.service";
import { VehiclesController } from "./vehicles.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { VehicleSchema, Vehicle } from "./entities/vehicle.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehicleModule {}
