import { Controller, Get, UseGuards, Req } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { UsersService } from "./users.service"
import { RolesGuard, Roles } from "../guards/roles.guard"
import { Role } from "@task-management/data"

@Controller("users")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN)
  async listOrganizationUsers(@Req() request: any) {
    const users = await this.usersService.findByOrganization(request.user.organizationId)
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
    }))
  }
}
