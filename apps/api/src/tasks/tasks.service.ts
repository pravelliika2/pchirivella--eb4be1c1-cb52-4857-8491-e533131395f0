import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { TaskEntity } from "../entities/task.entity"
import type { CreateTaskDto, UpdateTaskDto } from "@task-management/data"
import { AuditService } from "../audit/audit.service"
import { Role } from "@task-management/data"

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    private auditService: AuditService,
  ) {}

  async getTasks(organizationId: string, userId: string, role: Role): Promise<TaskEntity[]> {
    return this.taskRepository.find({
      where: { organizationId },
      order: { createdAt: "DESC" },
    })
  }

  async getTaskById(id: string, organizationId: string, userId: string, role: Role): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id, organizationId },
    })

    if (!task) {
      throw new NotFoundException("Task not found")
    }

    if (role === Role.VIEWER) {
      throw new ForbiddenException("Insufficient permissions")
    }

    return task
  }

  async createTask(
    organizationId: string,
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<TaskEntity> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      category: createTaskDto.category || "General",
      organizationId,
    })

    const savedTask = await this.taskRepository.save(task)
    await this.auditService.logAction(userId, "CREATE_TASK", "Task", savedTask.id, organizationId)

    return savedTask
  }

  async updateTask(
    id: string,
    organizationId: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
    role: Role,
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(id, organizationId, userId, role)

    if (role === Role.VIEWER) {
      throw new ForbiddenException("Insufficient permissions")
    }

    Object.assign(task, {
      ...updateTaskDto,
      category: updateTaskDto.category || task.category,
    })

    const updatedTask = await this.taskRepository.save(task)
    await this.auditService.logAction(userId, "UPDATE_TASK", "Task", updatedTask.id, organizationId)

    return updatedTask
  }

  async deleteTask(id: string, organizationId: string, userId: string, role: Role): Promise<void> {
    const task = await this.getTaskById(id, organizationId, userId, role)
    if (role === Role.VIEWER) {
      throw new ForbiddenException("Insufficient permissions")
    }
    await this.taskRepository.remove(task)
    await this.auditService.logAction(userId, "DELETE_TASK", "Task", id, organizationId)
  }
}
