import {
  HttpStatus,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; //descragr
import { Request } from 'express';
import { ConfigService } from '@nestjs/config'; //descragar

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        data: null,
        error: 'Token not provided',
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(process.env.JWT_SECRET_KEY),
      });

      if (!payload.userId) {
        throw new UnauthorizedException({
          status: HttpStatus.UNAUTHORIZED,
          data: null,
          error: 'Invalid token: userId is missing',
        });
      }

      request.user = payload;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          status: HttpStatus.UNAUTHORIZED,
          data: null,
          error: 'Token has expired',
        });
      } else if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException({
          status: HttpStatus.UNAUTHORIZED,
          data: null,
          error: 'Invalid token',
        });
      } else if (err.name === 'NotBeforeError') {
        throw new UnauthorizedException({
          status: HttpStatus.UNAUTHORIZED,
          data: null,
          error: 'Token not active yet',
        });
      } else {
        throw new UnauthorizedException({
          status: HttpStatus.UNAUTHORIZED,
          data: null,
          error: 'Unauthorized',
        });
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const { token } = request.cookies.token
    return token;
  }
}
