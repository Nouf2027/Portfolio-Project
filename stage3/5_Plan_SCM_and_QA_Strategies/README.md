# SCM and QA Strategies for Jeel Platform


## SCM Strategy 

### Version Control
We use **Git** and **GitHub** for version control and collaboration. 

This helps us:
- Track code changes
- Restore previous versions
- Work as a team without conflicts

---

### Branching Strategy

We follow this branch structure:

#### main
Stable production-ready version of Jeel.

#### development
Used to combine completed features for testing.

#### feature branches
Each task has its own branch.

Examples:
- feature/search-filter
- feature/map-view
- feature/reviews-system
- feature/online-payment
- feature/chat-system

---

### Workflow Process

1. Create a feature branch from development  
2. Implement the assigned feature  
3. Commit changes frequently  
4. Push code to GitHub  
5. Another team member reviews code  
6. Merge into development  
7. When stable → merge into main  

---

### Code Review Rules

- No direct commits to main  
- Pull request required before merging  
- Clear commit messages  

---

## QA Strategy

### Unit Testing
Testing individual components separately.

Examples:
- Search filter  
- Login validation  
- Payment validation  

---

### Integration Testing
Testing how components work together.

Examples:
- Frontend with backend API  
- Backend with PostgreSQL  
- Google Maps API integration  

---

### End-to-End Testing
Testing the complete user journey.

Examples:
- Search for a center  
- Compare centers  
- Register child  
- Make payment  

---

### Testing Tools

- Postman → API testing  
- Jest → Unit testing  
- Google Chrome DevTools → Responsive testing  

---

### Deployment Pipeline

#### Development Environment
For coding and internal testing.

#### Staging Environment
For final review before launch.

#### Production Environment
Live version for users. 
