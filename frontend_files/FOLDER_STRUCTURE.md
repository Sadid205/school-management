# EduNest - Next.js Project Structure

## 📁 Complete Folder Organization

```
edunest/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout
│   │   ├── globals.css                # Global styles
│   │   ├── page.tsx                   # Home page (landing)
│   │   │
│   │   ├── (auth)/                    # Auth group layout
│   │   │   ├── layout.tsx             # Auth layout with left panel
│   │   │   ├── login/
│   │   │   │   └── page.tsx           # Login page
│   │   │   ├── register/
│   │   │   │   └── page.tsx           # Registration page
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx           # Forgot password page
│   │   │   └── otp-verify/
│   │   │       └── page.tsx           # OTP verification
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx             # Dashboard layout (sidebar + topbar)
│   │   │   ├── page.tsx               # Dashboard home
│   │   │   │
│   │   │   ├── students/
│   │   │   │   ├── page.tsx           # Students list
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx       # Add student form
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx       # Student details
│   │   │   │   │   └── edit/
│   │   │   │   │       └── page.tsx   # Edit student
│   │   │   │   └── classes/
│   │   │   │       └── page.tsx       # Classes management
│   │   │   │
│   │   │   ├── attendance/
│   │   │   │   ├── page.tsx           # Mark attendance
│   │   │   │   ├── mark/
│   │   │   │   │   └── page.tsx       # Mark attendance (alternate)
│   │   │   │   ├── reports/
│   │   │   │   │   └── page.tsx       # Attendance reports
│   │   │   │   └── analytics/
│   │   │   │       └── page.tsx       # Attendance analytics
│   │   │   │
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx           # Courses list
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx       # Add course
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Course details
│   │   │   │
│   │   │   ├── exams/
│   │   │   │   ├── page.tsx           # Exams list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Exam details
│   │   │   │
│   │   │   ├── results/
│   │   │   │   └── page.tsx           # Student results
│   │   │   │
│   │   │   ├── assignments/
│   │   │   │   ├── page.tsx           # Assignments list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Assignment details
│   │   │   │
│   │   │   ├── purchases/
│   │   │   │   ├── page.tsx           # Purchases list
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx       # Add purchase
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Purchase details
│   │   │   │
│   │   │   ├── inventory/
│   │   │   │   └── page.tsx           # Inventory items
│   │   │   │
│   │   │   ├── stock/
│   │   │   │   └── page.tsx           # Stock management
│   │   │   │
│   │   │   ├── finance/
│   │   │   │   ├── fees/
│   │   │   │   │   └── page.tsx       # Fees management
│   │   │   │   ├── salary/
│   │   │   │   │   └── page.tsx       # Salary management
│   │   │   │   └── reports/
│   │   │   │       └── page.tsx       # Finance reports
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   └── page.tsx           # All reports
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx           # Analytics dashboard
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   └── page.tsx           # User profile
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   └── page.tsx           # Settings
│   │   │   │
│   │   │   └── notifications/
│   │   │       └── page.tsx           # Notifications
│   │   │
│   │   └── api/                       # API routes (optional)
│   │       └── v1/
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── forgot-password-form.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── sidebar.tsx            # ✅ Created
│   │   │   ├── topbar.tsx             # ✅ Created
│   │   │   └── breadcrumb.tsx
│   │   │
│   │   ├── common/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── table.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── loader.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── student-form.tsx
│   │   │   ├── course-form.tsx
│   │   │   └── purchase-form.tsx
│   │   │
│   │   └── charts/
│   │       ├── bar-chart.tsx
│   │       ├── line-chart.tsx
│   │       └── pie-chart.tsx
│   │
│   ├── lib/
│   │   ├── api-client.ts              # API utilities
│   │   ├── auth.ts                    # Authentication helpers
│   │   ├── constants.ts               # App constants
│   │   └── utils.ts                   # Utility functions
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-fetch.ts
│   │   └── use-local-storage.ts
│   │
│   ├── types/
│   │   ├── student.ts
│   │   ├── attendance.ts
│   │   ├── course.ts
│   │   ├── purchase.ts
│   │   └── index.ts
│   │
│   ├── context/
│   │   ├── auth-context.tsx
│   │   └── app-context.tsx
│   │
│   └── styles/
│       └── variables.css              # CSS variables
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env.local                         # Environment variables
├── .env.example
├── .eslintrc.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts                 # ✅ Created
├── postcss.config.js
├── package.json                       # ✅ Given
└── README.md
```

## 📝 File Creation Steps

### Step 1: Create App Directory Structure
```bash
# From your project root
mkdir -p src/app/{login,register,forgot-password,otp-verify}
mkdir -p src/app/dashboard/{students,attendance,courses,exams,results,assignments,purchases,inventory,stock,finance,reports,analytics,profile,settings,notifications}
mkdir -p src/components/{auth,dashboard,common,forms,charts}
mkdir -p src/lib src/hooks src/types src/context src/styles
mkdir -p public/{images,icons,fonts}
```

### Step 2: Copy the Created Files

**Layout Files:**
- `layout.tsx` → `src/app/layout.tsx`
- `auth-layout.tsx` → `src/app/(auth)/layout.tsx`
- `dashboard-layout.tsx` → `src/app/dashboard/layout.tsx`

**Global Styles:**
- `globals.css` → `src/app/globals.css`

**Components:**
- `sidebar-component.tsx` → `src/components/dashboard/sidebar.tsx`
- `topbar-component.tsx` → `src/components/dashboard/topbar.tsx`

**Config:**
- `tailwind-config.ts` → `tailwind.config.ts`

**Pages:**
- `login-page.tsx` → `src/app/(auth)/login/page.tsx`
- `register-page.tsx` → `src/app/(auth)/register/page.tsx`
- `forgot-password-page.tsx` → `src/app/(auth)/forgot-password/page.tsx`
- `dashboard-page.tsx` → `src/app/dashboard/page.tsx`
- `students-page.tsx` → `src/app/dashboard/students/page.tsx`
- `attendance-page.tsx` → `src/app/dashboard/attendance/mark/page.tsx`
- `purchases-page.tsx` → `src/app/dashboard/purchases/page.tsx`

### Step 3: Update Imports in Components

Update all imports to match the new structure:
```typescript
// Before
import Sidebar from "@/components/sidebar";

// After
import Sidebar from "@/components/dashboard/sidebar";
```

## 🎨 Theme Colors

The app uses a **Navy + Amber** color scheme:

- **Navy**: `#0f1f3d` (Primary)
- **Navy Mid**: `#1a3260`
- **Navy Light**: `#2b4b8c`
- **Amber**: `#f5a623` (Accent)
- **Amber Light**: `#ffc85a`

## 🚀 Next Steps

1. Create remaining pages (exams, results, assignments, finance, etc.)
2. Build API integration layer
3. Create custom hooks for data fetching
4. Add state management (Context API or Zustand)
5. Implement error boundaries
6. Add loading states and skeletons
7. Create unit tests
8. Deploy to production

## 📦 Dependencies to Install

```bash
npm install react-feather next-themes react-hook-form react-select antd
npm install -D tailwindcss postcss autoprefixer
```

## 🔐 Authentication Flow

1. User lands on `/` (home)
2. Clicks "Sign In" → goes to `/login`
3. After login → redirected to `/dashboard`
4. Can access all dashboard routes
5. Logout → back to `/login`

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

All components are mobile-first responsive!
