import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import axios from 'axios';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './common/interceptors/user-interceptor';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [
    // 환경 설정 모듈
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'development' ? '.env' : '.env.prod',
      isGlobal: true, // 전역으로 사용
    }),
    // 캐시 모듈 설정 (인메모리 캐시)
    CacheModule.register({
      ttl: 300, // 기본 TTL: 5분 (초 단위)
      max: 1000, // 최대 캐시 아이템 수
      isGlobal: true, // 전역으로 사용
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    BatchModule,
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
      headers: {},
    }),
  ],
  providers: [
    // PrismaService,
    // 글로벌 인터셉터 등록
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
  ],
})
export class AppModule {
  private static interceptorsRegistered = false;

  constructor() {
    // axios 인터셉터는 한 번만 등록
    if (!AppModule.interceptorsRegistered) {
      this.setupAxiosInterceptors();
      AppModule.interceptorsRegistered = true;
    }
  }

  private setupAxiosInterceptors() {
    // 요청 인터셉터
    axios.interceptors.request.use((config) => {
      if (process.env.ENVIRONMENT !== 'production') {
        Logger.debug(`Request: ${config.method?.toUpperCase()} ${config.url}`);
        Logger.debug(`Request Params: ${JSON.stringify(config.params)}`);
      }
      return config;
    });

    // 응답 인터셉터
    axios.interceptors.response.use(
      (response) => {
        if (process.env.ENVIRONMENT !== 'production') {
          Logger.debug('Response Data:', response.data);
        }
        return response;
      },
      (error: unknown) => {
        if (process.env.ENVIRONMENT !== 'production') {
          const axiosError = error as { response?: { status?: number; data?: unknown } };
          Logger.error(`Response Error: ${axiosError.response?.status || 'Unknown'} `);
        }
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  }
}
