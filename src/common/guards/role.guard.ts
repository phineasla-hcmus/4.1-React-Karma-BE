import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { VaiTro } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRole(vaiTro: VaiTro[], userRole: VaiTro) {
    return vaiTro.some((vt) => vt === userRole);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const vaiTro = this.reflector.get<VaiTro[]>('role', context.getHandler());
    if (!vaiTro) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    return this.matchRole(vaiTro, user.vaiTro);
  }
}
