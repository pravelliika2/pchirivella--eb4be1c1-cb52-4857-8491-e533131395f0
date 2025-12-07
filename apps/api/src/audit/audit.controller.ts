import { Controller, Get, UseGuards, Req } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { RolesGuard, Roles } from "../guards/roles.guard"
import { Role } from "@task-management/data"
import { AuditService } from "./audit.service"

@Controller("audit-log")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN)
  async getAuditLogs(@Req() request: any) {
    return this.auditService.getAuditLogs(request.user.organizationId)
  }
}
