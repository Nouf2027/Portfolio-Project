## Jeel - جيل 🌱 | Project Charter 📋
> Stage 2: Project Charter Development — Holberton School SAU-0825 · 2026

---

##  Project Objectives | أهداف المشروع

### Purpose
jeel (جيل) is a web platform designed to help parents discover, compare, and enroll their children in skill development centers across the Kingdom. Through a smart search and filtering system, parents can find the most suitable centers based on location, age group, skill category, and budget — all in one place.

### SMART Objectives

| # | Objective |
|---|-----------|
| 1 | Launch a working platform that enables parents to search for and find educational centers for children by the end of Week 10 (MVP milestone), including core features like search, filters, and center listings. |
| 2 | Provide detailed Arabic-language profiles for each educational center (services, age groups, pricing, location, and contact info) before the Stage 4 MVP deadline (end of Week 10) |
| 3 | Achieve at least 75% user satisfaction ("found a suitable center easily") in user testing conducted during Stage 5 closure (Week 12) |

---

## Stakeholders & Team Roles | أصحاب المصلحة وأدوار الفريق

### Stakeholders

| Type | Stakeholder | Interest / Role |
|------|-------------|-----------------|
| Internal | Development Team (4 members) | Build, design, and deliver the platform |
| Internal | Holberton School Instructors / Tutors | Provide guidance and evaluate deliverables |
| External | Parents | Primary users; search for suitable educational centers based on location, price, ratings, and services |
| External | Educational Centers for Children | List and promote their services (tutoring, activities, skill development) to attract more customers |
| External | Government / Regulatory Bodies | Ensure that listed centers comply with educational standards and regulations |


### Team Roles

| Name | GitHub | Role | Responsibilities |
|------|--------|------|-----------------|
| Reem Abdullah | [@Reemabdu213](https://github.com/Reemabdu213) | Project Coordinator | 🔐 Auth feature (Registration, Login, JWT, user profile) + overall progress tracking |
| Nouf Al-Mutairi | [@Nouf2027](https://github.com/Nouf2027) | UX & Search Lead | 🔍 Search & Filter Feature (by location, age, price, type of service) + user-friendly interface for parents |
| Hadeel Al-Mutairi | [@had271](https://github.com/had271) | Content & Database Lead | 🏫 Centers Data & Reviews (database design, center info, ratings, reviews system, seed data) |
| Dalal Al-Shamrani | [@q400400200-pixel](https://github.com/q400400200-pixel) | Data & Integration Lead | 🗺️ Educational Centers Listing (center profiles, services, location integration, API endpoints) |

### Shared Responsibilities
- All members contribute to **code reviews** and **testing**
- All members participate in **weekly stand-ups** and sprint planning
- **Reem** coordinates between features and tracks overall progress
- **Dalal** maintains project documentation and database schema
-  **Nouf** focuses on improving the user experience and search functionality, ensuring parents can easily find suitable centers
- **Hadeel** manages educational centers data integration, including APIs, location data, and keeping center information consistent and up-to-date.

---

## Scope | نطاق المشروع

### In-Scope ✅
- Platform to search and discover educational centers for children based on location, age group, and type of service
- Detailed educational center profiles (services, age groups, pricing, schedule, contact information)
- Search & filtering system (location, price, ratings, type: tutoring, daycare, activities)
- User authentication (registration / login via JWT)
- Responsive web interface (React.js / Next.js)
- REST API backend (Node.js / Express + PostgreSQL)

### Out-of-Scope ❌
- Mobile native apps (iOS / Android).
- Community forum / peer discussion *(planned for future work)*.
- Direct payment system (can be added in future work).
- Job application or recruitment services.
- AI-based recommendations or smart matching.
- Real-time chat between parents and centers.

---

## Risks | المخاطر

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|------------|--------|------------|
| 1 | Low user adoption / trust in a new platform | Medium | High | Beta test with Holberton cohort; collect feedback early |
| 2 | Team members lack experience with some tools | Medium | Medium | Dedicated learning sprints in Weeks 1–2; pair programming |
| 3 | Timeline delays due to team availability | Low | Medium | Weekly stand-ups; buffer days built into each stage |
| 4 | Incomplete or inaccurate educational centers data | Medium | High | Verify data sources, allow centers to update their information, and implement admin review system |



---

## High-Level Plan | الخطة الزمنية

### Timeline (12 Weeks)
<img width="965" height="1010" alt="image" src="https://github.com/user-attachments/assets/cb171cdf-042b-475f-a235-ce630add2a13" />

### Key Milestones
- **End of Week 2** → Project Charter approved by instructors
- **End of Week 4** → Technical documentation finalized
- **End of Week 6** → Core quiz + roadmap working *(mid-sprint demo)*
- **End of Week 10** → Full MVP deployed and tested
- **End of Week 12** → Final presentation and project closure

---

## 📄 License
This project is part of **Holberton School SAU-0825** portfolio project — 2026
