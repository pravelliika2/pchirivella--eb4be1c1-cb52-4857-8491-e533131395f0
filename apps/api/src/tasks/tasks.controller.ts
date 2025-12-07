import { Controller, Get, Post, Put, Delete, UseGuards, Req, Param, Body } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { TasksService } from "./tasks.service"
import { type CreateTaskDto, type UpdateTaskDto, Role } from "@task-management/data"
import { RolesGuard, Roles } from "../guards/roles.guard"

@Controller("tasks")
@UseGuards(AuthGuard("jwt"))
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(@Req() request: any) {
    return this.tasksService.getTasks(request.user.organizationId, request.user.id, request.user.role)
  }

  @Get(":id")
  async getTaskById(@Param("id") id: string, @Req() request: any) {
    return this.tasksService.getTaskById(id, request.user.organizationId, request.user.id, request.user.role)
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  async createNewTask(@Body() createTaskDto: CreateTaskDto, @Req() request: any) {
    return this.tasksService.createTask(request.user.organizationId, createTaskDto, request.user.id)
  }

  @Put(":id")
  @UseGuards(RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  async updateExistingTask(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() request: any) {
    return this.tasksService.updateTask(
      id,
      request.user.organizationId,
      updateTaskDto,
      request.user.id,
      request.user.role,
    )
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(Role.OWNER)
  async removeTask(@Param("id") id: string, @Req() request: any) {
    await this.tasksService.deleteTask(id, request.user.organizationId, request.user.id, request.user.role)
    return { success: true }
  }
}
