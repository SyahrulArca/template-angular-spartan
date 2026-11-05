---
name: Spartan Lyra WMS
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c4c7c9'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8e9193'
  outline-variant: '#444749'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3132'
  primary-container: '#e2e2e3'
  on-primary-container: '#636466'
  inverse-primary: '#5d5e60'
  secondary: '#c6c5cf'
  on-secondary: '#2f3038'
  secondary-container: '#4a4b53'
  on-secondary-container: '#bcbbc5'
  tertiary: '#ffffff'
  on-tertiary: '#003824'
  tertiary-container: '#6ffbbe'
  on-tertiary-container: '#00734e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e3'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1d'
  on-primary-fixed-variant: '#454748'
  secondary-fixed: '#e3e1ec'
  secondary-fixed-dim: '#c6c5cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#46464e'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 20px
  body-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-kbd:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system establishes an uncompromising, high-efficiency operational cockpit for enterprise supply chain operations. Built for high-frequency inventory controllers, logistics leads, and warehouse operators, the interface rejects decorative flourish in favor of maximum scan-speed, absolute structural clarity, and spatial density.

The aesthetic fuses the disciplined utilitarianism of Spartan UI with the crisp, low-saturation precision of modern engineering tools (Linear, modern command surfaces). Surfaces rely on neutral zinc layers, hairline borders, and monospaced micro-data alignments. Emotional tone is steady, calculated, and high-trust: every interaction feels instant, deterministic, and tactile without unnecessary movement.

## Colors

The system is built on a dark-first foundation to reduce eye strain under fluorescent warehouse lighting and persistent multi-monitor tracking.

- **Canvas & Neutral Surfaces:** Baseline canvas `#09090b` (zinc-950), with layered surfaces rising through `#121215` (zinc-900), `#18181b` (zinc-850), and `#27272a` (zinc-800).
- **Primary Contrast:** Stark zinc-white `#f4f4f5` reserved for primary text, active selection indicators, and primary command buttons.
- **Secondary / Slate Halftones:** `#71717a` (zinc-500) and `#a1a1aa` (zinc-400) for structural metadata, hotkey hints, table headers, and dormant borders.
- **Status Accents:**
  - **Success (Emerald):** `#10b981` (stroke/text) over `rgba(16, 185, 129, 0.08)` (fill) for verified picks, complete manifests, and inbound clears.
  - **Warning (Amber):** `#f59e0b` (stroke/text) over `rgba(245, 158, 11, 0.08)` (fill) for stock low-limits, routing blocks, and cycle count discrepancies.
  - **Error (Rose):** `#f43f5e` (stroke/text) over `rgba(244, 63, 94, 0.08)` (fill) for SKU mismatch, bin capacity breach, and damaged items.
  - **Info (Sky):** `#0ea5e9` (stroke/text) over `rgba(14, 165, 233, 0.08)` (fill) for cross-dock movements and automated carrier dispatches.
- **Focus Rings:** Uncompromised high-contrast solid ring with 2px offset: `outline: 2px solid #f4f4f5; outline-offset: 2px;`.

## Typography

Type pairing couples **Geist** for crisp, modern operational clarity with **JetBrains Mono** for strictly tabular inventory identifiers (SKUs, serials, bin locations, and barcode data).

- Headers prioritize compact vertical tracking with tight negative letter-spacing to allow dense data dashboard stacking.
- Tabular figures (`font-variant-numeric: tabular-nums`) must be enabled universally across numeric values, inventory counts, and timestamps.
- Monospace tokens (`JetBrains Mono`) are strictly applied to all location tags (e.g., `BAY-04-RACK-B-02`), tracking IDs, and keyboard shortcuts (`<kbd>`).

## Layout & Spacing

The layout adheres to an information-dense, workstation-optimized fluid grid built on strict 4px/8px incremental metrics.

- **Desktop (1440px+):** Multi-pane split layouts with persistent collapsible rail navigation (64px collapsed, 240px expanded), multi-table ledger layouts, and right-hand telemetry inspector panels.
- **Tablet/Terminal (768px - 1024px):** Reconfigured 2-column or single-column stack optimized for dockside scanning mounts and tablet vehicle docks. Gutter reduces to `0.5rem`.
- **Mobile/Handheld Gun (<768px):** Single vertical stream focusing on item pick verification, barcode targeting windows, and full-width CTA actions.
- Content elements use zero margin collapsing; alignment is maintained through explicit flex and grid gaps to avoid structural drift across high-density tables.

## Elevation & Depth

Elevation rejects blur-heavy ambient shadows in favor of **structural containment through hairline borders and stepped dark-tier tonal surfaces**:

- **Tier 0 (Canvas Base):** `#09090b` — Main background framing.
- **Tier 1 (Panels & Tables):** `#121215` with a 1px continuous border of `rgba(255, 255, 255, 0.08)`.
- **Tier 2 (Popovers, Flyouts, Command Palette):** `#18181b` with border `rgba(255, 255, 255, 0.14)` and a razor-thin structural shadow: `0 4px 16px -2px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05)`.
- **Tier 3 (Modals & Alerts):** `#1f1f23` surrounded by deep scrim `rgba(0, 0, 0, 0.8)` with backdrop blur `2px`.
- Highlighting is handled via inner top edge highlights (`inset 0 1px 0 0 rgba(255, 255, 255, 0.06)`) simulating machined, chamfered edge bevels.

## Shapes

Geometry is disciplined and compact, maintaining near-square angles (`roundedness: 1`):

- **Buttons, Inputs, Badges, Kbd:** Base radius `0.25rem` (4px).
- **Cards, Command Palettes, Data Tables:** Outer perimeter radius `0.375rem` (6px) with child items matching `0.25rem` to preserve concentric border geometry.
- **Micro Tags & Checkboxes:** Micro radius `2px`.
  Circular or pill shapes are forbidden to prevent wasted horizontal screen real estate in dense operational tables.

## Components

### Buttons

- **Primary:** Background `#f4f4f5`, text `#09090b`, weight 500. Hover state `#e4e4e7`. Active scale 0.99.
- **Secondary/Ghost:** Background `transparent`, border `1px solid rgba(255, 255, 255, 0.12)`, text `#e4e4e7`. Hover state background `rgba(255, 255, 255, 0.04)`.
- **Destructive:** Background `rgba(244, 63, 94, 0.1)`, border `1px solid rgba(244, 63, 94, 0.3)`, text `#fb7185`.

### Status Badges

- Strict 20px height, mono uppercase label (`label-sm`), 1px border.
- **Success:** Border `rgba(16, 185, 129, 0.3)`, text `#34d399`, background `rgba(16, 185, 129, 0.08)`.
- **Warning:** Border `rgba(245, 158, 11, 0.3)`, text `#fbbf24`, background `rgba(245, 158, 11, 0.08)`.
- **Info:** Border `rgba(14, 165, 233, 0.3)`, text `#38bdf8`, background `rgba(14, 165, 233, 0.08)`.
- **Neutral:** Border `rgba(255, 255, 255, 0.1)`, text `#a1a1aa`, background `rgba(255, 255, 255, 0.04)`.

### Command Palette (`Cmd+K`)

- Centered overlay, width 640px, background `#18181b`, border `1px solid rgba(255, 255, 255, 0.15)`.
- Input field contains zero outer borders, transparent background, text size 16px, bottom border dividing the search from the result group.
- Navigable results display inline category badges and right-aligned `<kbd>` hints.

### Keyboard Shortcuts (`<kbd>`)

- Height 18px, min-width 18px, padding `0 4px`.
- Background `#27272a`, border `1px solid rgba(255, 255, 255, 0.16)`, shadow `inset 0 -1px 0 rgba(0, 0, 0, 0.5)`. Text `#a1a1aa`, font `code-kbd`.

### Inputs & Selectors

- Height 32px (compact) or 36px (standard). Background `#121215`, border `1px solid rgba(255, 255, 255, 0.12)`, text `#f4f4f5`.
- Focus: Border `#f4f4f5`, box-shadow `0 0 0 1px #f4f4f5`.

### Data Grids & Ledgers

- Row height fixed at 36px for high density. Row border bottom `1px solid rgba(255, 255, 255, 0.05)`.
- Header row sticky, background `#0d0d10`, text `#71717a`, uppercase `label-sm`.
- Alternating hover row background `rgba(255, 255, 255, 0.025)`.
