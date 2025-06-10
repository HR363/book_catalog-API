import * as dotenv from 'dotenv';
import * as sql from 'mssql';

dotenv.config();

export const dbConfig: sql.config = {
  server: process.env.DB_SERVER ?? '127.0.0.1',
  port: parseInt(process.env.DB_PORT ?? '1433', 10),
  database: process.env.DB_DATABASE ?? 'BookCatalog',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: process.env.DB_INSTANCE ?? 'SQLEXPRESS', 
  },
  authentication: {
    type: 'ntlm',
    options: {
      domain: 'desktop-8k8r84c',
      userName: 'user',
      password: 'B/17/363',
    },
  },
};
