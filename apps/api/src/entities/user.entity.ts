import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Role } from "@task-management/data"
import { OrganizationEntity } from "./organization.entity"

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({
    type: "varchar",
    enum: Role,
  })
  role: Role

  @ManyToOne(() => OrganizationEntity)
  organization: OrganizationEntity

  @Column()
  organizationId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
