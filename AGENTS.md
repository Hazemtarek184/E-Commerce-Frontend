# Agent Guidelines for E-Commerce-Frontend

This document contains guidelines for AI agents and developers working on this repository.

## 1. Project Overview

*   **Framework:** React 19 + Vite 6.3 + TypeScript 5.8
*   **UI Library:** Material UI (MUI) v7
*   **State/Data Fetching:** TanStack Query (React Query) + Axios
*   **Forms:** React Hook Form + Zod
*   **Architecture:** Feature-based structure (`src/features/<feature-name>`)

## 2. Build, Lint, and Test Commands

### Build & Run
*   **Install Dependencies:** `npm install`
*   **Start Development Server:** `npm run dev`
*   **Build for Production:** `npm run build` (Runs `tsc` then `vite build`)
*   **Preview Production Build:** `npm run preview`

### Linting
*   **Run Linter:** `npm run lint`
    *   Uses ESLint 9 with a flat configuration (`eslint.config.js`).
    *   Plugins: `typescript-eslint`, `react-hooks`, `react-refresh`.

### Testing
*   **Status:** There are currently **no** test scripts configured in `package.json`.
*   **Action:** Do not attempt to run `npm test` or `npm run test`. If asked to write tests, you must first propose setting up a test environment (e.g., Vitest + React Testing Library) to the user.

## 3. Code Style & Conventions

### 3.1 Naming Conventions
*   **Files:**
    *   Components: PascalCase (e.g., `ServiceProvidersPage.tsx`, `ServiceProviderCard.tsx`).
    *   Utilities/Hooks/API: camelCase (e.g., `api.ts`, `useServiceProviders.ts`).
*   **Interfaces:**
    *   **Crucial:** Prefix interfaces with `I`. (e.g., `IServiceProvider`, `IMainCategory`, `IApiResponse`).
*   **Variables & Functions:** camelCase (e.g., `handleDeleteConfirm`, `searchQuery`).
*   **Components:** PascalCase.

### 3.2 Component Structure
*   **Definition:** Use Functional Components.
*   **Typing:** Use `React.FC<PropsInterface>` explicitly.
*   **Props:** Define a specific interface for props, named `<ComponentName>Props`.

```tsx
interface ServiceProviderCardProps {
  provider: IServiceProvider;
  onEdit: (provider: IServiceProvider) => void;
}

export const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ 
  provider, 
  onEdit 
}) => {
  // ...
};
```

### 3.3 TypeScript & Types
*   **Location:** Shared interfaces are located in `src/interfaces/index.ts`.
*   **API Responses:** Wrap API responses in the `IApiResponse<T>` generic interface.
    ```typescript
    export interface IApiResponse<T> {
        success: boolean;
        data?: T;
        message?: string;
        error?: string;
    }
    ```
*   **Avoid:** `any`. Use strict typing.

### 3.4 Styling (Material UI)
*   **Primary Method:** Use the `sx` prop on MUI components for local styling.
*   **Icons:** Import from `@mui/icons-material`.
*   **Layout:** Use `Box`, `Stack`, `Grid2` (if available), or `Container` for layout.

```tsx
<Box sx={{ display: 'flex', gap: 2, p: 4, backgroundColor: 'background.paper' }}>
  <Typography variant="h4">Title</Typography>
</Box>
```

### 3.5 Imports & Exports
*   **Order:**
    1.  External libraries (`react`, `@mui/*`, `axios`).
    2.  Internal hooks/queries (`../queries`, `../mutations`).
    3.  Internal components (`../components/*`).
    4.  Types/Interfaces (`../../../interfaces`).
    5.  API functions (`../../../api`).
*   **Exports:** Named exports are preferred for components in features (e.g., `export const ServiceProvidersPage`). Default exports are used for lazy-loaded pages or the main `App`.

## 4. Architecture & File Structure

### Feature Pattern (`src/features/`)
Organize code by domain feature. Each feature folder should contain:
*   `api/`: API calls specific to the feature.
*   `components/`: UI components scoped to the feature.
*   `pages/`: Route-level components.
*   `queries/` & `mutations/`: React Query hooks.
*   `schemas/`: Zod validation schemas.
*   `index.ts`: Public API of the feature.

### API Handling (`src/api.ts` or feature `api/`)
*   Use the configured `axios` instance.
*   API functions should be `async` and return `response.data`.
*   Handle `FormData` manually for file uploads (as seen in `createServiceProvider`).

## 5. Error Handling
*   **API Errors:** Catch errors in `try/catch` blocks within `useEffect` or use the `error` object from React Query.
*   **UI Feedback:** Display errors using `Typography` with `color="error"` or specialized error components. Log errors to console (`console.error`).

## 6. Git & Commit Guidelines
*   Write clear, descriptive commit messages.
*   When creating new files, ensure they are added to the correct feature directory if applicable.

## 7. Rules from Other Configurations
*   **ESLint:** Respect the rules defined in `eslint.config.js` (React Hooks, Refresh).
*   **Prettier:** Formatting should be consistent with standard Prettier defaults (2 spaces indentation, semicolons, single quotes preferred in some existing files but consistent usage is key).
