import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { UserEntity } from "../entities/user.entity"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findByOrganization(organizationId: string): Promise<UserEntity[]> {
    return this.usersRepository.find({
      where: { organizationId },
      order: { createdAt: "ASC" },
    })
  }
}
