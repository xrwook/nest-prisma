import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BatchService } from '../services/batch.service';

@Injectable()
export class ConnectionJob {
  private readonly logger = new Logger(ConnectionJob.name);

  constructor(private readonly batchService: BatchService) {}

  /**
   * Guacamole 데이터 베이스에서 커넥션 정보 가져와서 ConnectionManagement에 동기화
   */
  @Cron(CronExpression.EVERY_12_HOURS)
  async syncGuacamoleConnections() {
    if (process.env.ENVIRONMENT !== 'production') {
      return;
    }
    const jobName = 'SyncGuacamoleConnections Batch Job';
    this.batchService.logBatchJob(jobName, 'START');

    try {
      await this.batchService.checkDatabaseConnection();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.batchService.logBatchJob(jobName, 'ERROR', errorMessage);
    }
  }
}
