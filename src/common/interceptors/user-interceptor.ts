import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

interface KeycloakUser {
  sub: string;
  email: string;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
}

interface RequestWithUser {
  user?: KeycloakUser;
  url: string;
  method: string;
}

/**
 * UserInterceptor
 * - 각 요청마다 사용자 정보를 확인하고, DB에 사용자 정보가 없으면 생성
 * - 이미 존재하는 사용자는 lastLogin 필드 업데이트
 * - PrismaService를 ModuleRef를 통해 동적으로 주입하여 싱글톤 문제 해결
 * - REQUEST 스코프로 설정하여 각 요청마다 독립적인 인스턴스 생성
 */
@Injectable({ scope: Scope.REQUEST })
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly moduleRef: ModuleRef) {}
  // private isFirstRequest = true;

  async intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const contextId = ContextIdFactory.getByRequest(request);
    const user = request.user;
    const prismaService = await this.moduleRef.resolve(PrismaService, contextId, {
      strict: false,
    });

    // 제외 url
    const excludedUrls = ['runner/', 'batch/', 'aggregator/', 'mcp'];
    const isExcluded = excludedUrls.some((url) =>
      request.url.startsWith(`/api/backend/${url}`),
    );

    if (isExcluded) {
      return next.handle();
    }

    const userCount = await prismaService.user.count({
      where: { email: user?.email },
    });
    if (!userCount) {
      Logger.debug(`New user ${user?.email} created.`);
      await prismaService.user.create({
        data: {
          email: user?.email || '',
          name: user?.name || user?.name || '',
        },
      });
    } else {
      Logger.debug(`Existe User ${user?.email} lastlogin updated.`);
      await prismaService.user.update({
        where: { email: user?.email || '' },
        data: {
          lastLogin: new Date(),
        },
      });
    }

    return next.handle();
  }
}
