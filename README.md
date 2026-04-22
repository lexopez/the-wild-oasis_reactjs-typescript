# 🏔️ The Wild Oasis (TypeScript Version)

**The Wild Oasis** is a feature-rich internal management application designed for a boutique hotel. This project represents a complete architectural migration from JavaScript to **TypeScript**, emphasizing type-safe data fetching, scalable component patterns, and robust state management.

## 🚀 Key Features

- **Advanced Dashboard:** Real-time visualization of sales, bookings, and occupancy rates over varying timeframes (7, 30, or 90 days).
- **Comprehensive Booking System:** Full CRUD operations for hotel bookings with server-side filtering, sorting, and pagination.
- **Check-in/Check-out Logic:** A dedicated workflow for managing guest arrivals, including payment confirmation and optional breakfast service additions.
- **Cabin Management:** Full inventory control allowing staff to update cabin details and upload photos to Supabase storage.
- **User Authentication:** Secure login/signup system with personalized user profiles and avatar management.
- **Dark Mode:** A persistent, global UI theme toggle implemented via React Context and Styled Components.

## 🛠️ Technical Stack

- **Framework:** [React 18](https://reactjs.org/) with **TypeScript**
- **Styling:** [Styled Components](https://styled-components.com/) (using Transient Props pattern)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **State Management:** Context API
- **Form Handling:** [React Hook Form](https://react-hook-form.com/)
- **Backend/Database:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Charts:** [Recharts](https://recharts.org/)
- **Date Utilities:** [date-fns](https://date-fns.org/)

## 🏗️ Architecture & TypeScript Implementation

The migration from JS to TS focused on eliminating runtime errors and improving developer experience through strict contracts between components and data.

### 1. Feature-Based Architecture

The project is organized by domain features (Bookings, Cabins, Dashboard, Check-in, etc.). Each feature contains its own logic, hooks, and specialized UI components.

### 2. Type-Safe Patterns

- **Generic UI Components:** Components like `Table`, `Menus`, and `Modal` utilize TypeScript Generics to handle various data shapes without losing type information.
- **Transient Props:** Styled-components use the `$` prefix for props to prevent custom logic props from leaking into the DOM, fully typed via interfaces.
- **Data Transformation:** Complex chart logic in `SalesChart` and `DurationChart` is protected by interfaces, ensuring that zero-value days are handled without crashing the UI.
- **Global Error Handling:** Implemented `react-error-boundary` with a typed `ErrorFallback` component to catch and report runtime exceptions gracefully.

## 📦 Getting Started

1. **Clone the repo:**
   ```bash
   git clone [https://github.com/your-username/the-wild-oasis-ts.git](https://github.com/your-username/the-wild-oasis-ts.git)
   ```
