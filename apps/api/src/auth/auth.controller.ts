import { Controller, Post, Body } from "@nestjs/common"
import { AuthService } from "./auth.service"
import type { LoginDto, AuthResponse } from "@task-management/data"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto)
  }
}
