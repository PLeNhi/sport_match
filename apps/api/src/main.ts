import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "@common/exception.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });
  const logger = new Logger("Bootstrap");

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  // SWAGGER
  const config = new DocumentBuilder()
    .setTitle("Sport Match API")
    .setDescription("API documentation for Sport Match application")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  const port = process.env.API_PORT || 3000;
  await app.listen(port);
  logger.log(
    `=============================== Server running on http://localhost:${port}/api-docs`,
  );
}

bootstrap();
