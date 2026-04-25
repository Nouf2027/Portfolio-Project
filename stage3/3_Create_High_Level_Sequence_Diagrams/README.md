
## Task 3: Sequence Diagrams

### Sequence Diagram - Jeel Platform

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    participant ExternalAPI as External APIs

    rect rgb(230, 245, 255)
    Note over User,ExternalAPI: Scenario 1: User Login
    User->>Frontend: Enter email and password
    Frontend->>Backend: POST /auth/login
    Backend->>Database: Validate user credentials
    Database-->>Backend: User data
    Backend-->>Frontend: JWT token
    Frontend-->>User: Redirect to Home Page
    end

    rect rgb(235, 255, 235)
    Note over User,ExternalAPI: Scenario 2: Search for Centers
    User->>Frontend: Search by location, age, category
    Frontend->>Backend: GET /centers?location=&age=&category=
    Backend->>Database: Query matching centers
    Backend->>ExternalAPI: Get map/location data
    Database-->>Backend: Centers data
    ExternalAPI-->>Backend: Location data
    Backend-->>Frontend: Centers list as JSON
    Frontend-->>User: Display search results
    end

    rect rgb(255, 240, 245)
    Note over User,ExternalAPI: Scenario 3: Book a Course
    User->>Frontend: Select course and booking date
    Frontend->>Backend: POST /book
    Backend->>Database: Save booking record
    Database-->>Backend: Booking confirmation
    Backend-->>Frontend: Success response
    Frontend-->>User: Show booking confirmation
    end
