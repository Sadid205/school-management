# 🎓 EduNest - School Management System

A modern, responsive school management system built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**.

## ✨ Features

### Authentication & Security
- ✅ User registration with role-based access (Student, Teacher, Parent, Admin, Super Admin)
- ✅ Email-based login with OTP verification
- ✅ Password reset functionality
- ✅ Secure session management

### Student Management
- ✅ Complete student database with detailed profiles
- ✅ Student class assignment
- ✅ Guardian information tracking
- ✅ Enrollment date tracking
- ✅ Student status management (Active, Inactive, Suspended)
- ✅ Bulk import/export functionality

### Attendance Management
- ✅ Daily attendance marking for classes
- ✅ Multiple status options (Present, Absent, Leave)
- ✅ Real-time attendance statistics
- ✅ Attendance reports and analytics
- ✅ Detailed attendance history per student

### Academic Management
- ✅ Course management
- ✅ Exam scheduling and results
- ✅ Assignment tracking
- ✅ Grade management
- ✅ Report cards

### Inventory & Purchases
- ✅ Purchase order management
- ✅ Supplier management
- ✅ Inventory tracking
- ✅ Stock management
- ✅ Purchase history and reports

### Finance Module
- ✅ Fee collection management
- ✅ Salary management for staff
- ✅ Financial reports and analytics
- ✅ Payment tracking

### Analytics & Reports
- ✅ Real-time dashboard with KPI cards
- ✅ Attendance trends
- ✅ Student performance analytics
- ✅ Financial reports
- ✅ Customizable reports

## 🎨 Design System

### Color Scheme
- **Primary Navy**: `#0f1f3d` - Main brand color
- **Accent Amber**: `#f5a623` - Action buttons and highlights
- **Success Green**: `#1d9e75` - Confirmation and success states
- **Danger Red**: `#e24b4a` - Alerts and errors
- **Neutral Grays**: Backgrounds and text

### Typography
- Font Family: Segoe UI, System UI, Apple System
- Sizes: 11px (smallest) to 28px (headings)
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Components
- Cards with subtle shadows and borders
- Responsive tables with hover effects
- Modal dialogs for actions
- Toast notifications
- Loading skeletons
- Progress indicators

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/edunest.git
cd edunest
```

2. **Install dependencies**
```bash
npm install
```

3. **Copy environment variables**
```bash
cp .env.example .env.local
```

4. **Update `.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=EduNest
```

5. **Run development server**
```bash
npm run dev
```

6. **Open in browser**
```
http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes group
│   ├── dashboard/         # Dashboard routes with layout
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── dashboard/         # Dashboard components
│   ├── auth/             # Auth components
│   └── common/           # Common UI components
├── lib/                   # Utility functions and helpers
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── context/              # React Context API
└── styles/               # CSS utilities and variables
```

## 🔧 Technology Stack

### Frontend
- **Framework**: Next.js 16.2.6
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Icons**: React Feather
- **Forms**: React Hook Form
- **State Management**: React Context API
- **UI Components**: Custom built with Tailwind

### Backend Integration
- **API**: RESTful API (OpenAPI 3.0)
- **Authentication**: JWT/Session-based
- **HTTP Client**: Fetch API (can use Axios)

## 🎯 Page Routes

### Public Pages
- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password recovery

### Protected Pages (Dashboard)
- `/dashboard` - Main dashboard
- `/dashboard/students` - Student management
- `/dashboard/attendance` - Attendance marking
- `/dashboard/courses` - Course management
- `/dashboard/exams` - Exam management
- `/dashboard/results` - Results view
- `/dashboard/assignments` - Assignment tracking
- `/dashboard/purchases` - Purchase management
- `/dashboard/inventory` - Inventory management
- `/dashboard/finance/*` - Finance module
- `/dashboard/reports` - Reports
- `/dashboard/analytics` - Analytics
- `/dashboard/profile` - User profile
- `/dashboard/settings` - Settings

## 🔌 API Integration

The app connects to a Django REST API. Update the API client in `src/lib/api-client.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
```

## 🎓 Authentication Flow

### Login Process
1. User enters email and password on `/login`
2. API validates credentials
3. JWT token returned
4. Token stored in localStorage/cookies
5. User redirected to `/dashboard`

### OTP Verification
1. User registers on `/register`
2. OTP sent to email
3. User verifies OTP on `/otp-verify`
4. Account activated

### Password Reset
1. User enters email on `/forgot-password`
2. OTP sent to email
3. User enters new password with OTP
4. Password updated successfully

## 🛡️ Security Features

- ✅ XSS Protection (via React)
- ✅ CSRF Protection (CORS headers)
- ✅ Secure password handling
- ✅ Session expiration
- ✅ Role-based access control
- ✅ Input validation
- ✅ SQL injection prevention (backend)

## 📱 Responsive Design

- **Mobile**: 100% responsive with touch-friendly buttons
- **Tablet**: Optimized layout with sidebar collapse
- **Desktop**: Full-featured interface

### Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Run Linting
```bash
npm run lint
```

### Build Check
```bash
npm run build
```

## 📊 Performance Optimization

- ✅ Code splitting with dynamic imports
- ✅ Image optimization
- ✅ CSS-in-JS minification
- ✅ Tree shaking
- ✅ Lazy loading of components

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD npm start
```

```bash
docker build -t edunest .
docker run -p 3000:3000 edunest
```

### Traditional VPS
```bash
npm run build
pm2 start npm --name "edunest" -- start
```

## 🔐 Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://api.edunest.local
API_SECRET_KEY=your_secret_key_here

# App Configuration
NEXT_PUBLIC_APP_NAME=EduNest
NEXT_PUBLIC_APP_VERSION=1.0.0

# Authentication
AUTH_REDIRECT_URL=http://localhost:3000/dashboard

# Third-party Integrations (optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## 📚 Component Documentation

### Sidebar Component
```typescript
import Sidebar from '@/components/dashboard/sidebar';

// Usage
<Sidebar />
```

### Topbar Component
```typescript
import Topbar from '@/components/dashboard/topbar';

// Usage
<Topbar user={{ name: "John Doe", email: "john@example.com", role: "Admin" }} />
```

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Clear Build Cache
```bash
rm -rf .next
npm run build
```

### Module Not Found
```bash
rm -rf node_modules
npm install
```

## 📖 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 👥 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@edunest.local or open an issue on GitHub.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Feather Icons](https://feathericons.com)
- Inspired by modern SaaS applications

---

**Made with ❤️ for educators and students**

Last Updated: January 2024
Version: 1.0.0
