import { Injectable, OnModuleInit } from '@nestjs/common';
import * as sql from 'mssql';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: sql.ConnectionPool;

  async onModuleInit(): Promise<void> {
    try {
  const config: sql.config = {
  server: process.env.DB_SERVER ?? '127.0.0.1',
  database: process.env.DB_DATABASE ?? 'BookCatalog',
  port: parseInt(process.env.DB_PORT ?? '1433', 10),
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: process.env.DB_INSTANCE ?? 'SQLEXPRESS',
  },
  authentication: {
    type: 'ntlm',
    options: {
      domain: '',
      userName: '',
      password: '',
    },
  },
};



      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.pool = await sql.connect(config);
      console.log('✅ Connected to SQL Server');
    } catch (error) {
      console.error('❌ Failed to connect to DB:', error);
      throw error;
    }
  }

  getPool(): sql.ConnectionPool {
    if (!this.pool) {
      throw new Error('Database not connected.');
    }
    return this.pool;
  }
}
