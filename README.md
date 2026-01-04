# Modern Dashboard

A modern, responsive admin dashboard built with React 19, TypeScript, and Vite.

## Tech Stack

- **React 19** with TypeScript
- **Vite** (rolldown-vite) for fast development and builds
- **Tailwind CSS v4** for styling
- **shadcn/ui** components with Radix UI primitives
- **React Router v7** for routing
- **TanStack Query** for server state management
- **TanStack Table** for advanced data tables
- **Zustand** for client state management
- **Recharts** for data visualization
- **i18next** for internationalization (EN/TR)

## Features

- Dashboard with KPI cards and charts
- Orders management with status updates
- Products management (CRUD)
- Categories management (CRUD)
- Customers management (CRUD)
- Detail pages for all entities
- Advanced data tables with sorting, filtering, and pagination
- Responsive design with mobile card views
- Dark/Light theme support
- Multi-language support (English/Turkish)
- Protected routes with authentication
- Toast notifications

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── api/              # Mock API layer with simulated latency
├── components/
│   ├── auth/         # ProtectedRoute component
│   ├── cards/        # Mobile card components
│   ├── charts/       # Recharts wrapper components
│   ├── dashboard/    # KPI stats components
│   ├── forms/        # Profile and password forms
│   ├── layout/       # Sidebar, Header, ContentWrapper
│   ├── settings/     # Appearance and notification settings
│   ├── table/        # Reusable TanStack Table components
│   └── ui/           # shadcn/ui primitives
├── hooks/            # TanStack Query hooks
├── i18n/             # Internationalization config and locales
├── layouts/          # DashboardLayout, AuthLayout
├── lib/              # Utility functions
├── pages/            # Route page components
├── store/            # Zustand stores
└── types/            # TypeScript interfaces
```

## State Management

Zustand stores in `src/store/`:

- `useAuthStore` - Authentication state with localStorage persistence
- `useThemeStore` - Light/dark theme with localStorage persistence
- `useSidebarStore` - Sidebar collapse/mobile state

## Data Tables

Reusable table components in `src/components/table/`:

- `DataTable` - Main table component
- `DataTableColumnHeader` - Sortable column headers
- `DataTablePagination` - Page size and navigation
- `DataTableViewOptions` - Column visibility toggle
- `DataTableFilterSelect` - Dropdown filters
- `DataTableFilterRange` - Min/max numeric filters
- `DataTableFilterDateRange` - Date range filters

## Mock API

All data fetching uses mock API functions in `src/api/` that return Promises with simulated delays. Replace with real API calls by updating these functions.

## License

MIT
