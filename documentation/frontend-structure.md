# Frontend Structure Overview (React + Vite)

frontend/
├── public/                # Static files (e.g. index.html, icons)
├── src/
│   ├── assets/            # Images and static assets (e.g. fond.png, user photos)
│   ├── components/        # Reusable UI components (e.g. Navbar, Footer)
│   ├── pages/             # Main page components (e.g. Home, AboutUs, Login, Register, Restaurants)
│   ├── App.tsx           # Root component that contains all routes
│   ├── main.tsx          # Entry point rendering App into the DOM
│   └── App.css           # Global styles
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts

## Component Responsibilities
- Home.tsx: Hero landing page with animated button.
- AboutUs.tsx: Team profile section with bios and GitHub links.
- Login/Register.tsx: Auth forms.
- Restaurants.tsx: Restaurant listings.
- Reservations.tsx: Reservation viewing page for logged-in users.

## Component Tree Overview
App
├── Navbar
├── Routes
│   ├── Home
│   ├── AboutUs
│   ├── Login / Register
│   ├── Restaurants
│   └── Reservations
└── Footer



App
├── Navbar
├── Routes
│   ├── Home
│   ├── AboutUs
│   ├── Login / Register
│   ├── Restaurants
│   └── Reservations
└── Footer

## Explanation
- App.tsx: Main component with routing logic
- Navbar/Footer: Shared across all pages
- ProtectedRoute (in App): Redirects unauthenticated users

## State Management
- React useState + useEffect (no external state manager)
- Axios with credentials for cookies

