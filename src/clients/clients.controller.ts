import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { Client } from "./entities/client.entity";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";

@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll(): Promise<Client[]> {
    return this.clientsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  delete(@Param("id") id) {
    return this.clientsService.delete(id);
  }

  @Get(":clientId/vehicles")
  getVehiclesOfClient(@Param("clientId") clientId: string) {
    return this.clientsService.getVehiclesOfClient(clientId);
  }

  @Post(":clientId/vehicles")
  async addVehicleToClient(
    @Param("clientId") clientId: string,
    @Body() createVehicleDto: CreateVehicleDto
  ) {
    return this.clientsService.addVehicleToClient(clientId, createVehicleDto);
  }

  @Patch(":clientId/vehicles/:vehicleId")
  async updateVehicleOfClient(
    @Param("clientId") clientId: string,
    @Param("vehicleId") vehicleId: string,
    @Body() updateVehicleDto: UpdateVehicleDto
  ) {
    return this.clientsService.updateVehicleOfClient(
      clientId,
      vehicleId,
      updateVehicleDto
    );
  }

  @Delete(":clientId/vehicles/:vehicleId")
  @HttpCode(HttpStatus.OK)
  deleteVehicleOfClient(
    @Param("clientId") clientId: string,
    @Param("vehicleId") vehicleId: string
  ) {
    return this.clientsService.deleteVehicleOfClient(clientId, vehicleId);
  }
}
