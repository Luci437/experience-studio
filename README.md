# Dashboard Builder

A full-stack monorepo application where Admins build custom dashboards by dragging widgets onto a grid, and Users see their assigned read-only dashboard.

## Architecture & Monorepo Structure

Refactored into a **Turborepo** + **pnpm** monorepo:

```
dashboard-builder/
├── apps/
│   ├── admin-builder/      # Admin app: build, customize, preview, and assign layouts (Port 5173)
│   └── user-dashboard/     # User app: read-only assigned layout view (Port 5174)
├── packages/
│   ├── types/              # Shared TypeScript interfaces & models (@repo/types)
│   ├── api-client/         # Axios instance, interceptors, and typed API endpoints (@repo/api-client)
│   ├── widgets/            # Core widget views, registry, and settings panel (@repo/widgets & @repo/widgets/editor)
│   ├── layout-renderer/    # Shared read-only responsive grid layout renderer (@repo/layout-renderer)
│   └── config/             # Shared Tailwind presets and TypeScript base configs (@repo/config)
├── backend/                # Spring Boot 3.2 backend (Java 17, Spring Security JWT, JPA, PostgreSQL)
├── pnpm-workspace.yaml     # pnpm workspace definition
└── turbo.json              # Turborepo task pipelines
```

## Tech Stack

- **Monorepo**: Turborepo, pnpm workspaces
- **Frontend Apps**: React 18, TypeScript, Vite, Tailwind CSS, React Router v6, react-grid-layout, Recharts, Lucide React
- **Backend**: Spring Boot 3.2, Java 17+, Spring Security (JWT), Spring Data JPA
- **Database**: PostgreSQL

---

## Quick Start

### Prerequisites
- **Java 17+** and **Maven 3.9+**
- **Node.js 18+** and **pnpm 9+** (e.g. `npm install -g pnpm`)
- **PostgreSQL** running locally

### 1. Database Setup
```bash
createdb dashboard_builder
```

### 2. Backend Setup & Run
```bash
cd backend
mvn spring-boot:run
```
Runs on `http://localhost:8080`. Seeds default accounts on first run:
- **Admin**: `admin` / `admin123`
- **User**: `user` / `user123`

### 3. Frontend Monorepo Setup & Run
From the root directory:
```bash
# 1. Install all dependencies across workspace
pnpm install

# 2. Run both apps concurrently via Turborepo
pnpm dev
```

- **Admin Builder**: [http://localhost:5173](http://localhost:5173)
- **User Dashboard**: [http://localhost:5174](http://localhost:5174)

---

## Workspace Scripts

Run from the root directory:
- `pnpm dev`: Start both `admin-builder` (port 5173) and `user-dashboard` (port 5174) in parallel
- `pnpm build`: Build all shared packages and apps
- `pnpm typecheck`: Typecheck all packages and apps with `tsc --noEmit`
- `pnpm lint`: Lint workspace projects

---

## Environment Variables

### Backend (`backend/src/main/resources/application.yml`)
| Variable | Default | Description |
|----------|---------|-------------|
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:5174` | Comma-separated list of allowed frontend origins |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/dashboard_builder` | PostgreSQL connection URL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `postgres` | Database password |
| `APP_JWT_SECRET` | `dashboard-builder-secret-key-...` | HMAC SHA256 secret key |
| `APP_JWT_EXPIRATION` | `86400000` (24h) | JWT validity duration in ms |

---

## How to Add a New Widget

Adding a new widget is clean and centralized thanks to the shared `@repo/widgets` package:

1. **Define Configuration Types (`packages/types/src/index.ts`)**:
   - Add your widget type to `WidgetType` (e.g., `'metric-gauge'`).
   - Define its config interface (e.g., `MetricGaugeConfig`) with `dataSource: DataSource`.
   - Add it to the `WidgetConfig` union.

2. **Create the View Component (`packages/widgets/src/views/`)**:
   - Create `MetricGaugeWidget.tsx`.
   - Wrap the content in `<WidgetWrapper loading={loading} error={error} isEmpty={isEmpty} onRetry={refetch}>`.
   - Fetch data using `useDataSource(config.dataSource)`.

3. **Register in Widget Renderer (`packages/widgets/src/views/WidgetRenderer.tsx`)**:
   - Add a case for your widget type returning `<MetricGaugeWidget config={widget.config} />`.

4. **Add Default Template (`packages/widgets/src/registry.ts`)**:
   - Add default sample data and appearance properties in `createDefaultConfig()`.

5. **Add Editor Controls (`packages/widgets/src/editor/WidgetSettings.tsx`)**:
   - Add appearance settings controls for your widget in the settings drawer.

6. **Add to Component Library (`apps/admin-builder/src/components/builder/WidgetLibrary.tsx`)**:
   - Add the widget template card (title, icon, default grid width/height) to `WIDGET_TEMPLATES`.
