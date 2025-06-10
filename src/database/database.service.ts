import { Injectable, OnModuleInit } from '@nestjs/common';
import * as sql from 'mssql';
import { dbConfig } from '../config/database.config';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: sql.ConnectionPool | null = null;

  async onModuleInit(): Promise<void> {
    try {
      this.pool = await sql.connect(dbConfig);
      console.log('✅ Connected to SQL Server');
    } catch (error) {
      console.error('❌ Failed to connect to DB:', error);
    }
  }

  getPool(): sql.ConnectionPool {
    if (!this.pool) {
      throw new Error('Database connection not initialized');
    }
    return this.pool;
  }
}

