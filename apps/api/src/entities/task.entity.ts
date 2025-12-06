import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { TaskStatus } from "@task-management/data"
import { OrganizationEntity } from "./organization.entity"
import { UserEntity } from "./user.entity"

@Entity("tasks")
export class TaskEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column({ nullable: true })
  description: string

  @Column({ default: "General" })
  category: "Work" | "Personal" | "General"

  @Column({
    type: "varchar",
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus

  @Column({
    type: "varchar",
    enum: ["low", "medium", "high"],
    default: "medium",
  })
  priority: "low" | "medium" | "high"

  @Column({ nullable: true })
  dueDate: Date

  @ManyToOne(() => OrganizationEntity)
  organization: OrganizationEntity

  @Column()
  organizationId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
