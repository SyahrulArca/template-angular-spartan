# Sample CRUD — Tasks

Modular in-memory CRUD sample at `/tasks`. No API, no database.

## Structure

```
src/app/features/tasks/
├── models/
│   └── task.model.ts          # Types & status labels
├── data/
│   └── task.store.ts          # In-memory CRUD + filter + pagination (signals)
├── utils/
│   └── task.utils.ts           # filterTasks (date range, status, search)
├── pages/
│   └── task-page/             # Orchestrator (provides TaskStore)
│       ├── task-page.ts
│       └── task-page.html
└── ui/
    ├── task-toolbar/          # Header + "Add task"
    ├── task-table/            # List: Spartan `hlmTable` + TanStack `injectTable` (data-table pattern)
    ├── task-status-badge/     # Status chip
    ├── task-form-sheet/       # Create / edit (sheet + reactive form)
    └── task-delete-dialog/    # Delete confirmation
```

## Responsibilities

| Layer | Role |
|-------|------|
| **TaskStore** | Single source of truth — `create`, `update`, `delete`, filter (`filtered`), `paged`, seed data |
| **TaskPage** | Coordinates UI state (form open, delete target), `app-datatable-filter` + toast; paging UI lives in `TaskTable` |
| **UI components** | Dumb/presentational where possible; form & dialog own their templates |

## Patterns used

- View/logic split: every component has `.ts` + `.html`
- `ChangeDetectionStrategy.OnPush`
- Reactive forms + Spartan `hlmField`, `hlmSelect`, `hlmSheet`, `hlmAlertDialog`
- Tasks list: `@tanstack/angular-table` + `@spartan-ng/helm/table` (see [data table](https://spartan.ng/components/data-table)); filters stay in `app-datatable-filter` + `TaskStore`
- Toast via `@spartan-ng/brain/sonner`

## Extending

To swap in a real API later, replace `TaskStore` methods with HTTP calls and keep the same UI components — or introduce a `TaskRepository` interface and inject the implementation.
