import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb+srv://omnistack:fuMlBTSOg7nRpH5T@projeto-mecanica.gcfma9g.mongodb.net/test"
    ),
    UsersModule,
    ProductsModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
