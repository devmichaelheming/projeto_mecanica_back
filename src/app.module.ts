import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import { ClientsModule } from "./clients/clients.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb+srv://omnistack:fuMlBTSOg7nRpH5T@projeto-mecanica.gcfma9g.mongodb.net/'),
    AuthModule,
    UsersModule,
    ProductsModule,
    ClientsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
