import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { UserEntity } from "./user.entity"
import { OrganizationEntity } from "./organization.entity"

@Entity("audit_logs")
export class AuditLogEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => UserEntity)
  user: UserEntity

  @Column()
  userId: string

  @Column()
  action: string

  @Column()
  resource: string

  @Column()
  resourceId: string

  @ManyToOne(() => OrganizationEntity)
  organization: OrganizationEntity

  @Column()
  organizationId: string

  @CreateDateColumn()
  timestamp: Date
}
