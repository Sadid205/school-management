Phase 1: Core Setup
├── 01_package.json (updated with Redux deps)
├── 02_store/index.ts
├── 03_store/authSlice.ts
├── 04_store/api/baseApi.ts
├── 05_store/api/authApi.ts
├── 06_hooks/redux-hooks.ts
└── 07_providers/ReduxProvider.tsx

Phase 2: Types & Constants
├── 08_types/user.ts
├── 09_types/api.ts
└── 10_lib/constants.ts

Phase 3: Auth Pages (Full RTK Query)
├── 11_app/(auth)/layout.tsx (updated)
├── 12_app/(auth)/login/page.tsx
├── 13_app/(auth)/register/page.tsx
├── 14_app/(auth)/otp-verify/page.tsx
└── 15_app/(auth)/forgot-password/page.tsx

Phase 4: Dashboard Layout
├── 16_app/dashboard/layout.tsx
├── 17_components/dashboard/sidebar.tsx
└── 18_components/dashboard/topbar.tsx

Phase 5: API Services (Future)
├── 19_store/api/studentApi.ts
├── 20_store/api/attendanceApi.ts
└── 21_store/api/purchaseApi.ts
