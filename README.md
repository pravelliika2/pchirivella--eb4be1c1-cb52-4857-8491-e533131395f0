# Task Management System

A full-stack task management application built with **NestJS**, **Angular 18**, and **SQLite**, featuring role-based access control (RBAC), multi-tenancy, and comprehensive audit logging.

---

## 📋 Table of Contents

- [Setup Instructions](#setup-instructions)
- [Architecture Overview](#architecture-overview)
- [Data Model](#data-model)
- [Access Control Implementation](#access-control-implementation)
- [API Documentation](#api-documentation)
- [Future Considerations](#future-considerations)

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher
- **Git**: Latest version

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-system
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   # JWT Configuration
   JWT_SECRET=your-secret-key
   
   # Database Configuration
   DATABASE_URL=task-management.db
   
   # Server Configuration
   API_PORT=3000
   NODE_ENV=development
   ```

   **Security Notes:**
   - For production, generate a strong 256-bit random string for `JWT_SECRET`:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Never commit the `.env` file to version control
   - Store production secrets in secure environment variable systems

4. **Seed the Database**

   Populate the database with test data:
   ```bash
   pnpm seed
   ```

   This creates:
   - **Organization**: "Test Company" (ID: `org-test-123`)
   - **Users**:
     - Admin: `admin@test.com` / `admin123` (Role: ADMIN)
     - Manager: `manager@test.com` / `manager123` (Role: MANAGER)
     - User: `user@test.com` / `user123` (Role: USER)

### Running the Application

#### Development Mode (Both Apps)

Run both backend and frontend simultaneously:
```bash
pnpm dev
```

This starts:
- **Backend API**: http://localhost:3000
- **Frontend Dashboard**: http://localhost:4200

#### Individual Applications

**Backend API Only:**
```bash
pnpm start:api
```

**Frontend Dashboard Only:**
```bash
pnpm start:dashboard
```

#### Build for Production

**Build Backend:**
```bash
pnpm build:api
```

**Build Frontend:**
```bash
pnpm build:dashboard
```

### Accessing the Application

1. Navigate to http://localhost:4200
2. Login with any test credentials:
   - **Admin**: `admin@test.com` / `admin123`
   - **Manager**: `manager@test.com` / `manager123`
   - **User**: `user@test.com` / `user123`

---

## 🏗️ Architecture Overview

### NX Monorepo Structure

This project uses **Nx** to manage a monorepo containing both backend and frontend applications with shared code.

```
task-management-system/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── main.ts         # Application entry point
│   │   │   ├── app.module.ts   # Root module
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── tasks/          # Tasks module
│   │   │   ├── audit/          # Audit logging module
│   │   │   ├── entities/       # TypeORM entities
│   │   │   ├── guards/         # Authorization guards
│   │   │   └── scripts/        # Utility scripts (seed)
│   │   └── project.json        # Nx configuration
│   │
│   └── dashboard/              # Angular Frontend
│       ├── src/
│       │   ├── main.ts         # Application bootstrap
│       │   ├── app/
│       │   │   ├── app.component.ts
│       │   │   ├── app.routes.ts
│       │   │   ├── auth/       # Login component
│       │   │   ├── dashboard/  # Dashboard component
│       │   │   ├── guards/     # Route guards
│       │   │   ├── interceptors/ # HTTP interceptors
│       │   │   └── services/   # API services
│       │   └── styles.css      # Global styles (Tailwind)
│       └── project.json
│
├── libs/
│   ├── data/                   # Shared DTOs and Types
│   │   └── src/
│   │       └── index.ts        # Exported types
│   │
│   └── auth/                   # Shared Auth Logic (if needed)
│       └── src/
│           └── index.ts
│
├── .env                        # Environment variables
├── nx.json                     # Nx workspace configuration
├── package.json                # Dependencies and scripts
└── tsconfig.base.json          # TypeScript base config
```

### Why NX Monorepo?

1. **Code Sharing**: DTOs, interfaces, and types are shared between frontend and backend via `libs/data`
2. **Consistent Tooling**: Single dependency tree, unified build system
3. **Developer Experience**: Run both apps with one command, shared linting/formatting
4. **Type Safety**: End-to-end type checking from API to UI
5. **Scalability**: Easy to add new apps (mobile, admin portal) or libraries

### Shared Libraries

#### `@task-management/data`

Contains all shared types, DTOs, and enums:

- **DTOs**: `CreateTaskDto`, `UpdateTaskDto`, `LoginDto`, `AuthResponse`
- **Enums**: `TaskStatus`, `TaskPriority`, `Role`
- **Interfaces**: `User`, `Task`, `Organization`, `JwtPayload`

**Benefits:**
- Single source of truth for data contracts
- Compile-time validation between API and client
- Automatic refactoring across the entire codebase

---

## 📊 Data Model

### Entity Relationship Diagram

```
┌─────────────────────┐
│   Organization      │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ createdAt           │
│ updatedAt           │
└─────────┬───────────┘
          │
          │ 1:N
          │
┌─────────▼───────────┐       ┌─────────────────────┐
│      User           │       │      Task           │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ email               │◄──────┤ createdBy (FK)      │
│ password            │  1:N  │ organizationId (FK) │◄───┐
│ organizationId (FK) │───────┤ title               │    │
│ role                │       │ description         │    │
│ createdAt           │       │ status              │    │
│ updatedAt           │       │ priority            │    │
└─────────────────────┘       │ dueDate             │    │
                              │ createdAt           │    │
                              │ updatedAt           │    │
                              └─────────┬───────────┘    │
                                        │                │
                                        │ 1:N            │
                                        │                │
                              ┌─────────▼───────────┐    │
                              │   AuditLog          │    │
                              ├─────────────────────┤    │
                              │ id (PK)             │    │
                              │ organizationId (FK) │────┘
                              │ userId (FK)         │
                              │ action              │
                              │ entityType          │
                              │ entityId            │
                              │ changes             │
                              │ timestamp           │
                              └─────────────────────┘
```

### Schema Details

#### **Organization**
```typescript
{
  id: string (UUID, Primary Key)
  name: string
  createdAt: Date
  updatedAt: Date
}
```
- Represents a company/tenant
- All users and tasks belong to an organization
- Provides data isolation (multi-tenancy)

#### **User**
```typescript
{
  id: string (UUID, Primary Key)
  email: string (Unique per organization)
  password: string (bcrypt hashed)
  organizationId: string (Foreign Key → Organization)
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'USER'
  createdAt: Date
  updatedAt: Date
}
```
- **Password**: Hashed with bcrypt (10 rounds)
- **Role Hierarchy**: OWNER > ADMIN > MANAGER > USER
- **Email**: Unique within organization (not globally)

#### **Task**
```typescript
{
  id: string (UUID, Primary Key)
  organizationId: string (Foreign Key → Organization)
  createdBy: string (Foreign Key → User)
  title: string
  description: string (nullable)
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: Date (nullable)
  createdAt: Date
  updatedAt: Date
}
```
- Scoped to organization for multi-tenancy
- Status workflow: TODO → IN_PROGRESS → IN_REVIEW → DONE
- Priority levels for task triaging

#### **AuditLog**
```typescript
{
  id: number (Auto-increment, Primary Key)
  organizationId: string (Foreign Key → Organization)
  userId: string (Foreign Key → User)
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  entityType: 'TASK' | 'USER'
  entityId: string
  changes: JSON (old/new values)
  timestamp: Date
}
```
- Immutable log of all data mutations
- Captures who did what and when
- Stores diff of changes for audit trails

### Indexes

For optimal query performance:
```sql
CREATE INDEX idx_user_email ON user(email, organizationId);
CREATE INDEX idx_task_org ON task(organizationId);
CREATE INDEX idx_audit_org_timestamp ON audit_log(organizationId, timestamp DESC);
```

---

## 🔐 Access Control Implementation

### Role-Based Access Control (RBAC)

#### Role Hierarchy

```
OWNER (Level 4)
  └─ Can do everything
     └─ ADMIN (Level 3)
        └─ Can manage users, tasks, and view all data
           └─ MANAGER (Level 2)
              └─ Can create, update, and delete tasks
                 └─ USER (Level 1)
                    └─ Can only view tasks (read-only)
```

#### Permission Matrix

| Action          | OWNER | ADMIN | MANAGER | USER |
|-----------------|-------|-------|---------|------|
| View Tasks      | ✅     | ✅     | ✅       | ✅    |
| Create Tasks    | ✅     | ✅     | ✅       | ❌    |
| Update Tasks    | ✅     | ✅     | ✅       | ❌    |
| Delete Tasks    | ✅     | ✅     | ❌       | ❌    |
| View Audit Logs | ✅     | ✅     | ❌       | ❌    |
| Manage Users    | ✅     | ✅     | ❌       | ❌    |

### Implementation Details

#### 1. **JWT Authentication**

**Flow:**
```
1. User logs in → POST /auth/login
2. Backend validates credentials
3. Backend generates JWT with payload:
   {
     sub: userId,
     email: userEmail,
     role: userRole,
     organizationId: orgId,
     iat: issuedAt,
     exp: expiresAt (24h)
   }
4. Frontend stores token in localStorage
5. Frontend attaches token to all requests via HTTP interceptor
6. Backend validates token on protected routes
```

**JWT Verification Strategy** (`jwt.strategy.ts`):
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: JwtPayload) {
    return this.authService.validateJwt(payload)
  }
}
```

#### 2. **Route Protection**

**Backend Guards:**

```typescript
// Apply JWT authentication to all routes in controller
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  
  // Apply role-based authorization
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  async createTask() { ... }
}
```

**Frontend Guards:**

```typescript
// Prevent unauthenticated users from accessing routes
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService)
  const router = inject(Router)
  
  if (authService.isAuthenticated()) {
    return true
  }
  
  return router.createUrlTree(['/login'])
}
```

#### 3. **Organization-Level Isolation**

All database queries are automatically scoped to the user's organization:

```typescript
async getTasks(organizationId: string) {
  return this.taskRepository.find({
    where: { organizationId },
    order: { createdAt: 'DESC' }
  })
}
```

**Security Benefits:**
- Prevents data leakage between organizations
- No user can access another organization's data
- Even OWNER role is limited to their organization

#### 4. **Role Authorization Logic**

**Roles Guard** (`roles.guard.ts`):
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler())
    if (!requiredRoles) return true
    
    const request = context.switchToHttp().getRequest()
    const user = request.user
    
    return requiredRoles.includes(user.role)
  }
}
```

**Permission Check in Frontend:**
```typescript
canCreateTask(): boolean {
  const role = this.authService.currentUser()?.role
  return role === Role.OWNER || role === Role.ADMIN || role === Role.MANAGER
}
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication

All endpoints except `/auth/login` require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

### Endpoints

#### **POST /auth/login**

Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "f0c60951-0c2b-4b41-9fd6-c23b75f46779",
    "email": "admin@test.com",
    "organizationId": "org-test-123",
    "role": "ADMIN",
    "createdAt": "2025-12-06T05:03:31.000Z",
    "updatedAt": "2025-12-06T05:03:31.000Z"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "message": "Invalid credentials",
  "statusCode": 401
}
```

---

#### **GET /tasks**

Retrieve all tasks for the authenticated user's organization.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": "task-uuid-1",
    "organizationId": "org-test-123",
    "createdBy": "user-uuid",
    "title": "Implement authentication",
    "description": "Add JWT authentication to the API",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "dueDate": "2025-12-15T00:00:00.000Z",
    "createdAt": "2025-12-06T10:00:00.000Z",
    "updatedAt": "2025-12-06T12:00:00.000Z"
  }
]
```

**Permissions:** All roles (OWNER, ADMIN, MANAGER, USER)

---

#### **GET /tasks/:id**

Retrieve a specific task by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "task-uuid-1",
  "organizationId": "org-test-123",
  "createdBy": "user-uuid",
  "title": "Implement authentication",
  "description": "Add JWT authentication to the API",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2025-12-15T00:00:00.000Z",
  "createdAt": "2025-12-06T10:00:00.000Z",
  "updatedAt": "2025-12-06T12:00:00.000Z"
}
```

**Error (404 Not Found):**
```json
{
  "message": "Task not found",
  "statusCode": 404
}
```

**Permissions:** All roles

---

#### **POST /tasks**

Create a new task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Design database schema",
  "description": "Create ERD and define all entities",
  "status": "TODO",
  "priority": "MEDIUM",
  "dueDate": "2025-12-20T00:00:00.000Z"
}
```

**Response (201 Created):**
```json
{
  "id": "new-task-uuid",
  "organizationId": "org-test-123",
  "createdBy": "current-user-uuid",
  "title": "Design database schema",
  "description": "Create ERD and define all entities",
  "status": "TODO",
  "priority": "MEDIUM",
  "dueDate": "2025-12-20T00:00:00.000Z",
  "createdAt": "2025-12-06T14:00:00.000Z",
  "updatedAt": "2025-12-06T14:00:00.000Z"
}
```

**Permissions:** OWNER, ADMIN, MANAGER

---

#### **PUT /tasks/:id**

Update an existing task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "IN_REVIEW",
  "priority": "HIGH"
}
```

**Response (200 OK):**
```json
{
  "id": "task-uuid-1",
  "organizationId": "org-test-123",
  "createdBy": "user-uuid",
  "title": "Design database schema",
  "description": "Create ERD and define all entities",
  "status": "IN_REVIEW",
  "priority": "HIGH",
  "dueDate": "2025-12-20T00:00:00.000Z",
  "createdAt": "2025-12-06T14:00:00.000Z",
  "updatedAt": "2025-12-06T15:30:00.000Z"
}
```

**Permissions:** OWNER, ADMIN, MANAGER

---

#### **DELETE /tasks/:id**

Delete a task permanently.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true
}
```

**Error (403 Forbidden):**
```json
{
  "message": "Forbidden resource",
  "statusCode": 403
}
```

**Permissions:** OWNER, ADMIN only

---

## 🔮 Future Considerations

### 1. **Advanced Role Delegation**

**Current Limitation:** Roles are static and assigned at user creation.

**Proposed Enhancement:**
- **Dynamic Role Assignment**: Allow OWNER/ADMIN to change user roles
- **Custom Roles**: Define organization-specific roles beyond the four defaults
- **Fine-Grained Permissions**: Instead of role-based, use permission-based (e.g., `task.create`, `task.delete`)
- **Role Inheritance**: Define custom hierarchies within an organization

**Implementation Strategy:**
```typescript
// Permission-based authorization
@Permissions('task.delete')
async deleteTask() { ... }

// User can have multiple roles
user.roles = ['MANAGER', 'CUSTOM_AUDITOR']
```

---

### 2. **Production-Ready Security**

#### **JWT Refresh Tokens**

**Problem:** Long-lived access tokens increase security risk.

**Solution:**
- Issue short-lived access tokens (15 minutes)
- Issue long-lived refresh tokens (7 days)
- Refresh tokens stored in HTTP-only cookies
- Automatic token refresh on expiration

**Implementation:**
```typescript
POST /auth/refresh
{
  "refreshToken": "..."
}

Response:
{
  "access_token": "new-token",
  "expires_in": 900
}
```

#### **CSRF Protection**

**Problem:** Cross-Site Request Forgery attacks.

**Solution:**
- Implement CSRF tokens for state-changing operations
- Use SameSite cookies
- Validate Origin/Referer headers

#### **RBAC Caching**

**Problem:** Hitting database for every permission check is inefficient.

**Solution:**
- Cache user permissions in Redis with TTL
- Invalidate cache on role changes
- Use cache-aside pattern

```typescript
const permissions = await redis.get(`user:${userId}:permissions`)
if (!permissions) {
  const perms = await this.loadUserPermissions(userId)
  await redis.setex(`user:${userId}:permissions`, 3600, JSON.stringify(perms))
}
```

#### **Password Policies**

- Minimum length (12 characters)
- Complexity requirements
- Password history (prevent reuse)
- Account lockout after failed attempts
- Two-factor authentication (2FA)

---

### 3. **Scaling Permission Checks Efficiently**

#### **Problem:**
As the application grows, permission checks become a bottleneck:
- N+1 queries for nested resources
- Slow database lookups for permissions
- Complex authorization logic in multiple places

#### **Solutions:**

**a) Attribute-Based Access Control (ABAC)**
```typescript
// Instead of checking roles, check attributes
const canEdit = user.organizationId === task.organizationId &&
                (user.role === 'ADMIN' || user.id === task.createdBy)
```

**b) Policy-Based Authorization**
```typescript
@UseGuards(PoliciesGuard)
@CheckPolicies((ability) => ability.can(Action.Update, Task))
async updateTask() { ... }
```

**c) Database-Level Row Security**
```sql
-- PostgreSQL Row-Level Security
CREATE POLICY task_isolation ON tasks
  USING (organization_id = current_setting('app.current_org_id')::uuid);
```

**d) GraphQL DataLoader Pattern**
```typescript
// Batch permission checks
const loader = new DataLoader(async (taskIds) => {
  const tasks = await this.taskRepository.findByIds(taskIds)
  return tasks.map(task => this.canAccess(user, task))
})
```

---

### 4. **Additional Future Enhancements**

- **Real-time Updates**: WebSocket support for live task updates
- **File Attachments**: Upload files to tasks (S3/local storage)
- **Comments/Activity Feed**: Task discussions and notifications
- **Search & Filtering**: Full-text search on tasks
- **Reporting Dashboard**: Analytics and metrics
- **Webhooks**: Notify external systems of task changes
- **API Rate Limiting**: Prevent abuse with rate limits per user/org
- **Multi-language Support**: i18n for global teams
- **Dark Mode**: UI theme toggle
- **Export/Import**: Bulk operations via CSV/JSON

---

## 📝 License

MIT

---

## 👥 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📧 Contact

For questions or support, please contact the development team.
