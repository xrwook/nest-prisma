/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/db-client';
/**
 * prisma.service.ts
 * - PrismaClient를 상속받아 NestJS에서 사용할 수 있도록 래핑
 * - onModuleInit()에서 DB 연결 설정
 * - onModuleDestroy()에서 DB 연결 해제
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      Logger.error('DATABASE_URL is not defined in environment variables');
      throw new Error('DATABASE_URL is required');
    }

    const pool = new Pool({
      connectionString: dbUrl,
    });
    super({
      adapter: new PrismaPg(pool),
    });
    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      Logger.log('✅ Prisma connected to the database');
    } catch (error) {
      Logger.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
    Logger.log('Prisma disconnected from the database');
  }
}
