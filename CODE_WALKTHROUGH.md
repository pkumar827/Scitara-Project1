# Scitara Project 1 - Code Walkthrough

## 📋 Project Overview

A comprehensive **User Management System** built with a **Node.js/Express backend** and **Playwright automation testing framework**. The system includes REST API endpoints, WebSocket real-time notifications, data validation, and 58+ automated tests.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Playwright)                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐         ┌─────────────────────┐   │
│  │  REST API Tests  │         │  WebSocket Tests    │   │
│  │  (JSON/Schema)   │◄────────►│  (Real-time msgs)   │   │
│  └──────────────────┘         └─────────────────────┘   │
│           ▲                              ▲                │
│           │ HTTP Requests                │ ws://...      │
│           │                              │                │
└─────────────┼──────────────────────────────┼──────────────┘
              │                              │
         ┌────▼──────────────────────────────▼───────┐
         │       BACKEND (Port 3000)                  │
         │  ┌──────────────────────────────────────┐ │
         │  │  Express App                          │ │
         │  │  ├─ Routes (/api/users)               │ │
         │  │  ├─ Controllers (Business Logic)      │ │
         │  │  ├─ Services (Data Processing)        │ │
         │  │  ├─ Repositories (Data Persistence)   │ │
         │  │  ├─ Validations (Input Validation)    │ │
         │  │  └─ Middleware (Error Handling)       │ │
         │  └──────────────────────────────────────┘ │
         │         ▼                                   │
         │  ┌──────────────────────────────────────┐ │
         │  │  WebSocket Server (Port 3001)        │ │
         │  │  └─ Broadcasts User Events           │ │
         │  └──────────────────────────────────────┘ │
         │         ▼                                   │
         │  ┌──────────────────────────────────────┐ │
         │  │  JSON Data File (users.json)         │ │
         │  └──────────────────────────────────────┘ │
         └──────────────────────────────────────────┘
```

---

## 📁 Project Structure

### **1. Backend Folder** (`backend/`)
The core application server with all business logic.

#### **1.1 Entry Point: [src/server.js](src/server.js)**
```javascript
// Starts the Express server on port 3000
// Initializes the WebSocket server on port 3001
// Connects all middleware and routes
```
- Listens on `http://localhost:3000`
- Calls `startWebSocketServer()` to enable real-time communications

#### **1.2 App Configuration: [src/app.js](src/app.js)**
```javascript
// Express app initialization
app.use(express.json());           // Parse JSON payloads
app.use("/api/users", userRoutes); // Mount user routes
app.use(errorHandler);             // Global error handling middleware
```

#### **1.3 Routes: [src/routes/userRoutes.js](src/routes/userRoutes.js)**
Defines RESTful API endpoints:

| Method | Endpoint | Controller | Purpose |
|--------|----------|------------|---------|
| GET | `/api/users/` | `getAllUsers()` | Retrieve all users |
| GET | `/api/users/:id` | `getUserById()` | Get user by ID |
| POST | `/api/users/` | `createUser()` | Create new user |
| PUT | `/api/users/:id` | `updateUser()` | Update existing user |
| DELETE | `/api/users/:id` | `deleteUser()` | Delete user |

#### **1.4 Controllers: [src/controllers/userController.js](src/controllers/userController.js)**
Handles HTTP requests and responses.

**Key Responsibilities:**
1. Validates incoming request data using Joi schemas
2. Calls service layer methods
3. Broadcasts WebSocket events (e.g., `USER_CREATED`)
4. Returns formatted JSON responses
5. Passes errors to error middleware

**Example Flow (Create User):**
```
POST /api/users
    ├─ Validate: createUserSchema.validate(req.body)
    ├─ Service: userService.createUser(userData)
    ├─ WebSocket: broadcast({ event: "USER_CREATED", user })
    └─ Response: { success: true, message: "...", data: user }
```

#### **1.5 Services: [src/services/userService.js](src/services/userService.js)**
Business logic layer. Handles:
- Data transformations (e.g., adding UUID to new users)
- Business rule validation (e.g., "User not found")
- Calling repository methods

**Key Methods:**
```javascript
createUser(userData)  // Adds UUID and delegates to repository
updateUser(id, data)  // Updates user, throws error if not found
deleteUser(id)        // Soft delete, error handling
```

#### **1.6 Repositories: [src/repositories/userRepository.js](src/repositories/userRepository.js)**
Data persistence layer. Manages JSON file operations.

**Implementation:**
- **Reads:** `users.json` → Parse JSON
- **Writes:** Modify array → Stringify → Write file
- **CRUD Operations:**
  - `getAllUsers()` - Returns all users
  - `getUserById(id)` - Find and return user
  - `createUser(user)` - Add to array, save
  - `updateUser(id, data)` - Merge changes, save
  - `deleteUser(id)` - Remove from array, save

#### **1.7 Validations: [src/validations/userValidation.js](src/validations/userValidation.js)**
Input validation schemas using **Joi**.

```javascript
createUserSchema {
  name: string (required, trimmed)
  email: string (required, valid email format)
}

updateUserSchema {
  name: string (optional, trimmed)
  email: string (optional, valid email format)
  [At least one field required]
}
```

#### **1.8 Error Handler: [src/middleware/errorHandler.js](src/middleware/errorHandler.js)**
Global middleware catches all errors.

**Response Format:**
```json
{
  "success": false,
  "message": "Error description"
}
```

### **2. Advanced Folder** (`advanced/`)
Real-time communication features.

#### **2.1 WebSocket Server: [advanced/websocket/websocketServer.js](advanced/websocket/websocketServer.js)**
Manages WebSocket connections for real-time events.

**Key Functions:**
- `startWebSocketServer(port)` - Initializes WS server on port 3001
- `broadcast(message)` - Sends message to all connected clients

**Broadcast Events:**
- `USER_CREATED` - Triggered when a new user is created
- `USER_UPDATED` - Triggered when user is updated
- `USER_DELETED` - Triggered when user is deleted

**Example Message:**
```json
{
  "event": "USER_CREATED",
  "user": {
    "id": "uuid-xxx",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## 🧪 Automation Testing (`automation/`)

### **3.1 Test Configuration: [playwright.config.js](playwright.config.js)**
```javascript
{
  testDir: './tests',
  timeout: 30000,
  workers: 1,              // Sequential execution
  reporter: ['html'],      // HTML reports
  webServer: {
    command: 'node src/server.js',
    url: 'http://localhost:3000/api/users',
    reuseExistingServer: true
  }
}
```

### **3.2 Test Fixtures: [utils/fixtures.js](utils/fixtures.js)**
Custom test fixtures for API testing.

```javascript
exports.test = base.test.extend({
  api: async ({ playwright }, use) => {
    // Provides API context with baseURL
    const api = await playwright.request.newContext({
      baseURL: 'http://localhost:3000/api/'
    });
    await use(api);
    await api.dispose();
  }
});
```

**Usage in Tests:**
```javascript
test('Create User', async ({ api }) => {
  const response = await api.post('users', {
    data: { name: 'John', email: 'john@test.com' }
  });
  expect(response.status()).toBe(201);
});
```

### **3.3 JSON Schema Validation: [schemas/user.schema.js](schemas/user.schema.js)**
Validates API response structure using AJV.

```javascript
{
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' }
      },
      required: ['id', 'name', 'email']
    }
  }
}
```

### **3.4 Test Categories**

#### **3.4.1 API E2E Tests: [tests/api/e2e-user-workflow.spec.js](tests/api/e2e-user-workflow.spec.js)**
- Complete user lifecycle workflows
- Create → Read → Update → Delete sequences
- 15 tests covering different scenarios

#### **3.4.2 Negative Tests: [tests/api/users-negative.spec.js](tests/api/users-negative.spec.js)**
- Invalid input validation
- Non-existent resource handling
- Error status codes (400, 404, 500)
- 15 tests covering edge cases

#### **3.4.3 Data-Driven Tests: [tests/api/users-data-driven.spec.js](tests/api/users-data-driven.spec.js)**
- Parameterized test execution
- Multiple data sets per test
- 15 tests with varied inputs

#### **3.4.4 Schema Validation: [tests/api/users-schema.spec.js](tests/api/users-schema.spec.js)**
- Response contract validation
- AJV schema compliance
- 6 tests verifying data structure

#### **3.4.5 WebSocket Tests: [tests/websocket/websocket-user-events.spec.js](tests/websocket/websocket-user-events.spec.js)**
- Real-time event verification
- Connection establishment
- Message broadcasting
- 7 tests for WebSocket functionality

### **3.5 Test Data: [test-data/users.json](test-data/users.json)**
Sample user data for tests:
```json
[
  {
    "id": "uuid-1",
    "name": "John Doe",
    "email": "john@example.com"
  }
]
```

### **3.6 Test Utilities**

#### **Database Reset: [utils/resetDatabase.js](utils/resetDatabase.js)**
Clears the database before/after tests to ensure clean state.

#### **Fixtures: [utils/fixtures.js](utils/fixtures.js)**
Provides ready-to-use test setup (API context, browser context, etc.)

---

## 🔄 Request Flow Example

### **Create User Flow:**

```
[Test/Client]
    │
    ├─ POST /api/users
    │  { name: "John", email: "john@test.com" }
    │
    ▼
[userRoutes] (Routes)
    │
    ├─ Match POST route
    ├─ Call createUser controller
    │
    ▼
[userController] (Controller)
    │
    ├─ Validate data: createUserSchema.validate()
    ├─ Call userService.createUser()
    │
    ▼
[userService] (Service)
    │
    ├─ Generate UUID: uuidv4()
    ├─ Call userRepository.createUser()
    │
    ▼
[userRepository] (Repository)
    │
    ├─ Read users.json
    ├─ Push new user to array
    ├─ Write back to users.json
    ├─ Return user object
    │
    ▼ (Back up the chain)
[userService]
    │
    └─ Return user object
    │
    ▼
[userController]
    │
    ├─ Broadcast: { event: "USER_CREATED", user }
    ├─ Return 201 response:
    │  {
    │    success: true,
    │    message: "User created successfully",
    │    data: { id, name, email }
    │  }
    │
    ▼
[WebSocket Server]
    │
    └─ Send event to all connected clients
    │
    ▼
[Test/Client]
    │
    └─ Receive response & verify in test
```

---

## 📊 Test Coverage Summary

| Category | Tests | Purpose |
|----------|-------|---------|
| End-to-End Workflows | 15 | Full user lifecycle |
| Negative Scenarios | 15 | Error handling |
| Data-Driven Tests | 15 | Multiple data sets |
| Schema Validation | 6 | Response contracts |
| WebSocket Events | 7 | Real-time communication |
| **TOTAL** | **58** | Comprehensive coverage |

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js | JavaScript runtime |
| **Framework** | Express.js | REST API framework |
| **Testing** | Playwright | End-to-end testing |
| **Validation** | Joi (Backend), AJV (Tests) | Input & schema validation |
| **Real-time** | WebSocket (ws) | Live notifications |
| **IDs** | UUID v4 | Unique identifiers |
| **Data Store** | JSON File | Persistent storage |
| **Dev Tools** | Nodemon | Auto-restart on changes |

---

## 🚀 Running the Project

### **Backend**
```bash
cd backend
npm install
npm run dev          # Development with nodemon
npm start            # Production
```
Runs on: `http://localhost:3000`
WebSocket on: `ws://localhost:3001`

### **Tests**
```bash
cd automation
npm install
npx playwright test  # Run all tests
npx playwright show-report  # View HTML report
```

---

## 💡 Key Design Patterns

1. **Layered Architecture** - Separation of concerns (Routes → Controllers → Services → Repositories)
2. **Error Handling** - Centralized middleware for consistent error responses
3. **Validation** - Schema-based validation at controller level
4. **Broadcasting** - WebSocket events for real-time updates
5. **Test Fixtures** - Reusable test setup through custom fixtures
6. **Schema Validation** - Contract-based testing with JSON schemas

---

## 📝 Summary

This is a **full-stack automation testing project** demonstrating professional software development practices:
- ✅ Clean architecture with clear separation of concerns
- ✅ Comprehensive REST API with validation
- ✅ Real-time event broadcasting via WebSocket
- ✅ Robust test automation covering 58+ scenarios
- ✅ Response contract validation using schemas
- ✅ Centralized error handling
- ✅ Professional HTML test reporting

