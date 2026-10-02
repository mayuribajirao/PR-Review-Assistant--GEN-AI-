---
name: Warm Slate Dev
colors:
  surface: '#0f1227'
  surface-dim: '#0f1227'
  surface-bright: '#35384f'
  surface-container-lowest: '#090c21'
  surface-container-low: '#171a2f'
  surface-container: '#1b1e34'
  surface-container-high: '#26283f'
  surface-container-highest: '#30334a'
  on-surface: '#dfe0fe'
  on-surface-variant: '#d7c3b6'
  inverse-surface: '#dfe0fe'
  inverse-on-surface: '#2c2f45'
  outline: '#9f8d82'
  outline-variant: '#52443b'
  surface-tint: '#ffb780'
  primary: '#ffd4b6'
  on-primary: '#4e2600'
  primary-container: '#f9b17a'
  on-primary-container: '#754214'
  inverse-primary: '#885123'
  secondary: '#c5c5d6'
  on-secondary: '#2e303c'
  secondary-container: '#464856'
  on-secondary-container: '#b6b7c7'
  tertiary: '#dadcea'
  on-tertiary: '#2d303b'
  tertiary-container: '#bec0ce'
  on-tertiary-container: '#4b4e5a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc4'
  primary-fixed-dim: '#ffb780'
  on-primary-fixed: '#2f1400'
  on-primary-fixed-variant: '#6b3a0d'
  secondary-fixed: '#e1e1f2'
  secondary-fixed-dim: '#c5c5d6'
  on-secondary-fixed: '#191b27'
  on-secondary-fixed-variant: '#444653'
  tertiary-fixed: '#e0e2f0'
  tertiary-fixed-dim: '#c4c6d3'
  on-tertiary-fixed: '#181b25'
  on-tertiary-fixed-variant: '#434652'
  background: '#0f1227'
  on-background: '#dfe0fe'
  surface-variant: '#30334a'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 29px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  label-ui:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 22px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
---

## Brand & Style

This design system crafts an intentional, restorative developer experience by combining technical utility with warm, low-fatigue atmospheric tones. Designed for software engineers, systems architects, and technical operators who spend continuous hours inside complex workflows, the interface trades sterile monochrome code environments for a grounded, tactile atmosphere.

The aesthetic fuses **Modern Technical Minimalism** with **Atmospheric Layering**:
- Deep slate canvases anchor the space, eliminating harsh display glare.
- Sunlit amber accents introduce clear intentional focal points without creating sensory overload.
- Generous internal padding and breathable layout rhythms eliminate typical dashboard clutter, establishing an unhurried, focused environment.

## Colors

The palette establishes a deliberate thermal balance in dark mode, layering warm slate foundations with balanced intermediate surfaces and radiant amber accents.

### Palette Architecture
- **Base Background Canvas (`#0B0E23`)**: The solid, non-distracting bedrock of the entire interface.
- **Card & Surface Container (`#383A47`)**: Slightly lifted structural surface for panels, modular cards, headers, and floating inspectors.
- **Primary Accent (`#F9B17A`)**: Warm radiant peach/amber used strictly for high-priority calls-to-action, active indicators, and critical states. Interactive text on this surface must always remain dark slate for strict WCAG AAA legibility.
- **Secondary / Subtext (`#D8DAE8`)**: High-contrast, soft off-white providing effortless readability for primary copy, headers, and secondary UI metadata.
- **Muted Accent & Structural Strokes (`#383A47`)**: Atmospheric mid-tone utilized for borders, inactive tab indicators, subtle divider lines, and muted badges.

## Typography

The typographic hierarchy rejects dense micro-copy in favor of sustained legibility and relaxed optical scanning.

- **Baseline Rules**: The absolute minimum body font size is 16px. Micro-text below 14px is strictly prohibited across the entire product ecosystem.
- **Line Heights**: Kept consistently at or above 1.6x line-height ratio across body copy and code tokens to foster open scanning during high-concentration workflows.
- **Font Roles**: `Geist` drives all primary structural text, headings, and data labels for its neutral geometric clarity. `JetBrains Mono` handles inline code snippets, commit hashes, metrics, and configuration blocks.

## Layout & Spacing

This design system uses a relaxed, fluid grid structure designed to prevent cognitive clutter. Workspaces never trap dense data into compressed, illegible tables; instead, components flow across generous zones.

- **Desktop (>= 1024px)**: 12-column layout with 24px (`1.5rem`) gutters and a minimum 48px (`3rem`) page margin. Max-width containers max out at 1440px to ensure wide displays maintain readable line lengths.
- **Tablet (768px - 1023px)**: 8-column layout with 20px gutters and 32px margins. Secondary context panels collapse into tabbed side sheets.
- **Mobile (< 768px)**: 4-column layout with 16px gutters and 20px margins. Multi-column metric groups reflow cleanly into single vertical stacks.
- **Spatial Rhythm**: Inner card padding must default to `2rem` (`space-xl`), allowing content adequate breathing space against surface borders.

## Elevation & Depth

Visual hierarchy is communicated via **Tonal Surfaces** and **Soft Low-Contrast Outlines** rather than sharp, muddy drop shadows.

- **Base Layer (Level 0)**: Background `#0B0E23`. Flat, non-elevated foundation.
- **Card Surface (Level 1)**: `#383A47` with a subtle 1px border colored `#383A47` at 40% opacity.
- **Floating / Modal Layer (Level 2)**: Elevated surfaces utilize a slightly brighter tone combined with an ambient, deep glow: `0 16px 36px -8px rgba(11, 14, 35, 0.6)`.
- **Focus Rings**: Interactive focus states receive a prominent 2px outer outline colored `#F9B17A` with a 2px offset against the base slate container.

## Shapes

The design system standardizes on a friendly, architectural 12px (`0.75rem`) border radius across all primary containers and interactive surfaces, balancing modern softness with systematic precision.

- **Standard Elements (Buttons, Inputs, Cards, Code Blocks)**: Exactly 12px border radius.
- **Floating Tooltips & Inner Badges**: 8px border radius for proportional harmony inside larger 12px parents.
- **Pills / Status Dots**: Circular (`9999px`) reserved strictly for status pulses and category tags.

## Components

### Buttons
- **Primary Button**: Solid warm amber background (`#F9B17A`) with deep slate text, bold weight. 12px border radius, 14px vertical and 24px horizontal padding. Hover shifts brightness upward with a soft amber glow (`box-shadow: 0 4px 14px rgba(249, 177, 122, 0.25)`).
- **Secondary Button**: Card surface (`#383A47`) with 1px border, text colored `#D8DAE8`. Hover brightens the surface.
- **Ghost / Text Button**: Transparent background with text in `#D8DAE8`. Hover adds card surface at 50% opacity.

### Input Fields & Controls
- **Inputs & Selects**: Height minimum 48px, background `#0B0E23`, 1px border. Text in `#D8DAE8` (16px). Active focus replaces the border with 2px `#F9B17A`.
- **Checkboxes & Radios**: 20px sized controls with a 1px stroke on base slate. When checked, filled with `#F9B17A` displaying a dark slate checkmark or dot.

### Cards & Panels
- **Structure**: Surface `#383A47`, 1px border, 12px corner radius, and generous `24px` to `32px` internal padding.
- **Section Headers**: Card titles sit at 20px (`headline-sm`) with a 12px bottom margin separating them from body content.

### Chips & Badges
- **Status Badges**: Subdued background with border and text `#D8DAE8`. 
- **Active / Accent Chips**: Subtle warm tint (`rgba(249, 177, 122, 0.15)`) with `#F9B17A` label text.

### Code Display & Log Viewers
- **Containers**: Nested inside panels using a darker variant, 12px corner radius, 20px padding, and monospace typography at 15px with 1.6 line height.