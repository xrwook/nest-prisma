import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        authServerUrl: configService.get<string>('KEYCLOAK_AUTH_SERVER_URL'),
        realm: configService.get<string>('KEYCLOAK_REALM'),
        clientId: configService.get<string>('KEYCLOAK_CLIENT_ID'),
        secret: '',
        policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
        tokenValidation: TokenValidation.OFFLINE,
        useNestLogger: false,
      }),
      inject: [ConfigService],
    }),
    // KeycloakConnectModule.register({
    //   authServerUrl: process.env.KEYCLOAK_AUTH_SERVER_URL,
    //   realm: process.env.KEYCLOAK_REALM,
    //   clientId: process.env.KEYCLOAK_CLIENT_ID,
    //   secret: '',
    //   policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
    //   tokenValidation: TokenValidation.OFFLINE, // ONLINE에서 OFFLINE으로 변경
    //   // logLevels: ['fatal'],
    //   useNestLogger: false, // NestJS Logger 사용 xxx
    // }),
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: ResourceGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RoleGuard,
    },
  ],
  exports: [KeycloakConnectModule],
})
export class KeycloakModule {}
