# RightOn - Soldier Rights Management System

## Project Overview
This is an Nx monorepo for managing Israeli soldier benefits and rights, specifically targeting "lone soldiers" (חיילים בודדים). The system helps soldiers discover and apply for benefits they're eligible for based on their military status, housing situation, and personal circumstances.

## Architecture
- **Client** (`client/`): React + Redux + Material-UI with RTL Hebrew support
- **Backend** (`nest-backend/`): NestJS + TypeORM + PostgreSQL
- **Shared** (`libs/shared/`): Type definitions and enums shared between client and backend
- **Agent** (`agent/`): Python AI agent for data processing

## Domain Model Patterns

### Enum-First Design
All soldier classifications use strictly typed enums from `libs/shared/src/enums/`:
```typescript
// Each enum is in its own file: soldier-type.enum.ts, service-type.enum.ts, etc.
SoldierType: LONE_SOLDIER | DISTINGUISHED_LONE_SOLDIER
ServiceType: MANDATORY | PERMANENT | VOLUNTEER | DISCHARGED
HousingStatus: RENTS | OWNS | NO_HOUSE
```

### Nested-to-Flat Entity Pattern
The system uses nested DTOs/types but flattened database entities:
- **Shared types** (`libs/shared/src/types/user.type.ts`): Nested structure (personal, general, army, housing)
- **Backend entities** (`nest-backend/src/users/entities/user.entity.ts`): Flattened columns
- **Service layer** (`users.service.ts`): `flattenUser()` method transforms between representations

### Rights Eligibility System
Rights are defined with `isEligible` functions that evaluate user conditions:
```typescript
// libs/shared/src/types/right.type.ts
Right = {
  rightName: string;
  isEligible: (user: User) => boolean;
  eligibleSoldierType: SoldierType[];
  subject: RightSubject;
}
```

## Development Workflows

### Essential Commands
```bash
# Development
npm run dev:client    # Vite dev server on client
npm run dev:backend   # NestJS dev server
npm run seed          # Populate database with rights from rights.json

# Building
npm run build:all     # Build all projects
nx build client       # Build specific project
nx serve nest-backend # Serve with live reload
```

### Database Seeding
Rights data is stored in `rights.json` at root and seeded via `RightsService.setup()`. The seeding process handles conflicts by comparing existing vs new rights and logging differences.

### Testing Strategy
- Use `nx test` for running tests across all projects
- Backend tests focus on eligibility validation logic in `conditions-validations.ts`
- Client tests focus on form validation and Redux state management

## Key Conventions

### Import Patterns
Always import shared types from the barrel export:
```typescript
import { SoldierType, User, Right } from '@righton/shared';
// NOT from individual files
```

### Hebrew RTL Support
Client uses Material-UI with RTL configuration:
```typescript
// App.tsx sets up RTL theme with Hebrew direction
direction: 'rtl'
stylisPlugins: [prefixer, rtlPlugin]
```

### Entity-DTO Transformations
Backend uses `class-transformer` with `plainToClass()` for converting nested DTOs to flat entities. Service methods like `flattenUser()` handle the reverse transformation.

### Error Handling
- Use NestJS standard exceptions: `NotFoundException`, `ConflictException`
- Client uses Redux for state management with error states in slices

## Integration Points

### Shared Library Usage
The `@righton/shared` library is the contract between client and backend. Changes to shared types require coordinating updates in both applications.

### Database Schema
TypeORM entities use computed properties with `@Transform()` for derived fields like `age` and `monthsServed`. These are calculated at runtime, not stored.

### Rights Evaluation
Rights eligibility is determined server-side using the `isUserMatchingCondition()` function in `conditions-validations.ts`, which compares user data against right criteria.

When working on this codebase:
1. **Always check enum definitions** in `libs/shared/src/enums/` before adding new status types
2. **Update both nested types and flat entities** when modifying user data structure
3. **Test eligibility logic** by running seed data and verifying right assignments
4. **Maintain Hebrew RTL support** when adding new UI components
5. **Use Nx commands** for consistency across the monorepo
