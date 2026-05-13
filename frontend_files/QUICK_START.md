# 🚀 EduNest - Quick Start Guide

## 📦 Installation Steps (Copy-Paste Ready)

### Step 1: Create Next.js Project
```bash
npx create-next-app@latest edunest --typescript --tailwind --eslint
cd edunest
```

### Step 2: Install Additional Dependencies
```bash
npm install react-feather react-hook-form react-select
npm install next@16.2.6 react@19.2.4 react-dom@19.2.4
```

### Step 3: Setup Project Structure
```bash
# Create directories
mkdir -p src/app/{login,register,forgot-password}
mkdir -p src/app/dashboard/{students,attendance,courses,exams,results,assignments,purchases,inventory,stock,finance,reports,analytics,profile,settings,notifications}
mkdir -p src/components/{auth,dashboard,common,forms,charts}
mkdir -p src/{lib,hooks,types,context,styles}
mkdir -p public/{images,icons,fonts}
```

### Step 4: Copy Configuration Files

Copy these files from `outputs/` to your project root:
- `tailwind-config.ts` → `tailwind.config.ts`
- `postcss.config.js` → `postcss.config.js`
- `next.config.ts` → `next.config.ts`
- `tsconfig.json` → `tsconfig.json`
- `tsconfig.node.json` → `tsconfig.node.json`
- `.eslintrc.json` → `.eslintrc.json`
- `.env.example` → `.env.local`

### Step 5: Copy Layout Files

Copy to your project:
- `layout.tsx` → `src/app/layout.tsx`
- `globals.css` → `src/app/globals.css`
- `auth-layout.tsx` → `src/app/(auth)/layout.tsx`
- `dashboard-layout.tsx` → `src/app/dashboard/layout.tsx`

### Step 6: Copy Component Files

Copy to your project:
- `sidebar-component.tsx` → `src/components/dashboard/sidebar.tsx`
- `topbar-component.tsx` → `src/components/dashboard/topbar.tsx`

### Step 7: Copy Page Files

Copy to your project:
- `login-page.tsx` → `src/app/(auth)/login/page.tsx`
- `register-page.tsx` → `src/app/(auth)/register/page.tsx`
- `forgot-password-page.tsx` → `src/app/(auth)/forgot-password/page.tsx`
- `dashboard-page.tsx` → `src/app/dashboard/page.tsx`
- `students-page.tsx` → `src/app/dashboard/students/page.tsx`
- `attendance-page.tsx` → `src/app/dashboard/attendance/mark/page.tsx`
- `purchases-page.tsx` → `src/app/dashboard/purchases/page.tsx`

### Step 8: Update package.json

Make sure your `package.json` scripts look like:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --fix"
  }
}
```

### Step 9: Run Development Server
```bash
npm run dev
```

Then open: **http://localhost:3000**

---

## 🎯 File Organization Quick Reference

### Must Copy Files (Priority Order)
1. ✅ `tailwind.config.ts` - Theme configuration
2. ✅ `globals.css` - Global styles
3. ✅ `src/app/layout.tsx` - Root layout
4. ✅ `src/app/globals.css` - CSS styles
5. ✅ `src/app/(auth)/layout.tsx` - Auth layout
6. ✅ `src/app/dashboard/layout.tsx` - Dashboard layout
7. ✅ `src/components/dashboard/sidebar.tsx` - Navigation
8. ✅ `src/components/dashboard/topbar.tsx` - Header

### Optional Enhanced Files
- `AddPurchases.tsx` - Your custom purchase component (Copy to `src/components/forms/`)

---

## 🔧 Configuration Updates

### Update `src/app/(auth)/layout.tsx`
```typescript
import type { Metadata } from "next";
import "./globals.css";  // Make sure path is correct

export const metadata: Metadata = {
  title: "EduNest - School Management",
};

// Rest of the layout...
```

### Update `tailwind.config.ts`
Make sure your config has Navy + Amber colors:
```typescript
colors: {
  navy: {
    DEFAULT: '#0f1f3d',
    mid: '#1a3260',
    light: '#2b4b8c',
  },
  amber: {
    DEFAULT: '#f5a623',
    light: '#ffc85a',
    pale: '#fff7e6',
  },
}
```

---

## ✅ Verification Checklist

After setup, verify these things work:

- [ ] Project starts without errors: `npm run dev`
- [ ] Login page loads: http://localhost:3000/login
- [ ] Register page loads: http://localhost:3000/register
- [ ] Forgot password loads: http://localhost:3000/forgot-password
- [ ] Dashboard loads: http://localhost:3000/dashboard
- [ ] Sidebar is visible on desktop
- [ ] Sidebar collapses on mobile
- [ ] Topbar has notifications and profile
- [ ] Students page shows table
- [ ] Attendance page shows marking interface
- [ ] Purchases page shows list
- [ ] Color scheme is Navy + Amber
- [ ] Build succeeds: `npm run build`

---

## 🎨 Theme Customization

### Change Primary Color (Navy → Blue)
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: '#1e40af',  // Your color
    dark: '#1e3a8a',
    light: '#3b82f6',
  },
}
```

Then update CSS variables in `globals.css`:
```css
:root {
  --primary: #1e40af;
  --primary-dark: #1e3a8a;
}
```

### Change Accent Color (Amber → Orange)
```typescript
colors: {
  accent: {
    DEFAULT: '#ea580c',  // Orange
    light: '#f97316',
  },
}
```

---

## 🚀 First API Integration

### Create `src/lib/api-client.ts`
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/api/v1/accounts/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

// Add more functions as needed
```

### Update Login Page
```typescript
import { login } from '@/lib/api-client';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const result = await login(email, password);
    localStorage.setItem('token', result.token);
    window.location.href = '/dashboard';
  } catch (err) {
    setError('Login failed');
  }
};
```

---

## 📱 Mobile Testing

### Test Responsive Breakpoints

```bash
# Simulate phone (640px)
- Sidebar hides, show hamburger menu
- Touch-friendly buttons (44px minimum)
- Full-width inputs

# Simulate tablet (1024px)
- Sidebar visible but narrower
- 2-column layout
- Medium spacing

# Desktop (1280px+)
- Full sidebar visible
- Multi-column layouts
- Regular spacing
```

### Browser DevTools
1. Open DevTools (F12)
2. Click responsive design mode (Ctrl+Shift+M)
3. Test different devices

---

## 🐛 Common Issues & Solutions

### Issue: Tailwind Classes Not Working
**Solution:**
```bash
# Rebuild Tailwind
rm -rf .next
npm run dev
```

### Issue: Module Not Found '@/components/...'
**Solution:** Make sure `tsconfig.json` has paths:
```json
"paths": {
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"],
}
```

### Issue: Sidebar Not Showing
**Solution:** Make sure layouts are imported correctly in parent pages:
```typescript
// In src/app/dashboard/layout.tsx
import Sidebar from '@/components/dashboard/sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
```

### Issue: Colors Not Matching Theme
**Solution:** Make sure you're using Tailwind classes:
```typescript
// ✅ Good
<div className="bg-[#0f1f3d]">  // Navy
<div className="bg-[#f5a623]">  // Amber

// Or use CSS variables
<div className="bg-navy text-white">
```

---

## 📚 Next: Add More Pages

### Create Students Add Page
Create `src/app/dashboard/students/add/page.tsx`:
```typescript
"use client";

export default function AddStudentPage() {
  return (
    <div className="page-content">
      <div className="page-header mb-6">
        <h1 className="page-title">Add Student</h1>
      </div>
      
      {/* Form goes here */}
    </div>
  );
}
```

### Create Courses Page
Create `src/app/dashboard/courses/page.tsx`:
```typescript
"use client";

export default function CoursesPage() {
  return (
    <div className="page-content">
      <div className="page-header mb-6">
        <h1 className="page-title">Courses</h1>
      </div>
      
      {/* Content goes here */}
    </div>
  );
}
```

---

## 🔐 Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=EduNest
```

---

## 📦 Update Dependencies

```bash
# Check for updates
npm outdated

# Update all
npm update

# Install specific versions
npm install next@16.2.6 react@19.2.4
```

---

## 🚀 Ready to Deploy?

### Vercel (Easiest)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD npm start
```

---

## 📞 Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Happy Coding! 🎓**

For questions or issues, refer to the main README.md or FOLDER_STRUCTURE.md
