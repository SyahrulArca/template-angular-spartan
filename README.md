# template-angular-spartan

Base admin template built with **Angular 21** and **[spartan/ui](https://www.spartan.ng/)**.

Includes a collapsible sidebar layout, lazy-loaded routes, dark mode, toast notifications, and a curated set of Spartan Helm components ready to customize.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Angular 21 (standalone, signals) |
| UI | spartan/ui — Brain (npm) + Helm (copied to `libs/ui/`) |
| Styling | Tailwind CSS v4, Nova theme |
| Icons | `@ng-icons/lucide` |
| Tests | Vitest via Angular CLI |

## Quick start

```bash
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200). Default route redirects to `/dashboard`.

## Documentation

See the [`docs/`](./docs/) folder:

- [Create a new page](./docs/create-page.md) — feature page walkthrough (routing, sidebar, breadcrumb)
- [Component conventions & CLI](./docs/component-conventions.md) — generator defaults, view/logic split

## Project structure

```
src/app/
├── core/services/       # Shared services (e.g. ThemeService)
├── layout/              # App shell, sidebar, header
├── features/            # Lazy-loaded feature pages
│   ├── dashboard/
│   ├── settings/
│   └── not-found/
├── app.config.ts        # Providers incl. provideSpartanHlm()
├── app.routes.ts        # Route definitions
└── app.ts               # Root component

libs/ui/                 # Helm components (owned by you, customizable)
components.json          # Spartan CLI config
.agents/skills/spartan/  # Agent skill for AI-assisted UI work
.cursor/rules/           # Cursor rules (Angular + Spartan)
```

## Installed Spartan components

Helm components live under `libs/ui/`. Import via `@spartan-ng/helm/<name>`.

Key components used in the template:

- **Layout:** sidebar, separator, sheet, skeleton, tooltip
- **Navigation:** breadcrumb, dropdown-menu
- **Content:** card, button, avatar, spinner, sonner (toast)
- **Typography, alert, alert-dialog,** and more — see `libs/ui/`

List installed components:

```bash
ng g @spartan-ng/cli:info --json
```

## Adding a Spartan component

```bash
ng g @spartan-ng/cli:ui --name=dialog
```

This copies Helm code to `libs/ui/`, installs Brain dependencies, and updates TypeScript paths.

Import in your standalone component:

```typescript
import { HlmDialogImports } from '@spartan-ng/helm/dialog';

@Component({
  imports: [HlmDialogImports],
  // ...
})
```

Register icons used in templates:

```typescript
providers: [provideIcons({ lucidePlus })],
```

## Theming & dark mode

Theme tokens are defined in `src/styles.css` (Nova style). Toggle dark mode via the header button or `ThemeService` — persisted in `localStorage`.

Regenerate theme variables:

```bash
ng g @spartan-ng/cli:ui-theme
```

## AI / Cursor setup

- **Spartan skill:** `.agents/skills/spartan/SKILL.md`
- **Cursor rules:** `.cursor/rules/cursor.mdc` (Angular) + `.cursor/rules/spartan.mdc` (UI)
- **MCP servers:** `.vscode/mcp.json` — Angular CLI + `@spartan-ng/mcp`

## Scripts

| Command | Description |
|---------|-------------|
| `ng serve` | Dev server |
| `ng build` | Production build |
| `ng test` | Unit tests (Vitest) |
| `ng g @spartan-ng/cli:healthcheck` | Scan for deprecated Spartan patterns |

## Healthcheck

After upgrading `@spartan-ng/brain` or `@spartan-ng/cli`:

```bash
ng g @spartan-ng/cli:healthcheck --autoFix
```

## License

Private template — customize freely. Spartan/ui components follow their respective licenses (MIT).
