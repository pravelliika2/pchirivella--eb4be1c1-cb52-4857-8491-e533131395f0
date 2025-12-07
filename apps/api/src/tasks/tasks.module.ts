import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TasksService } from "./tasks.service"
import { TasksController } from "./tasks.controller"
import { TaskEntity } from "../entities/task.entity"
import { AuditModule } from "../audit/audit.module"
import { RolesGuard } from "../guards/roles.guard"

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), AuditModule],
  providers: [TasksService, RolesGuard],
  controllers: [TasksController],
})
export class TasksModule {}
