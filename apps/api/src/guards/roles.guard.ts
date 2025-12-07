import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException, SetMetadata } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Role } from "@task-management/data"

const ROLE_PRIORITY: Record<Role, number> = {
  [Role.VIEWER]: 1,
  [Role.ADMIN]: 2,
  [Role.OWNER]: 3,
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>("roles", context.getHandler())
    if (!requiredRoles) {
      return true // No role requirement, allow access
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException("Insufficient permissions")
    }

    const hasRequiredRole = requiredRoles.includes(user.role as Role)

    if (!hasRequiredRole) {
      throw new ForbiddenException("Insufficient permissions")
    }

    return true
  }
}

// Decorator to specify required roles
export function Roles(...roles: Role[]) {
  return SetMetadata("roles", roles)
}
