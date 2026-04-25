Jeel - جيل 🌱 | Project Charter 📋
(Stage 3) - Technical Documentation — Holberton School SAU-0825 · 2026

## Task 0: User Stories and Mockups

### User Stories (MoSCoW)

#### Parents (End Users)

**Must Have:**
- As a parent, I want to create an account, so that I can use the platform.
- As a parent, I want to search for children's centers, so that I can find suitable options.
- As a parent, I want to view center details, so that I can compare services and prices.
- As a parent, I want to book a course, so that my child can attend activities.

**Should Have:**
- As a parent, I want to filter centers by location, so that I can find nearby options.
- As a parent, I want to read reviews, so that I can choose a trusted center.

**Could Have:**
- As a parent, I want to save favorite centers, so that I can return to them later.
- As a parent, I want to receive notifications, so that I stay updated on bookings.

**Won't Have:**
- As a parent, I want to chat directly with centers inside the platform, so that I can ask questions.

---

#### Centers (Service Providers)

**Must Have:**
- As a center, I want to create an account, so that I can list my services.
- As a center, I want to add courses/services, so that parents can view them.
- As a center, I want to receive booking requests, so that I can manage customers.

**Should Have:**
- As a center, I want to update my profile, so that information remains accurate.

**Could Have:**
- As a center, I want to view analytics, so that I can track performance.

**Won't Have:**
- As a center, I want to run paid advertisements inside the platform.

---

#### Admin

**Must Have:**
- As an admin, I want to approve or reject centers, so that I ensure quality and trust.
- As an admin, I want to manage users, so that the platform operates smoothly.

**Should Have:**
- As an admin, I want to monitor bookings, so that I can oversee platform activity.

**Could Have:**
- As an admin, I want to generate reports, so that I can analyze system usage.

---

### Mockups — Main Screens

| Screen | Description |
|--------|-------------|
| 1. Login / Registration | Includes email and password fields, login button, and option to create a new account. |
| 2. Home Screen | Displays a search bar, list of available centers, and filtering options (location, category). |
| 3. Center Details | Shows center name, images, list of courses, pricing details, and a Book Now button. |
| 4. Booking Screen | Allows selecting a course, choosing date/time, and confirming the booking. |
| 5. Center Dashboard | Enables centers to add/edit courses, view bookings, and manage their profile. |

---

## Task 1: System Architecture

### Architecture Diagram

```
+------------------+     +------------------+     +------------------+
|     Parent       |     |     Center       |     |     Admin        |
+------------------+     +------------------+     +------------------+
         |                        |                        |
         +------------------------+------------------------+
                                  |
                            HTTPS Requests
                                  |
                                  v
         +------------------------------------------------+
         |           Frontend — React.js / Next.js        |
         |  Search · Profiles · Booking · Login · Dashboard|
         +------------------------------------------------+
                                  |
                            REST API / JSON
                                  |
                                  v
         +------------------------------------------------+
         |           Backend — Node.js / Express          |
         |  Auth (JWT) · Search · Bookings · Reviews      |
         |  Centers · Admin Controls                      |
         +------------------------------------------------+
                    |                          |
               SQL Queries                 API Calls
                    |                          |
                    v                          v
     +--------------------+       +--------------------+
     |   PostgreSQL DB    |       |   External APIs    |
     | Users · Centers    |       | Google Maps        |
     | Programs · Bookings|       | Cloudinary         |
     | Reviews            |       +--------------------+
     +--------------------+
```

### Data Flow

1. The user (Parent, Center, or Admin) accesses the platform via a web browser.
2. The Frontend (React.js / Next.js) sends HTTP requests to the Backend API.
3. The Backend (Node.js / Express) processes the request and queries the Database.
4. PostgreSQL returns data to the Backend, which sends it as JSON to the Frontend.
5. The Frontend renders the response to the user.

---
## Task 2:Define Components, Classes, and Database Design
### Back-end Classes
<img width="1042" height="656" alt="UML_class" src="https://github.com/user-attachments/assets/d18c9208-1b3c-4600-9cfe-84c351b66f15" />

### Front-end Components
<img width="582" height="391" alt="Define Components" src="https://github.com/user-attachments/assets/348d3945-fa2d-4ff3-b481-7d169b2a9de8" />

### Relational Database Schema
- users table: id (PK), name, email, password, and role (parent/admin).
- centers table: id (PK), name, location, description, approved, and owner_id (FK → users).
- courses table: id (PK), name, age_range, price, and center_id (FK → centers).
- bookings table: id (PK), user_id (FK → users), course_id (FK → courses), date, and status (pending/confirmed/cancelled).
- reviews table: id (PK), user_id (FK → users), centre_id (FK → centers), rating (1–5), and comment.
### Relationships
- A user can own one or more centers via owner_id. 
- A center can have one or more courses via center_id. 
- A user can make one or more bookings via user_id, and each booking is linked to a specific course via course_id. 
- A user can write one or more reviews via user_id, and each review is linked to a specific center via centre_id.

---

## Task 3 :  Create High-Level Sequence Diagrams

## Use Case: User Login / Search / Booking

<img width="801" height="1292" alt="IMG_2387" src="https://github.com/user-attachments/assets/52e9cfcd-d72a-440a-b315-c19f74f488b0" />


---
## Task 4: Document External and Internal APIs 

## 🔹 External APIs

| API | Usage | Reason |
|-----|------|--------|
| Google Maps API | Display training center locations | Provides accurate maps and easy integration |
| Smart Image Repository (Cloud Storage) | Store and manage images for courses and centers | Enables fast, scalable, and organized image handling |

---

## 🔹 Internal API Endpoints

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| `/courses` | GET | Query (age, category) | List of courses (JSON) |
| `/courses/:id` | GET | Course ID | Course details |
| `/centers` | GET | - | List of centers |
| `/centers/:id` | GET | Center ID | Center details |
| `/book` | POST | JSON (user_id, course_id) | Booking confirmation |
| `/auth/register` | POST | JSON (name, email, password) | User account created |
| `/auth/login` | POST | JSON (email, password) | Authentication token (JWT) |

---

## 🔹 Example Request (Booking)

```json
{
  "user_id": 1,
  "course_id": 5
}

## 🔹 API Notes

- All requests and responses use JSON format.
- Authentication is handled using JWT (custom backend system).
- The API follows RESTful design principles.

---

## Task 5 : SCM and QA Strategies

##  SCM Strategy

The project uses Git for version control to manage code changes and collaboration.

### 🔹 Branching Strategy
- **main**: Production-ready code  
- **develop**: Development branch  
- **feature/***: Individual feature branches  

### 🔹 Workflow
- Each feature is developed in a separate branch  
- Regular commits with clear messages are required  
- Pull Requests (PRs) are created for review  
- Code reviews are performed before merging into `develop`  
- Stable code is merged into `main` for production  

---

##  QA Strategy

The project follows multiple testing strategies to ensure quality and reliability.

### 🔹 Testing Types
- **Unit Testing**: Tests individual functions and components  
- **Integration Testing**: Tests API endpoints and system interactions  
- **Manual Testing**: Tests user flows such as search, booking, and login  

### 🔹 Testing Tools
- **Jest**: Used for unit testing JavaScript/TypeScript code  
- **Postman**: Used for API testing  

### 🔹 Deployment Pipeline
- **Staging Environment**: Used to test new features before release  
- **Production Environment**: Final stable version available to users    
