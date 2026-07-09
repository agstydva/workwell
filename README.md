# WorkWell - Health Productivity SaaS Web Application

WorkWell is a modern, production-grade React web application designed to help remote workers, developers, and students maintain physical and mental wellness during long screen hours.

Built on a decoupled, service-oriented architecture, this codebase represents a production-ready SaaS structure rather than a simple academic prototype. It is fully prepared for an immediate backend migration (e.g., to a Laravel REST API + MySQL database).

---

## 🚀 Key Features

1. **Decoupled API & Storage Layer**: All data CRUD operations are encapsulated inside a generic `storageService` wrapper. High-level mock endpoints (`src/api/`) return asynchronous `Promise` objects simulating network latencies, allowing a drop-in replacement of REST API client libraries (e.g., Axios).
2. **Centralized Routing Guards**: Employs declarative path wrappers (`ProtectedRoute` and `GuestRoute`) in `src/App.jsx` to manage page access and automatically redirect guest/authenticated sessions.
3. **Proactive Browser Notifications API**: Requests native desktop notification permissions on dashboard mounting. Triggers a desktop push reminder immediately when screen time limits are exceeded.
4. **Theme Customization Engine**: Supports **Light Mode**, **Dark Mode**, and **System Theme** preferences. Coordinates dynamic style changes using Tailwind v4's class-based variants and automatically calculates contrast variables for Recharts grids and tooltips.
5. **Unified Wellness Score**: Computes a real-time health score (0-100%) from 4 equally weighted categories (Screen Time, Water Intake, Movement/Stretching, and Stress/Mood). Includes a motivation block providing dynamic health feedback.
6. **Wellness Streak Tracking**: Computes streaks (consecutive healthy days) by querying the entire historical database. Employs grace periods so streaks aren't broken if today's targets are not yet met (as long as yesterday's targets were completed).
7. **Production Resiliency Components**:
   * **`ErrorBoundary`**: Intercepts unhandled JavaScript rendering errors, logs traces, and mounts a recovery view instead of showing blank white screens.
   * **`LoadingState` / `EmptyState` / `ErrorState`**: Highly reusable state feedback components styling spinners, empty directories, and technical debug dumps.
8. **Weekly Wellness PDF Exporter**: Parses weekly data arrays, averages compliance ratings, generates dynamic suggestions, and launches native system print managers to export reports as clean vector PDF pages.

---

## 📁 Directory Structure

```text
src/
├── api/                  # Asynchronous REST Mock Endpoints (MySQL Ready)
│   ├── userService.js    # Logins, registrations, and account settings
│   ├── habitService.js   # Daily water and physical movement logging
│   ├── screenTimeService.js # Screen session limits and work trackers
│   └── moodService.js    # Mood states and daily stress evaluations
│
├── services/             # Storage Abstractions
│   ├── storageService.js # General CRUD database manager (localStorage driver)
│   └── authStorage.js    # JWT session token and profile persistent caching
│
├── context/              # Global State Providers
│   ├── AuthContext.jsx   # Coordinates auth states and session profiles
│   ├── TrackerContext.jsx # Handles screen time ticks, breaks, and habit triggers
│   └── ThemeContext.jsx  # Syncs Light/Dark/System HTML root classes
│
├── hooks/                # Custom React Hooks
│   ├── useAuth.js        # Consumes AuthContext safely
│   ├── useTracker.js     # Consumes TrackerContext safely
│   └── useTheme.js       # Consumes ThemeContext safely
│
├── components/           # Reusable UI & Widget Elements
│   ├── Navbar.jsx        # Desktop & mobile menus + theme cycle switches
│   ├── Sidebar.jsx       # Responsive docked sidebar / sliding mobile drawer
│   ├── Timer.jsx         # Circular timer tracking screen limits & break countdowns
│   ├── HabitCard.jsx     # Water/Movement widget container card
│   ├── StressCard.jsx    # Interactive stress-mood evaluator
│   ├── ChartComponent.jsx# Theme-responsive analytics charts
│   ├── WellnessScore.jsx # Unified score circle, breakdown, & streak badges
│   ├── StateComponents.jsx # Reusable Loading, Empty, and Error views
│   └── ErrorBoundary.jsx # React class catching render crashes
│
├── pages/                # High-level Router Views
│   ├── LandingPage.jsx   # Public index landing page
│   ├── Login.jsx         # Credentials entrance
│   ├── Register.jsx      # New account form
│   ├── Dashboard.jsx     # Main workspace guarded view
│   └── Profile.jsx       # Settings forms guarded view
│
├── App.jsx               # Entry Router & Providers setup
├── index.css             # Main stylesheet & custom class styles
└── main.jsx              # DOM Mount entry point
```

---

## 🛠️ Installation & Setup

1. **Clone the Repository**:
   Navigate to the directory of the workspace.

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Launch Local Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. **Compile Production Build**:
   Verify bundle optimization and build configurations:
   ```bash
   npm run build
   ```

---

## 🔄 Future Migration: Replacing Mock APIs with a Real Backend (Laravel + MySQL)

Because business logic is strictly isolated, migrating to a real production database is highly streamlined:

### 1. Connecting API Services to REST Endpoints
Rather than reading from `storageService`, rewrite the files in `src/api/` (e.g. `userService.js`, `habitService.js`) to make standard network calls using HTTP clients like **Axios**:
```javascript
// Example replacement in src/api/habitService.js
import axios from 'axios';

const API_BASE = 'https://api.workwell.com/api';

export const habitService = {
  getHabitByDate: async (userId, date) => {
    const response = await axios.get(`${API_BASE}/habits?date=${date}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('workwell_token')}` }
    });
    return response.data;
  },
  
  updateHabits: async (userId, date, habitData) => {
    const response = await axios.post(`${API_BASE}/habits`, { date, ...habitData });
    return response.data;
  }
};
```

### 2. Transitioning Auth Storage to Secure Cookies
To replace local JWT caching with highly secure, server-side HTTP-Only cookies, simply override `src/services/authStorage.js`. The `AuthContext` consumes this service, meaning the change will propagate across all page components without breaking UI logic.
