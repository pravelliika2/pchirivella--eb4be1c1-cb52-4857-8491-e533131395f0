import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { AuditLogEntity } from "../entities/audit-log.entity"

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private auditRepository: Repository<AuditLogEntity>,
  ) {}

  async logAction(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    organizationId: string,
  ): Promise<void> {
    const log = this.auditRepository.create({
      userId,
      action,
      resource,
      resourceId,
      organizationId,
    })
    await this.auditRepository.save(log)

    // Basic audit output for quick visibility
    // eslint-disable-next-line no-console
    console.log("AUDIT", {
      userId,
      action,
      resource,
      resourceId,
      organizationId,
      timestamp: new Date().toISOString(),
    })
  }

  async getAuditLogs(organizationId: string): Promise<AuditLogEntity[]> {
    return this.auditRepository.find({
      where: { organizationId },
      relations: ["user"],
      order: { timestamp: "DESC" },
    })
  }
}
