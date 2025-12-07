import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { CreateTaskDto, UpdateTaskDto } from "@task-management/data"
import type { Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class TasksService {
  private readonly API_URL = "http://localhost:3000/tasks"

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL)
  }

  createTask(task: CreateTaskDto): Observable<any> {
    return this.http.post<any>(this.API_URL, task)
  }

  updateTask(id: string, task: UpdateTaskDto): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, task)
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
  }
}
