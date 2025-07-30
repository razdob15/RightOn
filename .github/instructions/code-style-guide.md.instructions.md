---
applyTo: '**/*.ts'
---

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

1. **File Naming:**
   - Use kebab-case for file names, e.g., `user-profile.component.ts`.
   - Enums should be named with `Enum` suffix, e.g., `soldier-type.enum.ts`.
   - Types should be named with `Type` suffix, e.g., `user.type.ts`.
   - DTOs should be named with `Dto` suffix, e.g., `user.dto.ts`.

2. **Dates Handling:**
   - Use `date-fns` wherever it helps for date handling. For example, `format(new Date(), 'yyyy-MM-dd')`.

3. **TypeScript Conventions:**
   - Prefer `type` over `interface` for defining types unless extending or implementing is required.
   - Use `strict` mode in TypeScript configuration.
   - Prefer `const` over `let` for variables that do not change.
   - Use arrow functions for callbacks and methods where appropriate.
