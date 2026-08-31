# BoardroomAI Design System (v2.0)

This is the design language for the whole product, encoded in
`tailwind.config.ts` and `app/globals.css`. Every component in
`components/ui` and `components/shared` is built strictly from these
tokens — no component should hardcode a hex value, a one-off shadow, or an
ad-hoc easing curve.

## The idea

Engineered minimalism. A near-white canvas (`#fafafa`) carrying
ink-near-black type (`#171717`), one geometric sans at three weights, and
exactly one decorative gesture — a mesh gradient that lives in the hero and
nowhere else. Colour is close to absent: a single brand blue (`#0070f3`)
carries links, live/AI indicators and the event badge, and the semantic
tones appear only where they mean something.

The restraint is the product argument. A board's verdict is the content;
the interface's job is to get out of its way and look like infrastructure
rather than a marketing site.

## Palette

Light is the default and the showcase surface. Dark is a derived variant
with the polarity flipped — same near-monochrome logic, ink becomes the
canvas, and the primary button inverts to white.

| Token | Light | Use |
|---|---|---|
| `--background` | `0 0% 98%` (#fafafa) | Page body — the canvas-soft ground every band sits on |
| `--surface` | `0 0% 100%` | Card and panel fill — lifts off the body through shadow, not a colour step |
| `--surface-elevated` | `0 0% 96%` | Hovers, nested surfaces, segmented-control tracks |
| `--foreground` | `0 0% 9%` (#171717) | Every headline, body paragraph, and primary CTA fill |
| `--muted-foreground` | `0 0% 32%` (#4d4d4d) | Secondary body copy |
| `--muted-foreground-soft` | `0 0% 53%` (#888) | Fine print, meta labels, placeholders (`text-muted-soft`) |
| `--border` / `--border-strong` | `0 0% 92%` / `0 0% 88%` | Hairlines (#eaeaea) and the slightly stronger divider (#e0e0e0) |
| `--brass` (primary) | `0 0% 9%` | Ink. The primary button is black, not a colour — black is the conversion target |
| `--signal` | `212 100% 48%` (#0070f3) | The one chromatic accent: links, live/AI-originated content, the event badge |
| `--success` / `--warning` / `--destructive` | `212 100% 48%` / `38 91% 55%` / `0 100% 47%` | Semantic states |
| `--mesh-*` | coral / amber / mint-teal | The hero gradient's three stops — **hero scale only** |

> The palette maps `success` to the brand blue rather than a green. That is
> deliberate: the surface is intentionally near-monochromatic and does not
> introduce accents the palette doesn't already contain. An "up" trend chip
> therefore reads blue, not green.

## Typography

**One face, three weights.** Geist carries display headlines, body copy,
nav, buttons and labels alike — 400 (body), 500 (buttons, strong labels),
600 (display). There is no serif companion, and 600 is a hard ceiling; the
system reads restrained *because* of that.

Geist Mono is kept for figures that must read as *data* in the
authenticated app (financial tables, timestamps, IDs). It belongs to the
same family, so the single-face rule holds. Marketing surfaces use
`tabular-nums` on the sans instead of switching face.

Negative tracking is part of the voice and grows with size (`-0.0475em` at
48px down to `-0.02em` at 14px). Positive tracking never appears, and
headlines are sentence-case throughout — never all-caps.

## Shapes — two radius scales, deliberately

| Scale | Value | Where |
|---|---|---|
| `rounded-md` / `rounded-lg` | 6px | **Every** nav button, in-page action button, card, and input |
| `rounded-full` | 9999px | **Only** marketing-scale CTAs and badge pills |

Applying pill geometry to an in-app action button, or 6px to a marketing
CTA, breaks the system's internal logic. `Button` exposes this as an
explicit `shape` prop (`"default" | "pill"`) rather than leaving it to a
`className` patch at the call site.

## Elevation

Elevation is a **stacked compound shadow**, never a single heavy drop:

```
hsl(var(--shadow-color) / 0.08) 0 0 0 1px   ← hairline ring
hsl(var(--shadow-color) / 0.04) 0 2px 2px 0 ← micro drop
hsl(var(--background))          0 0 0 1px   ← inner ring, page bleeding to the card edge
```

That formula is the `.surface-card` class (with `.surface-card-hover` for
interactive cards); the `shadow-xs` → `shadow-xl` scale is the same idea at
increasing offsets. Cards sit *on* the page — they never levitate.

The system's chief inter-section depth cue isn't a shadow at all: it's the
polarity flip from `--background` to `--brass` (see the closing CTA band and
the featured pricing tier).

## The hero gradient

The one decorative act. A radial bloom of coral → amber → mint-teal that
erupts from the lower half of the hero and dissolves into the page, with a
hairline column guide behind it telegraphing the layout grid.

Both live in `app/globals.css` as `.mesh-gradient` and `.column-guide`, and
both are used exactly once, in `features/landing/components/hero.tsx`. Treat
the gradient as a single object: never miniaturise it into a button fill, an
icon background, or a section stripe, and never reduce it to a single stop.

## Motion

Centralized in `lib/motion.ts` so every entrance/stagger/hover animation
shares the same two easing curves:

- `EMPHASIZED_EASE` (`cubic-bezier(0.16, 1, 0.3, 1)`) — entrances, the
  ScoreCard ring's fill animation, dialogs.
- `STANDARD_EASE` (`cubic-bezier(0.4, 0, 0.2, 1)`) — hovers, toggles, exits.

`useReducedMotion` + `withReducedMotion` collapse any variant to
opacity-only when the OS preference is set; this is wired at the token
level, not left to each component to remember.

## Spacing & layout

- 4px base scale plus a few "air" steps (`18`–`34`) for section rhythm.
- The system runs **tight inside cards** (16px padding, 12px stacks) and
  **breathes between sections** (`py-24` = 96px bands). Large section gaps
  plus dense interiors is the consistent pattern.
- Content caps at `max-w-content` (1200px) with 16–24px gutters.
- Breakpoints follow the spec: mobile < 600, tablet 600–959, desktop
  960–1199, wide ≥ 1200 (exposed as `mobile` / `tablet` / `wide` screens).

## Signature element — the Roundtable Ring

Every verdict the board produces (investment score, confidence, health) is a
number out of 100, drawn as a **radial ring** echoing the shape of the
boardroom table. `ScoreCard` is the full-size version; `AvatarPresenceRing`
is the same idea compressed to an executive's presence indicator. In the
monochrome palette the ring reads as ink on a hairline track, which is what
lets it carry a page without any other ornament.

## Themes

`next-themes` drives a `.dark` class on `<html>`; light is the default. The
dark token block lives **outside** `@layer base` on purpose — a bare
`.dark { … }` rule declared inside the base layer is stripped by the build's
CSS pipeline, which silently leaves the dark theme with no token values at
all. The Appearance tab in Settings is the in-product switch.

## Component inventory

**Primitives** (`components/ui`): Button (variant × size × shape), Input,
Textarea, Select, Label, Switch, Card, Badge, Avatar (+
`AvatarPresenceRing`), Tooltip, Dialog, Drawer, Separator, Skeleton (+
`SkeletonCard`, `SkeletonRow`).

**Composed / shared** (`components/shared`): SectionHeader, MetricCard,
ScoreCard, ExecutiveCard, Timeline, ChartWrapper, BoardroomRadarChart,
EmptyState, ErrorState, ThemeToggle.

**Layout** (`components/layout`): Sidebar, Navbar, AppShell,
MarketingNavbar, Footer. The app shell keeps the sidebar as a permanent
column from `lg` up and as an off-canvas drawer below it.
