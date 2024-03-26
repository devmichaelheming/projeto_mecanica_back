import { Module } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { ClientsController } from "./clients.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Client, ClientSchema } from "./entities/client.entity";
import { AuthGuard } from "src/auth/auth.guard";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule { }
