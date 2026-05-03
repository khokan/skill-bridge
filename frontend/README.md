
# 🎓 SkillBridge – Frontend

SkillBridge Frontend is a modern, role-aware web application built with Next.js and shadcn/ui.  
It provides distinct experiences for Students, Tutors, and Admins.

---

## 🧱 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **shadcn/ui**
- **Tailwind CSS**
- **Server Actions**
- **Sonner (toast notifications)**

---

## 🗂️ Project Structure

src/
├─ app/
│ ├─ (public)/
│ │ ├─ page.tsx
│ │ ├─ tutors/
│ │ └─ tutors/[id]/
│ ├─ dashboard/ # Student
│ ├─ tutor/ # Tutor
│ └─ admin/ # Admin
├─ actions/
├─ services/
├─ components/
├─ constants/
└─ proxy.ts


---

## 🔐 Authentication Flow

- Uses **Better Auth**
- Session fetched via API
- Role-based redirects via `proxy.ts`

### Default Redirects
| Role | Redirect |
|----|---------|
| Student | `/dashboard` |
| Tutor | `/tutor/dashboard` |
| Admin | `/admin` |

---

## 🧭 Routes Overview

### 🌍 Public
| Route | Description |
|-----|------------|
| `/` | Landing page |
| `/tutors` | Browse tutors |
| `/tutors/:id` | Tutor profile & booking |
| `/login` | Login |
| `/register` | Register |

---

### 👨‍🎓 Student
| Route | Description |
|-----|------------|
| `/dashboard` | My bookings |
| `/dashboard/profile` | Profile |
| Review modal | Leave review |

---

### 👨‍🏫 Tutor
| Route | Description |
|-----|------------|
| `/tutor/dashboard` | Tutor bookings |
| `/tutor/profile` | Profile |
| `/tutor/availability` | Availability |
| `/tutor/reviews` | Ratings & reviews |

---

### 🛡️ Admin
| Route | Description |
|-----|------------|
| `/admin` | Stats |
| `/admin/users` | Manage users |
| `/admin/bookings` | All bookings |
| `/admin/categories` | Categories |

---

## 🔁 Data Fetch Pattern


- All pages use:
  - `try/catch`
  - Toast notifications
- Server Actions for mutations
- Services handle cookies & API calls

---

## 🎨 UI Principles

- shadcn components only
- Consistent spacing & typography
- Accessible dialogs & tables
- Clear loading & error states

---

## ⚙️ Environment Variables

---

## ▶️ Run Frontend

```bash
pnpm install
pnpm dev

⭐ UX Highlights

Booking modal with slot selection

Role-aware navbar

Review dialog after completion

Admin-safe pages

Clean dashboards

📌 Future Enhancements

Realtime updates

Chat between tutor & student

Payment gateway

Dark mode