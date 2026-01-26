import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * Retrieves a required environment variable.
 * 
 * @param {string} name - The environment variable name
 * @returns {string} The environment variable value
 * @throws {Error} If the environment variable is not set or empty
 */
function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim().length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

/**
 * Prisma database service with PostgreSQL adapter.
 * 
 * Manages database connections and lifecycle hooks for the NestJS application.
 * Uses PostgreSQL connection pooling for optimal performance.
 * Automatically connects on module initialization and disconnects on destruction.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly pool: Pool;

  /**
   * Initializes the Prisma service with PostgreSQL adapter.
   * Reads database connection string from DATABASE_URL environment variable.
   */
  constructor() {
    const connectionString = mustGetEnv('DATABASE_URL');

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({ adapter });

    this.pool = pool;
  }

  /**
   * Lifecycle hook called when the module is initialized.
   * Establishes database connection.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Lifecycle hook called when the module is destroyed.
   * Closes database connection and connection pool gracefully.
   */
  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
