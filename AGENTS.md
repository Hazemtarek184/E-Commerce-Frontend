# Agent Guidelines for E-Commerce-Frontend

This document provides guidelines for AI agents and developers working on this repository.

## 1. Project Overview

- **Framework:** React 19 + Vite 6.3 + TypeScript 5.8
- **UI Library:** Material UI (MUI) v7
- **State/Data Fetching:** TanStack Query v5 + Axios
- **Forms:** React Hook Form v7 + Zod v4
- **Architecture:** Feature-based structure (`src/features/<feature-name>`)

## 2. Build, Lint, and Test Commands

| Command           | Description                                      |
|-------------------|--------------------------------------------------|
| `npm install`     | Install dependencies                             |
| `npm run dev`     | Start Vite development server                    |
| `npm run build`   | Type-check (`tsc -b`) then bundle (`vite build`) |
| `npm run preview` | Preview production build locally                 |
| `npm run lint`    | Run ESLint on all `.ts` and `.tsx` files         |

### ESLint Configuration
Uses flat config (`eslint.config.js`) with `typescript-eslint`, `react-hooks`, and `react-refresh` plugins.

### Testing
**No test framework is configured.** Do NOT run `npm test`. If tests are needed, propose setting up Vitest + React Testing Library first.

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

### 3.2 Component Structure
Use functional components with `React.FC<Props>` typing and named exports:
```tsx
interface ServiceProviderCardProps {
  provider: IServiceProvider;
  onEdit: (provider: IServiceProvider) => void;
}

export const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  provider,
  onEdit,
}) => { /* implementation */ };
```

### 3.3 TypeScript Guidelines
- **Strict mode enabled** - see `tsconfig.app.json`
- **Avoid `any`** - use proper types; refactor existing `any` usage
- Shared interfaces live in `src/interfaces/index.ts`
- Use `type` imports: `import type { IServiceProvider } from "../../../interfaces"`
- API responses use `IApiResponse<T>`:
```typescript
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

### 3.4 Imports Order
1. External libraries (`react`, `@mui/*`, `axios`, `@tanstack/react-query`)
2. Internal hooks/queries (`../queries`, `../mutations`)
3. Internal components (`../components/*`)
4. Types/Interfaces (`../../../interfaces`)
5. API functions (`../api`)

### 3.5 Styling (Material UI)
- Use the `sx` prop for component-level styling
- Icons from `@mui/icons-material`
- Layout: `Box`, `Stack`, `Container`
- Use `alpha()` for transparency: `backgroundColor: alpha("#000", 0.1)`

## 4. Architecture & File Structure

### Feature Pattern (`src/features/<feature>/`)
```
src/features/<feature>/
├── api/index.ts         # Axios API calls (returns response.data)
├── components/          # Feature-scoped UI components
├── pages/               # Route-level page components
├── queries/index.ts     # useQuery hooks
├── mutations/index.ts   # useMutation hooks
├── schemas/index.ts     # Zod schemas + inferred types
└── index.ts             # Public exports
```

### Feature Index Pattern
```typescript
export { ServiceProvidersPage } from "./pages/ServiceProvidersPage";
export { useServiceProviders } from "./queries";
export { useCreateServiceProvider } from "./mutations";
export * from "./schemas";
```

### API Function Pattern
```typescript
export const getServiceProviders = async (subCategoryId: string) => {
  const response = await api.get<IApiResponse<{ serviceProviders: IServiceProvider[] }>>(
    `/service-providers/${subCategoryId}`
  );
  return response.data;  // Return data, not full response
};
```

### React Query Patterns
- Query keys: `["service-providers", subCategoryId]`
- Invalidate on mutation success: `queryClient.invalidateQueries({ queryKey: [...] })`
- Use `enabled` for conditional fetching

## 5. Error Handling
- Use React Query's `error` object for API errors
- Display with `<Typography color="error">` or `<ErrorDisplay />`
- Log errors: `console.error()`
- Form validation: Zod schemas provide error messages

## 6. Form Handling (React Hook Form + Zod)
```typescript
// schemas/index.ts
export const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
});
export type CreateInput = z.infer<typeof createSchema>;

// In component: use @hookform/resolvers/zod
```

## 7. TypeScript Compiler Options
Key settings from `tsconfig.app.json`:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `verbatimModuleSyntax: true`

## 8. Quick Reference

| Task                   | Location                                     |
|------------------------|----------------------------------------------|
| Add interface          | `src/interfaces/index.ts`                    |
| Add feature API        | `src/features/<feature>/api/index.ts`        |
| Add query hook         | `src/features/<feature>/queries/index.ts`    |
| Add mutation hook      | `src/features/<feature>/mutations/index.ts`  |
| Add Zod schema         | `src/features/<feature>/schemas/index.ts`    |
| Add reusable component | `src/components/common/`                     |
| Add feature component  | `src/features/<feature>/components/`         |

## 9. Git Guidelines
- Write clear, descriptive commit messages
- Place code in appropriate feature directories
- Do NOT commit API keys or secrets
