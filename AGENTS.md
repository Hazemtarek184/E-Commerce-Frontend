# Agent Guidelines for E-Commerce-Frontend

This document provides guidelines for AI agents and developers working on this repository.

## 1. Project Overview

- **Framework:** React 19 + Vite 6.3 + TypeScript 5.8
- **UI Library:** Material UI (MUI) v7
- **State/Data Fetching:** TanStack Query v5 + Axios
- **Forms:** React Hook Form v7 + Zod v4
- **Date Handling:** Day.js
- **Architecture:** Feature-based structure (`src/features/<feature-name>`)

## 2. Build, Lint, and Test Commands

| Command           | Description                                      |
|-------------------|--------------------------------------------------|
| `npm install`     | Install dependencies                             |
| `npm run dev`     | Start Vite development server                    |
| `npm run build`   | Type-check (`tsc -b`) then bundle (`vite build`) |
| `npm run preview` | Preview production build locally                 |
| `npm run lint`    | Run ESLint on all `.ts` and `.tsx` files         |

### Testing status
**No test framework is configured.**
- Do **NOT** run `npm test`.
- Do **NOT** try to run single tests.
- If a task requires testing, you must first propose setting up Vitest + React Testing Library.

## 3. Code Style & Conventions

### 3.1 Naming Conventions
| Element          | Convention            | Example                          |
|------------------|-----------------------|----------------------------------|
| Component files  | PascalCase            | `ServiceProviderCard.tsx`        |
| Utility files    | camelCase             | `useServiceProviders.ts`         |
| Interfaces       | **Prefix with `I`**   | `IServiceProvider`, `IApiResponse` |
| Type aliases     | PascalCase (no `I`)   | `CreateServiceProviderInput`     |
| Variables/funcs  | camelCase             | `handleDeleteConfirm`            |
| Query keys       | Kebab-case strings    | `["service-providers", id]`      |
| Unused vars      | Prefix with `_`       | `_req`, `_event`                 |

### 3.2 Component Structure
Use functional components with `React.FC<Props>` typing and named exports.
**Avoid default exports.**

```tsx
interface ServiceProviderCardProps {
  provider: IServiceProvider;
  onEdit: (provider: IServiceProvider) => void;
}

export const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  provider,
  onEdit,
}) => {
  // Implementation
};
```

### 3.3 TypeScript Guidelines
- **Strict Mode:** Enabled (`strict: true`). Handle `null`/`undefined` explicitly.
- **No `any`:** Avoid `any` at all costs. Use `unknown` or specific types.
- **Interfaces:** Shared interfaces live in `src/interfaces/index.ts`.
- **Imports:** Use `import type` for type-only imports to aid tree-shaking.
- **API Responses:** Wrap generic types in `IApiResponse<T>`.

### 3.4 Imports Order (Manual Convention)
*Note: This is not enforced by lint, so you must follow it manually.*
1. **External libraries** (`react`, `@mui/*`, `axios`, `@tanstack/react-query`)
2. **Internal hooks/queries** (`../queries`, `../mutations`)
3. **Internal components** (`../components/*`)
4. **Types/Interfaces** (`../../../interfaces`)
5. **API functions** (`../api`)
6. **Styles/Assets** (`./styles`, images)

### 3.5 Styling (Material UI)
- **SX Prop:** Use the `sx` prop for component-level styling over `styled()` when possible.
- **Icons:** Use `@mui/icons-material`.
- **Layout:** Prefer `Stack` (flex), `Box`, and `Container` over `div`.
- **Colors:** Use theme colors or `alpha()` helper: `bgcolor: alpha(theme.palette.primary.main, 0.1)`.

## 4. Architecture & File Structure

### Feature Pattern (`src/features/<feature>/`)
Keep features self-contained.
```
src/features/<feature>/
├── api/index.ts         # Axios API calls (returns response.data)
├── components/          # Feature-scoped UI components
├── pages/               # Route-level page components
├── queries/index.ts     # useQuery hooks
├── mutations/index.ts   # useMutation hooks
├── schemas/index.ts     # Zod schemas + inferred types
└── index.ts             # Public exports (Barrel file)
```

### Feature Index Pattern
Expose only what is needed (pages, hooks, schemas) from `index.ts`.
```typescript
export { ServiceProvidersPage } from "./pages/ServiceProvidersPage";
export { useServiceProviders } from "./queries";
export * from "./schemas";
```

### API Function Pattern
Return the data directly, not the Axios response object.
```typescript
export const getServiceProviders = async (subCategoryId: string) => {
  const { data } = await api.get<IApiResponse<{ serviceProviders: IServiceProvider[] }>>(
    `/service-providers/${subCategoryId}`
  );
  return data;
};
```

### React Query Patterns
- **Keys:** Use array keys. `["entity", "action", params]`.
- **Invalidation:** Invalidate queries in `onSuccess` of mutations.
- **Conditional:** Use `enabled` option for dependent queries.

## 5. Error Handling
- **API Errors:** Handled via React Query's `isError` / `error` states.
- **UI:** Show user-friendly error messages using `Typography` (color="error") or Alert components.
- **Forms:** Zod schema validation messages are displayed via `formState.errors`.
- **Console:** Log unexpected errors to console for debugging (but `eslint` will warn, so use sparingly or disable line).

## 6. Form Handling (React Hook Form + Zod)
Combine `react-hook-form` with `@hookform/resolvers/zod`.

```typescript
// schemas/index.ts
import { z } from "zod";

export const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
});
export type CreateInput = z.infer<typeof createSchema>;

// Component usage
const { control, handleSubmit } = useForm<CreateInput>({
  resolver: zodResolver(createSchema)
});
```

## 7. TypeScript Compiler Options
Key settings from `tsconfig.app.json`:
- `strict: true`
- `noUnusedLocals: true` (use `_` prefix to ignore)
- `noUnusedParameters: true`
- `verbatimModuleSyntax: true`

## 8. Git Guidelines
- Write clear, descriptive commit messages (e.g., "feat: add service provider form").
- Place code in appropriate feature directories.
- **Security:** Do NOT commit API keys, secrets, or `.env` files.
