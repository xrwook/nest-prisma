import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 배치 작업 상태 로깅
   */
  logBatchJob(
    jobName: string,
    status: 'START' | 'SUCCESS' | 'ERROR' | 'INFO',
    message?: string,
  ) {
    this.logger.log(`[${jobName}] ${status}: ${message || ''}`);
  }

  /**
   * 데이터베이스 연결 상태 확인
   */
  async checkDatabaseConnection(): Promise<'healthy' | 'error'> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'healthy';
    } catch (error) {
      this.logger.error('Database connection check failed:', error);
      return 'error';
    }
  }
}
