edunest/
├── package.json
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
├── .env.example
├── src/
│ ├── app/
│ │ ├── layout.tsx
│ │ ├── globals.css
│ │ ├── (auth)/
│ │ │ ├── layout.tsx
│ │ │ ├── login/page.tsx
│ │ │ ├── register/page.tsx
│ │ │ ├── otp-verify/page.tsx
│ │ │ └── forgot-password/page.tsx
│ │ └── dashboard/
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ ├── students/
│ │ │ ├── page.tsx
│ │ │ ├── add/page.tsx
│ │ │ └── [id]/page.tsx
│ │ ├── attendance/
│ │ │ └── mark/page.tsx
│ │ ├── purchases/page.tsx
│ │ └── courses/page.tsx
│ ├── components/
│ │ └── dashboard/
│ │ ├── sidebar.tsx
│ │ └── topbar.tsx
│ ├── store/
│ │ ├── index.ts
│ │ ├── authSlice.ts
│ │ └── api/
│ │ ├── baseApi.ts
│ │ └── authApi.ts
│ ├── hooks/
│ │ └── redux-hooks.ts
│ ├── providers/
│ │ └── ReduxProvider.tsx
│ ├── types/
│ │ ├── user.ts
│ │ └── api.ts
│ └── lib/
│ └── constants.ts
