# Backend Architecture

> **Project:** Automobile Spare Parts Management System
>
> **Backend Stack:** Node.js, Express.js, PostgreSQL, Sequelize
>
> **Architecture Style:** Layered Architecture (Controller → Service → Repository)
>
> **Version:** 1.0.0

---

# 1. Introduction

## Purpose

This document describes the architecture, design principles, coding standards, and development workflow of the backend application for the Automobile Spare Parts Management System.

Its purpose is to provide a single source of truth for developers working on the project, ensuring consistency, maintainability, and scalability as the application evolves.

---

## Goals

The backend has been designed with the following goals:

- Scalability
- Maintainability
- Clean Architecture
- Separation of Concerns
- Reusability
- Readability
- Consistent API Design
- Production Readiness

The application is intentionally structured so that new business modules can be added without requiring changes to the existing architecture.

---

## Architecture Philosophy

This project follows several core principles.

### 1. Separation of Concerns

Each layer has a single responsibility.

- Routes handle HTTP routing.
- Controllers handle requests.
- Services contain business logic.
- Repositories communicate with the database.
- Shared utilities are centralized.

No layer should perform the responsibility of another layer.

---

### 2. Configuration First

Application configuration should never be hardcoded.

All configurable values such as:

- Server Port
- Database Connection
- Logger Configuration
- Environment
- API Prefix

are centralized inside the `config` directory.

---

### 3. Reusable Components

Common functionality is implemented once and reused throughout the application.

Examples include:

- Logger
- API Response
- Error Handling
- Middleware
- Helpers

---

### 4. Consistent API Design

Every API should follow the same response format.

Success Response

```json
{
    "success": true,
    "message": "Operation completed successfully.",
    "data": {}
}
```

Error Response

```json
{
    "success": false,
    "message": "Something went wrong.",
    "errors": null
}
```

This consistency simplifies frontend integration and improves developer experience.

---

### 5. Build Only What Is Needed

The project intentionally avoids unnecessary abstractions.

Folders, classes, and components are introduced only when there is a clear requirement.

This keeps the project simple while allowing it to evolve naturally.

---

# 2. Technology Stack

| Technology        | Purpose                       |
| ----------------- | ----------------------------- |
| Node.js           | JavaScript Runtime            |
| Express.js        | Web Framework                 |
| PostgreSQL        | Relational Database           |
| Sequelize         | ORM                           |
| Swagger (OpenAPI) | API Documentation             |
| Helmet            | Security Headers              |
| CORS              | Cross-Origin Resource Sharing |
| Morgan            | HTTP Request Logging          |
| dotenv            | Environment Variables         |
| ESLint            | Code Quality                  |
| Prettier          | Code Formatting               |
| Husky             | Git Hooks                     |
| lint-staged       | Pre-Commit Checks             |
| Commitlint        | Commit Message Validation     |
| Commitizen        | Conventional Commits          |
| GitHub Actions    | Continuous Integration        |

---

# 3. High-Level Architecture

The backend follows a layered architecture where every request passes through a predictable pipeline.

```
                Client
                   │
                   ▼
             Express Server
                   │
                   ▼
             Global Middleware
                   │
                   ▼
                 Routes
                   │
                   ▼
              Controllers
                   │
                   ▼
                Services
                   │
                   ▼
             Repositories
                   │
                   ▼
              PostgreSQL
```

Each layer is responsible for exactly one concern.

This separation keeps the application modular, testable, and easy to maintain.

---

## Request Flow

```
Client
   │
   ▼
Helmet
   │
   ▼
CORS
   │
   ▼
Morgan
   │
   ▼
JSON Parser
   │
   ▼
URL Encoded Parser
   │
   ▼
Routes
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Database
```

---

## Response Flow

```
Database
    │
    ▼
Repository
    │
    ▼
Service
    │
    ▼
Controller
    │
    ▼
ApiResponse
    │
    ▼
Client
```

---

## Error Flow

```
Request
    │
    ▼
Routes
    │
    ├──────────── Success
    │
    ├──────────── Route Not Found
    │                    │
    │                    ▼
    │           Not Found Middleware
    │                    │
    │                    ▼
    │             ApiResponse.error()
    │
    └──────────── Exception
                         │
                         ▼
               Global Error Handler
                         │
                         ▼
                 ApiResponse.error()
```

---

# 4. Project Structure

```
backend/
│
├── src/
│   │
│   ├── common/
│   │   ├── helpers/
│   │   ├── logger/
│   │   ├── middleware/
│   │   ├── constants/
│   │   └── validators/
│   │
│   ├── config/
│   │
│   ├── core/
│   │
│   ├── database/
│   │
│   ├── modules/
│   │
│   ├── routes/
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│
├── .env
├── .env.example
│
└── ARCHITECTURE.md
```

---

## Folder Responsibilities

### common/

Contains reusable utilities shared across the entire application.

This folder should never contain business logic.

Examples include:

- Middleware
- Logger
- Validators
- Helper functions
- Constants

---

### config/

Centralized application configuration.

Responsible for:

- Environment Variables
- Database Configuration
- Logger Configuration
- Server Configuration
- Application Configuration

No configuration should be hardcoded elsewhere.

---

### core/

Contains reusable framework-level classes.

Examples include:

- ApiResponse
- ApiError
- BaseController
- BaseService
- BaseRepository

These classes provide common functionality that can be shared across multiple modules.

---

### database/

Contains everything related to database connectivity.

Examples:

- Sequelize initialization
- Database connection
- Models
- Migrations
- Seeders

---

### modules/

Contains all business modules.

Examples:

- User
- Customer
- Supplier
- Product
- Inventory
- Invoice
- Purchase

Each module owns its own business logic.

---

### routes/

Contains application route definitions.

Routes are responsible only for routing requests to the appropriate controller.

Business logic should never be implemented inside route files.

---

### app.js

Responsible for:

- Express initialization
- Middleware registration
- Route registration
- Swagger registration
- Error middleware registration

---

### server.js

Application entry point.

Responsible for:

- Starting the HTTP server
- Logging startup information
- Registering graceful shutdown

---

# 5. Configuration Layer

## Overview

The application follows a centralized configuration approach.

All configuration values are loaded once during application startup and are accessed through a single configuration object.

```
config/
│
├── application.js
├── database.js
├── env.js
├── logger.js
├── server.js
└── index.js
```

This approach eliminates hardcoded configuration values throughout the application.

Instead of importing multiple configuration files, every component imports a single configuration object.

Example:

```javascript
const config = require('../config')

config.server.port
config.database.url
config.application.apiPrefix
```

---

## Environment Variables

Sensitive information is never stored directly in the source code.

The application uses:

- `.env`
- `.env.example`

The `.env.example` file documents all required environment variables while `.env` stores local development values.

Example variables include:

- NODE_ENV
- HOST
- PORT
- DATABASE_HOST
- DATABASE_PORT
- DATABASE_NAME
- DATABASE_USER
- DATABASE_PASSWORD
- LOG_LEVEL

---

## Configuration Modules

### application.js

Stores application-level settings.

Examples:

- Application Name
- Version
- API Prefix
- Swagger Documentation Prefix

---

### server.js

Stores HTTP server configuration.

Examples:

- Host
- Port

---

### database.js

Contains database configuration.

Future versions will include:

- PostgreSQL connection
- Sequelize options
- Connection pool configuration

---

### logger.js

Contains logger configuration.

Examples:

- Log Level
- Logger Provider

Future implementations may support:

- Winston
- Pino
- Cloud Logging

---

### env.js

Responsible for reading and validating environment variables.

This provides a single source of truth for all environment-based configuration.

---

# 6. Middleware Pipeline

The application uses a global middleware pipeline.

Each middleware performs a specific responsibility before passing the request to the next middleware.

```
Incoming Request
        │
        ▼
Helmet
        │
        ▼
CORS
        │
        ▼
Morgan
        │
        ▼
JSON Parser
        │
        ▼
URL Encoded Parser
        │
        ▼
Application Routes
        │
        ▼
Swagger
        │
        ▼
404 Middleware
        │
        ▼
Global Error Handler
```

Every middleware has a single responsibility.

---

## Helmet

Adds common HTTP security headers.

Purpose:

- Prevent common attacks
- Improve browser security

---

## CORS

Controls which origins can access the API.

Future versions will restrict origins based on environment.

---

## Morgan

Logs every incoming HTTP request.

Current implementation logs requests to the console.

Future implementations may redirect logs to:

- Winston
- Cloud Logging
- ELK Stack

---

## JSON Parser

Parses JSON request bodies.

Available through:

```javascript
req.body
```

---

## URL Encoded Parser

Parses HTML form submissions.

Supports traditional form-based requests.

---

# 7. Logger Architecture

The project uses a logger abstraction.

Instead of using:

```javascript
console.log(...)
```

the application uses:

```javascript
logger.info(...)
logger.warn(...)
logger.error(...)
logger.debug(...)
```

Current implementation:

```
common/
└── logger/
    ├── console.js
    └── index.js
```

The logger implementation is intentionally isolated.

Future migrations to Winston or Pino will only require changes inside the logger module.

No application code should depend directly on `console`.

---

# 8. API Response Standard

Every API must return a consistent response structure.

---

## Success Response

```json
{
    "success": true,
    "message": "Operation completed successfully.",
    "data": {}
}
```

---

## Error Response

```json
{
    "success": false,
    "message": "Something went wrong.",
    "errors": null
}
```

---

## ApiResponse Utility

The `ApiResponse` class centralizes response generation.

Supported methods:

- success()
- created()
- noContent()
- error()

Controllers should never call:

```javascript
res.status().json(...)
```

directly.

Instead, they should always use the `ApiResponse` helper.

This guarantees consistency across every API endpoint.

---

# 9. Error Handling

The backend uses centralized error handling.

Errors are handled by dedicated middleware rather than individual routes.

---

## Not Found Middleware

Handles requests for routes that do not exist.

Example:

```
GET /api/unknown
```

Returns:

```json
{
    "success": false,
    "message": "Route '/api/unknown' not found.",
    "errors": null
}
```

---

## Global Error Handler

Handles unexpected application errors.

Development:

Returns the actual error message to simplify debugging.

Production:

Returns a generic:

```
Internal Server Error
```

while logging the original error internally.

This prevents sensitive implementation details from being exposed to clients.

---

# 10. Swagger Documentation

## Overview

The project uses **Swagger (OpenAPI 3.0)** to provide interactive API documentation.

Swagger serves as the single source of truth for all backend endpoints, allowing developers, testers, and frontend teams to explore and test APIs without additional documentation.

The documentation is available at:

```
/api/docs
```

---

## Benefits

- Interactive API documentation
- Request and response examples
- Endpoint discovery
- Easier frontend integration
- Improved developer experience

---

## Documentation Strategy

Every new endpoint added to the application must include Swagger documentation.

The recommended development workflow is:

1. Create Route
2. Implement Controller
3. Implement Service
4. Return ApiResponse
5. Add Swagger Documentation

This ensures documentation always stays synchronized with the implementation.

---

# 11. Graceful Shutdown

## Overview

The application supports graceful shutdown.

Instead of immediately terminating the process, the server first stops accepting new requests and completes existing requests before shutting down.

---

## Benefits

- Prevents interrupted requests
- Prevents resource leaks
- Allows database connections to close safely
- Supports future background jobs and queues

---

## Current Flow

```
SIGINT / SIGTERM
        │
        ▼
Graceful Shutdown
        │
        ▼
Close HTTP Server
        │
        ▼
Exit Process
```

---

## Future Improvements

Future versions will also close:

- PostgreSQL Connection
- Redis Connection
- Queue Workers
- Scheduler Jobs
- External Services

before exiting the application.

---

# 12. Module Architecture

Business features are organized inside the **modules** directory.

Example:

```
modules/
│
├── customer/
├── supplier/
├── product/
├── inventory/
├── purchase/
├── invoice/
└── user/
```

Each module owns its own business logic.

---

## Layered Architecture

Each business module follows the same layered architecture.

```
Controller
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
Database
```

---

### Controller

Responsibilities:

- Receive HTTP Requests
- Validate Input
- Call Services
- Return ApiResponse

Controllers should remain thin.

Business logic should never be implemented inside controllers.

---

### Service

Responsibilities:

- Business Rules
- Validation
- Transactions
- Coordination between repositories

Services contain the application's business logic.

---

### Repository

Responsibilities:

- Database Queries
- CRUD Operations
- Sequelize Communication

Repositories isolate database logic from the business layer.

---

# 13. Coding Standards

## General Principles

The project follows several coding principles.

- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- Consistency over Cleverness
- Readability First

---

## Naming Conventions

### Files

```
customer.controller.js
customer.service.js
customer.repository.js
customer.routes.js
```

---

### Variables

camelCase

Example:

```javascript
customerId
invoiceNumber
purchaseOrder
```

---

### Classes

PascalCase

Example:

```javascript
CustomerService
InvoiceRepository
ApiResponse
```

---

### Constants

UPPER_SNAKE_CASE

Example:

```javascript
DEFAULT_PAGE_SIZE
MAX_RETRY_COUNT
```

---

## Folder Rules

- Business logic belongs inside Services.
- Database queries belong inside Repositories.
- Routes only define endpoints.
- Shared utilities belong inside common.
- Configuration belongs inside config.
- Framework-level reusable classes belong inside core.

---

# 14. Git Workflow

The project follows a Git Flow inspired branching strategy.

```
main
 │
 ▼
develop
 │
 ├──────── feature/backend-foundation
 │
 ├──────── feature/database-foundation
 │
 ├──────── feature/customer-module
 │
 └──────── feature/inventory-module
```

---

## Branch Naming

```
feature/<feature-name>
```

Examples:

```
feature/backend-foundation

feature/database-foundation

feature/customer-module
```

---

## Workflow

1. Create feature branch from develop
2. Implement feature
3. Commit using Conventional Commits
4. Push feature branch
5. Create Pull Request
6. Merge into develop
7. Delete feature branch
8. Repeat

Only stable code should be merged into develop.

Production-ready releases are merged from develop into main.

---

# 15. Future Roadmap

The backend will evolve incrementally through future sprints.

---

## Sprint 3

- PostgreSQL
- Sequelize
- Database Configuration
- User Module
- Authentication
- JWT

---

## Sprint 4

- Customer Module
- Supplier Module
- Product Module

---

## Sprint 5

- Inventory
- Purchase Orders
- Invoice Management

---

## Sprint 6

- Role Based Access Control (RBAC)
- Audit Logs
- Dashboard APIs

---

## Sprint 7

- Reports
- Analytics
- Performance Optimization
- Caching

---

# 16. Architecture Decisions

The following architectural decisions guide this project.

- Centralized configuration
- Layered architecture
- Thin controllers
- Business logic in services
- Database abstraction through repositories
- Standardized API responses
- Centralized error handling
- Logger abstraction
- Swagger-first documentation
- Graceful application shutdown
- Feature-based module organization

These decisions are intended to improve maintainability, scalability, and consistency as the project grows.

---

# Conclusion

The backend architecture has been designed to provide a scalable and maintainable foundation for the Automobile Spare Parts Management System.

By separating responsibilities into clearly defined layers, standardizing API responses, centralizing configuration, and documenting architectural decisions, the project is prepared for future growth while remaining easy to understand and extend.

This document should be treated as a living document and updated whenever significant architectural changes are introduced.
