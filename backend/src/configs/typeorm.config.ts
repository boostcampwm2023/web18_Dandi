import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';

export const typeORMDevConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST_DEV,
  port: Number(process.env.DB_PORT_DEV),
  username: process.env.DB_USER_DEV,
  password: process.env.DB_PASS_DEV,
  database: process.env.DB_NAME_DEV,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  logging: true,
};

export const typeORMProdConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST_PROD,
  port: Number(process.env.DB_PORT_PROD),
  username: process.env.DB_USER_PROD,
  password: process.env.DB_PASS_PROD,
  database: process.env.DB_NAME_PROD,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
