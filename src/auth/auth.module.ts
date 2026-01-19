import { Global, Module } from '@nestjs/common';
import { KeycloakModule } from './keycloak.module';
import { UserContextService } from './user-context.service';

@Global() // 글로벌 모듈로 설정
@Module({
  imports: [KeycloakModule],
  providers: [UserContextService],
  exports: [UserContextService, KeycloakModule],
})
export class AuthModule {}
