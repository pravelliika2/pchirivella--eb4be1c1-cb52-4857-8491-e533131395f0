import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Role } from "@task-management/data"

export interface OrganizationUser {
  id: string
  email: string
  role: Role
}

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private readonly API_URL = "http://localhost:3000/users"

  constructor(private http: HttpClient) {}

  getOrganizationUsers(): Observable<OrganizationUser[]> {
    return this.http.get<OrganizationUser[]>(this.API_URL)
  }
}
