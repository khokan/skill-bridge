# 🎓 SkillBridge – Full Stack Tutoring Platform

SkillBridge is a modern, role-based tutoring marketplace that connects students with verified tutors. Built with a modular backend and a responsive Next.js frontend, it provides seamless booking, availability management, reviews, and admin controls.

---

## ✨ Key Features

### 👨‍🎓 **For Students**
- Browse and filter tutors by specialty and rating
- Book tutoring sessions with available slots
- Leave reviews and ratings after completed sessions
- Track all bookings and history
- Manage profile and preferences

### 👨‍🏫 **For Tutors**
- Create and manage professional profiles
- Set hourly rates and availability slots
- Accept and complete bookings
- View student reviews and ratings
- Track earnings and booking history

### 🛡️ **For Admins**
- Manage users and roles
- Monitor all bookings and transactions
- Create and manage course categories
- View analytics and platform stats
- Moderation tools

### 🤖 **AI-Powered Features**
- RAG-based tutor recommendations
- Embeddings for semantic search
- Intelligent query responses
- Real-time tutor matching

---

## 🧱 Tech Stack

### **Backend**
- **Node.js** + **Express.js**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL** (Neon DB)
- **Better Auth** (Session-based)
- **OpenRouter API** (LLM for RAG)

### **Frontend**
- **Next.js 16** (App Router)
- **TypeScript**
- **shadcn/ui** (Component library)
- **Tailwind CSS**
- **Server Actions**
- **Sonner** (Toast notifications)
- **React Hook Form** + Zod (Validation)

### **Infrastructure**
- **Vercel** (Frontend & Backend deployment)
- **PostgreSQL (Neon)** (Database)
- **Git** (Version control)

---

## 🗂️ Project Structure

```
skill-bridge/
├── backend/                    # Express API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication
│   │   │   ├── users/         # User management
│   │   │   ├── tutors/        # Tutor listings
│   │   │   ├── tutor-profile/ # Tutor profiles
│   │   │   ├── bookings/      # Booking logic
│   │   │   ├── reviews/       # Reviews & ratings
│   │   │   ├── categories/    # Course categories
│   │   │   ├── admin/         # Admin operations
│   │   │   └── rag/           # RAG (AI Search)
│   │   ├── middlewares/
│   │   │   ├── auth.ts        # Role guards
│   │   │   └── errorHandler.ts
│   │   ├── lib/
│   │   │   ├── prisma.ts
│   │   │   └── auth.ts
│   │   ├── app.ts
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── package.json
│   └── vercel.json
│
├── frontend/                   # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── (commonLayout)/
│   │   │   │   ├── page.tsx       # Landing
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── tutors/
│   │   │   ├── (dashboardLayout)/
│   │   │   │   ├── dashboard/     # Student dashboard
│   │   │   │   ├── tutor/         # Tutor dashboard
│   │   │   │   └── admin/         # Admin dashboard
│   │   │   └── api/
│   │   │       └── rag/          # Proxy endpoints
│   │   ├── components/
│   │   │   ├── modules/          # Feature components
│   │   │   ├── shared/           # Reusable components
│   │   │   └── ui/               # shadcn components
│   │   ├── services/             # API service layer
│   │   ├── actions/              # Server actions
│   │   ├── hooks/                # Custom hooks
│   │   └── constants/            # App constants
│   ├── package.json
│   └── next.config.ts
│
├── README.md                   # This file
└── .gitignore
```

---

## 🔐 Authentication & Authorization

### **Auth System**
- **Provider**: Better Auth (Session-based)
- **Storage**: HTTP-only cookies
- **Strategy**: JWT tokens with session persistence

### **User Roles**
| Role | Access Level | Default Route |
|------|-------------|---------------|
| **STUDENT** | Public + Student features | `/dashboard` |
| **TUTOR** | Public + Tutor features | `/tutor/dashboard` |
| **ADMIN** | All features | `/admin` |

### **Protected Routes**
Backend uses middleware to guard routes:
```typescript
router.get("/me", auth(UserRole.TUTOR), Controller.getMine);
```

Frontend uses `proxy.ts` for role-based redirects.

---

## 📡 API Routes Overview

### 🔓 **Public Endpoints**
```
GET    /api/tutors              # List all tutors
GET    /api/tutors/:id          # Tutor profile
GET    /api/categories          # All categories
POST   /api/auth/sign-up        # Register
POST   /api/auth/sign-in        # Login
```

### 👨‍🎓 **Student Private Routes**
```
GET    /api/bookings            # My bookings
POST   /api/bookings            # Create booking
PATCH  /api/bookings/:id/cancel # Cancel booking
POST   /api/reviews             # Leave review
GET    /api/users/me            # My profile
PATCH  /api/users/me            # Update profile
```

### 👨‍🏫 **Tutor Private Routes**
```
GET    /api/tutor/profile/me    # My profile
POST   /api/tutor/profile       # Create profile
PATCH  /api/tutor/profile       # Update profile
GET    /api/tutor/availability  # My slots
PUT    /api/tutor/availability  # Set availability
GET    /api/tutor/bookings      # My bookings
PATCH  /api/bookings/:id/complete
GET    /api/tutor/reviews       # My reviews
```

### 🛡️ **Admin Private Routes**
```
GET    /api/admin/stats         # Dashboard stats
GET    /api/admin/users         # Manage users
GET    /api/admin/bookings      # All bookings
GET    /api/admin/categories    # Categories
POST   /api/admin/categories    # Create category
PATCH  /api/admin/categories/:id
```

### 🤖 **RAG AI Endpoints**
```
POST   /api/rag/query           # AI tutor search
POST   /api/rag/index           # Index profiles
GET    /api/rag/stats           # RAG stats
```

---

## 🔁 Core Business Workflows

### **Booking Lifecycle**
```
1. Student browses tutors
2. Student selects available slot
3. Booking created → CONFIRMED
4. Tutor completes session
5. Booking → COMPLETED
6. Student leaves review
```

### **Review System**
- Reviews only allowed on COMPLETED bookings
- One review per booking
- Auto-calculates tutor `avgRating` and `reviewCount`

### **Availability Management**
- Tutors set time slots (startTime, endTime)
- Students book from available slots
- System prevents double-booking

---

## 📊 Database Schema Overview

### **Key Models**
| Model | Purpose |
|-------|---------|
| `User` | Authentication & profile |
| `TutorProfile` | Tutor information |
| `AvailabilitySlot` | Time slots |
| `Booking` | Session reservations |
| `Review` | Ratings & feedback |
| `Category` | Subject categories |
| `DocumentEmbedding` | RAG vectors |

### **Relations**
- User → TutorProfile (1:1)
- User → Booking (1:many)
- TutorProfile → AvailabilitySlot (1:many)
- TutorProfile → Review (1:many)
- Category → TutorCategory (many:many)

---

## 🚀 Setup & Installation

### **Prerequisites**
- Node.js 18+
- pnpm (or npm)
- PostgreSQL (Neon)
- Git

### **Clone Repository**
```bash
git clone https://github.com/yourusername/skill-bridge.git
cd skill-bridge
```

### **Backend Setup**

```bash
cd backend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials:
# DATABASE_URL=postgres://...
# BETTER_AUTH_SECRET=your_secret
# OPENROUTER_API_KEY=your_key

# Run migrations
pnpm prisma migrate dev

# Start development server
pnpm dev
# Backend runs on http://localhost:5000
```

### **Frontend Setup**

```bash
cd frontend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start development server
pnpm dev
# Frontend runs on http://localhost:3000
```

---

## 🧪 Running Locally

### **Start Backend**
```bash
cd backend
pnpm dev
```

### **Start Frontend** (in another terminal)
```bash
cd frontend
pnpm dev
```

### **Access the App**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)

---

## 📦 Building for Production

### **Build Backend**
```bash
cd backend
pnpm build
```

### **Build Frontend**
```bash
cd frontend
pnpm build
pnpm start
```

---

## 🌐 Deployment

### **Deploy to Vercel**

#### **Backend**
```bash
cd backend
vercel --prod
```

#### **Frontend**
```bash
cd frontend
vercel --prod
```

### **Environment Variables (Vercel)**

**Backend Project:**
```
DATABASE_URL=postgres://...
BETTER_AUTH_SECRET=...
OPENROUTER_API_KEY=...
APP_URL=https://skillbridge-be.vercel.app
FRONTEND_URL=https://skillbridge-fe.vercel.app
```

**Frontend Project:**
```
NEXT_PUBLIC_API_URL=https://skillbridge-be.vercel.app/api
```

---

## 🤖 RAG (Retrieval-Augmented Generation)

### **How It Works**
1. Tutor profiles are indexed with embeddings
2. Queries are converted to vectors
3. Semantic search finds relevant profiles
4. LLM generates recommendations

### **API Usage**
```bash
POST /api/rag/query
Content-Type: application/json

{
  "query": "Math tutor for calculus",
  "limit": 5
}
```

**Response:**
```json
{
  "answer": {
    "recommendations": [
      {
        "name": "John Doe",
        "reason": "Expert in Calculus",
        "matchedCategories": ["Math"],
        "strengths": ["Patient", "Clear explanations"]
      }
    ],
    "summary": "Found 2 highly-rated calculus tutors"
  },
  "sources": [...],
  "contextUsed": true
}
```

---

## 🎨 UI/UX Highlights

### **Design System**
- Built on **shadcn/ui** components
- Tailwind CSS for styling
- Responsive across all devices
- Dark mode compatible

### **Key Components**
- Booking modal with calendar
- Availability slot picker
- Review dialog
- Admin dashboards
- Tutor profile cards
- Loading animations
- Toast notifications

### **Loading Animation**
Premium animated loading screen with rotating rings and pulsing effects.

---

## 🐛 Error Handling

### **Backend**
- Global error handler middleware
- Consistent JSON error responses
- Prisma transaction rollback
- Detailed console logging

### **Frontend**
- Server Action error boundaries
- Toast notifications for user feedback
- Fallback error pages
- Network error handling

---

## 📋 Environment Variables

### **Backend (.env)**
```env
PORT=5000
DATABASE_URL=postgresql://user:password@host/database
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:5000
APP_URL=http://localhost:3000
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_LLM_MODEL=nvidia/nemotron-3-super-120b-a12b:free
OPENROUTER_EMBEDDING_MODEL=nvidia/llama-nemotron-embed-vl-1b-v2:free
NODE_ENV=development
```

### **Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📚 Additional Resources

### **Documentation**
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [Better Auth](https://www.better-auth.com)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Roadmap & Future Improvements

### **Planned Features**
- ✅ Real-time messaging between tutor & student
- ✅ Payment gateway integration (Stripe)
- ✅ Video conferencing integration
- ✅ Advanced analytics & reporting
- ✅ Notification system (email, SMS)
- ✅ Tutor verification system
- ✅ Performance optimizations
- ✅ Mobile app (React Native)

### **Known Issues**
- CORS configuration on Vercel (resolved with proxy)
- Rate limiting on OpenRouter API

---

## 💬 Support & Contact

For questions or issues, please:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact: [your-email@example.com]

---

**Built with ❤️ by the SkillBridge Team**

Last Updated: May 3, 2026