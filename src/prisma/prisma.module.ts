import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * prisma.module.ts
 * - PrismaService  전역 모듈로 등록
 * - exports에 두 서비스를 모두 추가하여 다른 모듈에서 사용 가능
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
