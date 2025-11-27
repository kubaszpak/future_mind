/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { sequelize } from './sequelize';

async function bootstrap() {
  console.log('App starting...');
  await sequelize.sync({ alter: true });
  const app = await NestFactory.create(AppModule);
  app.use((req, _, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
  });
  await app.listen(process.env.PORT ?? 3000);
  console.log('App is listening on port', process.env.PORT ?? 3000);
}
bootstrap();
