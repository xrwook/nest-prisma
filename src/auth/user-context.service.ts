import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

export interface KeycloakUser {
  sub: string;
  preferred_username: string;
  email: string;
  given_name: string;
  family_name: string;
  name: string;
  realm_access?: {
    roles: string[];
  };
  groups?: string[];
}

interface RequestWithUser extends Request {
  user?: KeycloakUser;
}

@Injectable({ scope: Scope.REQUEST })
export class UserContextService {
  constructor(
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly prismaService: PrismaService,
  ) {}

  getCurrentUser(): KeycloakUser | null {
    return this.request.user || null;
  }

  async getUserId(): Promise<string> {
    const user = await this.prismaService.user.findUnique({
      where: { email: this.getUserEmail() || undefined },
    });
    return user?.id || '';
  }

  getUsername(): string | null {
    return this.request.user?.name || null;
  }

  getUserEmail(): string | null {
    return this.request.user?.email || null;
  }

  getUserFullName(): string | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    return (
      user.name || `${user.given_name || ''} ${user.family_name || ''}`.trim() || null
    );
  }

  getUserRoles(): string[] {
    return this.request.user?.realm_access?.roles || [];
  }

  getUserGroups(): string[] {
    return this.request.user?.groups || [];
  }

  hasRole(role: string): boolean {
    const userRoles = this.getUserRoles();
    return userRoles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some((role) => userRoles.includes(role));
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}
