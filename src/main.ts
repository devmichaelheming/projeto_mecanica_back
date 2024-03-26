import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "https://projeto-mecanica-front.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Accept", "Content-Type", 'Authorization'],
    preflightContinue: false,
  });
  await app.listen(process.env.PORT || 4000);
}

bootstrap();
