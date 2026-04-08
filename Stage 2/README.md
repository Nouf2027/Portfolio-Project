# Masar - مسار | Project Charter 📋
> Stage 2: Project Charter Development — Holberton School SAU-0825 · 2026

---

## 0. Project Objectives | أهداف المشروع

### Purpose
Masar (مسار) is a web platform designed to guide Saudi fresh graduates and tech newcomers in identifying their ideal technical career path. It addresses the lack of Arabic-language, Saudi-market-focused career guidance by providing personalized roadmaps, required skills, tools, job titles, and certifications — all tailored to Vision 2030's growing tech sector.

### SMART Objectives

| # | Objective |
|---|-----------|
| 1 | Launch a functional career-path quiz that recommends **at least 3 tech tracks** to Saudi users by the end of Week 7 (MVP milestone), with the ability to expand tracks in future releases |
| 2 | Deliver fully detailed **Arabic-language roadmaps** (skills, tools, job titles, certifications) for each recommended career track before the Stage 4 MVP deadline (end of Week 7) |
| 3 | Achieve a **75% user satisfaction score** ("found the recommendation helpful") in post-demo testing conducted during Stage 5 closure (Week 8) |

---

## 1. Stakeholders & Team Roles | أصحاب المصلحة وأدوار الفريق

### Stakeholders

| Type | Stakeholder | Interest / Role |
|------|-------------|-----------------|
| Internal | Development Team (4 members) | Build, design, and deliver the platform |
| Internal | Holberton School Instructors / Tutors | Provide guidance and evaluate deliverables |
| External | Saudi Fresh Graduates & Tech Newcomers | Primary end-users who benefit from career guidance |
| External | Saudi Job Market (Vision 2030) | Shapes the career data and relevance of the platform |

### Team Roles

| Name | GitHub | Role | Responsibilities |
|------|--------|------|-----------------|
| Reem Abdullah | [@Reemabdu213](https://github.com/Reemabdu213) | Project Coordinator | 🔐 Auth feature (Registration, Login, JWT, user profile) + overall progress tracking |
| Nouf Al-Mutairi | [@Nouf2027](https://github.com/Nouf2027) | Brainstorming Lead | 🎯 Career Quiz feature (Quiz UI, scoring logic, API, result storage) |
| Hadeel Al-Mutairi | [@had271](https://github.com/had271) | Research Lead | 🗺️ Career Roadmaps feature (roadmap pages, skills & tools data, API endpoints) |
| Dalal Al-Shamrani | [@q400400200-pixel](https://github.com/q400400200-pixel) | Documentation Lead | 💼 Job Titles, Certifications & Database (pages, data, DB schema & seed data) |

### Shared Responsibilities
- All members contribute to **code reviews** and **testing**
- All members participate in **weekly stand-ups** and sprint planning
- **Reem** coordinates between features and tracks overall progress
- **Dalal** maintains project documentation and database schema

---

## 2. Scope | نطاق المشروع

### In-Scope ✅
- Career-path quiz that recommends a tech track based on user answers
- Detailed roadmaps per career track: skills, tools, programming languages
- Job titles and Saudi market opportunities for each path
- Recommended professional certifications per track
- User authentication (registration / login via JWT)
- Arabic-first content tailored to the Saudi tech market
- Responsive web interface (React.js / Next.js)
- REST API backend (Node.js / Express + PostgreSQL)

### Out-of-Scope ❌
- Mobile native apps (iOS / Android)
- Community forum / peer discussion *(planned for future release)*
- Job application or recruitment services
- AI-powered personalisation or machine learning recommendations
- Payment or subscription management
- Integration with external job boards (LinkedIn, Bayt, etc.)

---

## 3. Risks | المخاطر

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|------------|--------|------------|
| 1 | Low user adoption / trust in a new platform | Medium | High | Beta test with Holberton cohort; collect feedback early |
| 2 | Career data becomes outdated quickly | High | Medium | Link to live sources (roadmap.sh, MCIT); schedule quarterly reviews |
| 3 | Team members lack experience with some tools | Medium | Medium | Dedicated learning sprints in Weeks 1–2; pair programming |
| 4 | Saudi market data is hard to find / verify | Medium | High | Use MCIT & LinkedIn Insights as primary sources; document all references |
| 5 | Scope creep (community forum added too early) | Medium | High | Strictly enforce out-of-scope list; defer community feature to v2 |
| 6 | Timeline delays due to team availability | Low | Medium | Weekly stand-ups; buffer days built into each stage |

---

## 4. High-Level Plan | الخطة الزمنية

### Timeline (12 Weeks)


<img width="1920" height="1080" alt="Gantt Chart Whiteboard (1)" src="https://github.com/user-attachments/assets/5d497948-bac5-4c4e-84e7-3e667f112c3c" />

### Key Milestones
- **End of Week 2** → Project Charter approved by instructors
- **End of Week 4** → Technical documentation finalized
- **End of Week 5** → Core quiz + roadmap working *(mid-sprint demo)*
- **End of Week 7** → Full MVP deployed and tested
- **End of Week 8** → Final presentation and project closure

---

## 📄 License
This project is part of **Holberton School SAU-0825** portfolio project — 2026
