## Prompt 1

### Objective:
Design a service layer for a Node.js CRUD application following separation of concerns principles.

### AI Usage:
Used AI to evaluate architectural approaches for business logic placement.

### Human Validation:
Final implementation decisions were made manually after reviewing maintainability and testability considerations.


## Prompt 2

### Objective
Evaluate whether business-layer failures should return null values or throw exceptions in a layered Node.js application.

### AI Output Usage
AI-generated architectural alternatives were reviewed.

### Human Validation
I selected exception-based handling to support centralized error management and cleaner controller implementation.