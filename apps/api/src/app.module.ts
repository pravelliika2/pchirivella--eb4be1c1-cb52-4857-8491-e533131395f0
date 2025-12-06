import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { AuthModule } from "./auth/auth.module"
import { TasksModule } from "./tasks/tasks.module"
import { AuditModule } from "./audit/audit.module"
import { UserEntity } from "./entities/user.entity"
import { OrganizationEntity } from "./entities/organization.entity"
import { TaskEntity } from "./entities/task.entity"
import { AuditLogEntity } from "./entities/audit-log.entity"

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "task-management.db",
      entities: [UserEntity, OrganizationEntity, TaskEntity, AuditLogEntity],
      synchronize: true,
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "24h" },
    }),
    AuthModule,
    TasksModule,
    AuditModule,
  ],
})
export class AppModule {}
