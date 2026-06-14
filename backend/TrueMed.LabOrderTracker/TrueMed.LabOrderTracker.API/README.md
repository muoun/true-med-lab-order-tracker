# Lab Order Tracker API

ASP.NET Core Web API developed as part of the True Med Lab Order Tracker technical assessment.

The API provides functionality for creating and retrieving laboratory orders with validation, filtering, SQLite persistence, and a layered architecture using Controllers, Services, and Repositories.

## Technology Stack

* ASP.NET Core 8 Web API
* Entity Framework Core
* SQLite
* Dependency Injection
* Repository Pattern
* Service Layer Architecture

## Prerequisites

Before running the application, ensure the following are installed:

* .NET 8 SDK

Verify installation:

```bash
dotnet --version
```

## How to Run

### Restore Packages

```bash
dotnet restore
```

### Apply Database Migration (if database does not exist)

```bash
dotnet ef database update
```

### Run the API

```bash
dotnet run
```

Once the application starts, the active URLs will be displayed in the console output.

Swagger UI can be accessed using the application's HTTPS URL followed by:

```text
/swagger
```

For example:

```text
https://localhost:{port}/swagger
```

The actual port may vary depending on the local development environment and launch settings.

> Note: A SQLite database file may be included for convenience. If removed, it can be recreated using `dotnet ef database update`.

## Architecture

```text
Controllers
    ↓
Services
    ↓
Repositories
    ↓
Entity Framework Core
    ↓
SQLite
```

### Responsibilities

* Controllers handle HTTP requests and responses
* Services contain validation and business rules
* Repositories manage data access
* Entity Framework Core manages persistence

## Persistence Choice

SQLite was selected because:

* Lightweight and file-based
* No separate database server required
* Easy to set up and run locally
* Suitable for technical assessments

### Trade-offs

* Not intended for large-scale production workloads
* SQL Server would be preferred for enterprise production environments

## Implemented Features

### POST /api/orders

Creates a lab order.

Validation Rules:

* Patient Name is required
* Test Type must be one of:

  * CBC
  * BMP
  * Lipid Panel
  * UA
* Priority must be:

  * Routine
  * STAT
* Collection Date cannot be in the past

### GET /api/orders

Returns all orders sorted by collection date descending.

Supports:

```text
/api/orders?priority=high
```

to return STAT orders only.

## Error Handling

* Structured validation responses
* Global exception middleware
* HTTP status code handling

