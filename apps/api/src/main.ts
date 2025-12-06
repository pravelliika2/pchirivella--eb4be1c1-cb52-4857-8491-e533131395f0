import "reflect-metadata"
import { config } from "dotenv"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

// Load environment variables from .env file
config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()

  const port = process.env.API_PORT || 3000
  await app.listen(port)
  console.log(`API running on http://localhost:${port}`)
  console.log(`JWT Secret: ${process.env.JWT_SECRET ? "✓ Loaded from .env" : "⚠ Using default (insecure)"}`)
}

bootstrap()
