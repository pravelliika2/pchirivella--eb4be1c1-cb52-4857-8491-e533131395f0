import { Injectable, signal } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Router } from "@angular/router"
import type { LoginDto, AuthResponse, User } from "@task-management/data"
import type { Observable } from "rxjs"
import { tap } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  currentUser = signal<Omit<User, "password"> | null>(null)
  isAuthenticated = signal(false)
  private readonly API_URL = "http://localhost:3000"

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadUserFromStorage()
  }

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem("access_token", response.access_token)
        localStorage.setItem("user", JSON.stringify(response.user))
        this.currentUser.set(response.user)
        this.isAuthenticated.set(true)
      }),
    )
  }

  logout(): void {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    this.currentUser.set(null)
    this.isAuthenticated.set(false)
    this.router.navigate(["/login"])
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem("access_token")
    const user = localStorage.getItem("user")

    if (token && user) {
      try {
        this.currentUser.set(JSON.parse(user))
        this.isAuthenticated.set(true)
      } catch (e) {
        this.logout()
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem("access_token")
  }
}
