import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'nest-keycloak-connect';
import { BatchService } from './services/batch.service';

@ApiTags('Batch Jobs')
@Controller('batch')
@Public()
export class BatchController {
  private readonly logger = new Logger(BatchController.name);

  constructor(private readonly batchService: BatchService) {}

  @Get('monitor/health')
  @ApiOperation({ summary: '데이터베이스 연결 상태 확인' })
  @ApiResponse({ status: 200, description: '시스템 상태 확인 완료', type: Object })
  async checkSystemHealth(): Promise<'healthy' | 'error'> {
    this.logger.log('Manual system health check requested');
    return await this.batchService.checkDatabaseConnection();
  }
}
