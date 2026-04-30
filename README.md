# Tabel Data Barang - SaaS Dashboard

Portfolio project revamp of **Tabel Data Barang** into a premium admin-style dashboard with Stripe-inspired visual quality.

The focus is not only CRUD functionality, but also frontend architecture, UX quality, and polished interface behavior.

## Product Direction

- **Structure:** Admin SaaS layout (sidebar + topbar + content)
- **Visual style:** Clean, premium, minimal, soft shadows, generous spacing
- **Core module:** Data table with sorting, search, filter, loading and empty states
- **Portfolio goal:** Look and feel like a production-ready product

## Tech Stack

- Next.js 13
- React 18
- CSS Modules
- Tailwind (base setup available, but UI styling is modular CSS-based)

## Design System

Global design tokens are defined in `styles/globals.css`.

- **Color system**
  - Neutral text scale: `--text-900` to `--text-500`
  - Surface: `--surface-muted`
  - Primary accent: `--accent-500/600/700`
- **Typography**
  - `Inter` system stack
  - Clear hierarchy for labels, body, heading
- **Elevation**
  - Soft card shadow with `--shadow-soft`
- **Motion**
  - Smooth transitions around 180ms for interactive elements

## Project Structure

```text
components/
  layout/
    DashboardLayout.js
    DashboardLayout.module.css
  items/
    ItemsDashboard.js
    ItemsDashboard.module.css
pages/
  index.js
styles/
  globals.css
public/
  items.json
```

## Main Features

- Admin shell layout with:
  - Sidebar navigation
  - Topbar search
  - Profile area
- Items dashboard:
  - Search by item name
  - Filter by stock status (all / healthy / low / out)
  - Sortable columns (harga beli, harga jual, stok)
  - Hover-highlight table rows
  - Horizontal overflow support for smaller screens
- UX states:
  - Loading skeleton
  - Empty state
  - Clear CTA button (`Add Item`)

## Run Locally

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm run start` - start production server
- `npm run lint` - run ESLint

## Notes

- Data source is currently local from `public/items.json`
- CTA buttons (`Add Item`) are prepared in the UI and can be connected to modal/form flow as the next enhancement
