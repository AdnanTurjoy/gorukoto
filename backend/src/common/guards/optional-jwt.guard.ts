import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import type { JwtPayload } from '../../auth/strategies/jwt.strategy';

/**
 * Allows the request through whether or not a JWT is supplied. When a valid
 * `Authorization: Bearer …` header is present, attaches `req.user`; otherwise
 * the controller sees `req.user === undefined`.
 */
@Injectable()
export class OptionalJwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers?.authorization;
    if (auth?.startsWith('Bearer ')) {
      try {
        const payload = await this.jwt.verifyAsync<JwtPayload>(auth.slice(7));
        (req as unknown as { user: unknown }).user = {
          id: payload.sub,
          email: payload.email,
          role: payload.role,
        };
      } catch {
        // Invalid / expired token → treat as anonymous.
      }
    }
    return true;
  }
}
