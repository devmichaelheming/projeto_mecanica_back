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
import { Client } from "./entities/client.entity";

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
}
