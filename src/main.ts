import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
// import { AxiosExceptionFilter } from './common/filters/axios-exception.filter';
import { CustomLogger } from './common/logger/custom.logger';
// import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
  require('events').EventEmitter.defaultMaxListeners = 100;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new CustomLogger(),
  });
  const logger = new Logger('Bootstrap');

  // 환경 설정 확인 로그
  logger.log(`Environment: ${process.env.ENVIRONMENT}`);
  logger.log(`Database URL: ${process.env.DATABASE_URL ? 'Loaded' : 'Missing'}`);

  // 정적 파일 제공 설정 (WebSocket 테스트 HTML)
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  // 글로벌 context path 설정
  app.setGlobalPrefix('api/backend');

  // body parser 설정 (요청 크기 제한 늘리기)
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));

  // CORS 설정
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('백엔드 API 문서')
    .setVersion('1.0')
    .addTag('users', 'User 관련 API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT', // 이 이름을 컨트롤러에서 사용
    )
    .build();

  // swagger 설정 적용
  const document = SwaggerModule.createDocument(app, config);
  // 모든 태그를 기본 접힘 상태로
  SwaggerModule.setup('api/backend/docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
