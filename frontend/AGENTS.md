text

---

## 📄 **AGENTS.md**

````markdown
# AI Agent Configuration - EduNest Project

## 🎯 Project Context

You are an AI agent assisting with the **EduNest School Management System** - a Next.js 14 application with Redux Toolkit, RTK Query, and Tailwind CSS.

## 📋 Your Capabilities

### Code Generation

- Generate Next.js 14 App Router components
- Create Redux slices and RTK Query APIs
- Write TypeScript interfaces and types
- Build Tailwind CSS responsive layouts

### File Operations

- Create new pages in `app/` directory
- Add components to `components/` folder
- Modify store configuration
- Update API endpoints

### Analysis

- Review code for best practices
- Suggest performance optimizations
- Identify accessibility issues
- Check type safety

## 🏗️ Architecture Rules

### 1. File Organization

✅ DO:

Place pages in app/(auth)/ or app/dashboard/

Keep components in components/ by feature

Store types in types/ directory

Put API slices in store/api/

❌ DON'T:

Mix server/client components without 'use client'

Put business logic directly in components

Create circular dependencies

text

### 2. Component Patterns

#### Server Component (Default)

````typescript
// No 'use client' directive
export default async function ServerPage() {
  const data = await fetch('https://api.example.com/data')
  return <div>{/* Server-side rendered */}</div>
}
Client Component
typescript
'use client'

import { useState } from 'react'
export default function InteractiveComponent() {
  const [state, setState] = useState()
  return <div>{/* Client-side interactive */}</div>
}
3. State Management
typescript
// Redux hooks (use typed versions)
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'

// RTK Query hooks
import { useGetStudentsQuery } from '@/store/api/studentApi'

// Local state for UI-only
const [isOpen, setIsOpen] = useState(false)
4. Styling Guidelines
typescript
// Use Tailwind classes
<div className="flex items-center gap-4 p-6 bg-white rounded-xl">

// Use CSS variables for theme colors
<div style={{ color: 'var(--amber)' }}>

// Responsive design (mobile-first)
<div className="text-sm md:text-base lg:text-lg">
🎨 Component Generation Template
Page Component Template
typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params?: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function PageName({ params, searchParams }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-navy">Page Title</h1>
      {/* Content */}
    </div>
  );
}
API Slice Template
typescript
import { baseApi } from './baseApi';

export const featureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => '/endpoint',
      providesTags: ['Feature'],
    }),
    addItem: builder.mutation({
      query: (body) => ({
        url: '/endpoint',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Feature'],
    }),
  }),
});

export const { useGetItemsQuery, useAddItemMutation } = featureApi;
Form Component Template
typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

export function FeatureForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
🔍 Code Review Checklist
When reviewing code, check for:

✅ Architecture
Proper use of 'use client' directive

No direct fetch in client components (use RTK Query)

Correct folder structure

Proper error boundaries

✅ TypeScript
No any types (use unknown with validation)

Proper interface/type naming

Exported types for reusability

Strict null checks

✅ Performance
Dynamic imports for heavy components

Proper memoization (useMemo, useCallback)

No unnecessary re-renders

Image optimization with next/image

✅ Accessibility
Semantic HTML

ARIA labels where needed

Keyboard navigation

Color contrast ratios

✅ Styling
Responsive design (mobile-first)

Consistent spacing (Tailwind classes)

Theme variables used

No inline styles (except dynamic)

🚀 Common Tasks for AI Agent
Task 1: Create a New Page
bash
# Steps:
1. Create file in appropriate app/ subdirectory
2. Add 'use client' if using hooks
3. Import required hooks/components
4. Implement page logic
5. Export default component
Task 2: Add New API Endpoint
bash
# Steps:
1. Identify feature API slice (or create new)
2. Add endpoint with proper tags
3. Export generated hook
4. Use in component
Task 3: Create New Component
bash
# Steps:
1. Create file in components/feature/
2. Define Props interface
3. Implement component logic
4. Export component
5. Add to index.ts if needed
Task 4: Fix Common Issues
bash
# Hydration errors:
- Use useEffect for client-only code
- Add suppressHydrationWarning for text

# Type errors:
- Define missing types/interfaces
- Use type guards for unknown data

# Performance issues:
- Add React.memo for pure components
- Use useCallback for event handlers
- Implement virtualization for long lists
📚 Reference: Key Dependencies
Package	Version	Purpose
next	14.0.4	Framework
@reduxjs/toolkit	1.9.7	State management
react-redux	9.0.4	Redux bindings
redux-persist	6.0.0	State persistence
react-hook-form	7.48.2	Form handling
tailwindcss	3.4.0	Styling
antd	5.12.5	UI components
react-hot-toast	2.4.1	Notifications
🎯 Response Format
When generating code, always:

Show the file path at the top

Include imports in correct order

Add TypeScript types for all props/state

Use proper Tailwind classes

Include error handling for async operations

Add loading states where needed

Example response format:

markdown
## 📄 `src/app/feature/page.tsx`

\`\`\`typescript
'use client';

// Imports here

export default function FeaturePage() {
  // Implementation
}
\`\`\`

## ✅ Explanation
- Brief explanation of the code
- Any important decisions made
- Notes for future enhancements
⚡ Quick Commands Reference
bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Code quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler

# Git
git checkout -b feature/name   # New branch
git commit -m "feat: message"   # Commit with convention
🔗 Related Documentation
Next.js 14 Documentation

Redux Toolkit Guide

Tailwind CSS Documentation

React Hook Form Docs

Agent Environment: Node.js 18+ | TypeScript 5+ | Next.js 14
Last Updated: May 2024

text

---

## ✅ ডেলিভারেবল চেকলিস্ট

| ফাইল | স্ট্যাটাস |
|-------|-----------|
| `CLAUDE.md` | ✅ সম্পূর্ণ |
| `AGENTS.md` | ✅ সম্পূর্ণ |
| Auth Pages (5 files) | ✅ সম্পূর্ণ |
| Dashboard Pages (6+ files) | ✅ সম্পূর্ণ |
| Components (2 files) | ✅ সম্পূর্ণ |
| Store/Redux Setup (6 files) | ✅ সম্পূর্ণ |
| Types (2 files) | ✅ সম্পূর্ণ |

## 🎯 পরবর্তী ধাপ

```bash
# 1. ফাইলগুলো প্রজেক্টে কপি করুন
# 2. ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# 3. এনভায়রনমেন্ট ভেরিয়েবল সেট করুন
cp .env.example .env.local

# 4. ডেভেলপমেন্ট সার্ভার রান করুন
npm run dev

# 5. http://localhost:3000 ওপেন করুন
এই ডকুমেন্টেশন আপনার পুরো প্রজেক্টের জন্য একটি সম্পূর্ণ গাইডলাইন হিসেবে কাজ করবে! 🎉
````
````
