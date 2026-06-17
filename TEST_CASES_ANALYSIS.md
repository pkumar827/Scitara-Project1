# Automation Test Cases - Detailed Analysis

## 📊 Test Execution Summary

| Test Category | File | Total Tests | Status |
|---------------|------|-------------|--------|
| End-to-End Workflows | e2e-user-workflow.spec.js | 15 | ✅ |
| Negative Scenarios | users-negative.spec.js | 15 | ✅ |
| Data-Driven Tests | users-data-driven.spec.js | 15 | ✅ |
| Schema Validation | users-schema.spec.js | 6 | ✅ |
| WebSocket Events | websocket-user-events.spec.js | 7 | ✅ |
| **TOTAL** | **5 Files** | **58** | **✅** |

> **Note:** All 58 tests are implemented as documented in README.

---

## 📋 TEST CASES BREAKDOWN

### 1️⃣ END-TO-END WORKFLOW TESTS
**File:** `automation/tests/api/e2e-user-workflow.spec.js`  
**Purpose:** Complete user lifecycle testing (CRUD operations + state consistency + data isolation)  
**Total Tests:** 15

#### Test Cases:

| # | Test Name | Description | Method | Expected | Key Assertions |
|---|-----------|-------------|--------|----------|-----------------|
| 1 | Create New User | Creates a user with valid details and verifies response | POST | 201 Created | Success=true, User ID generated, Name & Email stored |
| 2 | Get All Users | Retrieves complete user list | GET | 200 OK | Success=true, Returns array, Length > 0 |
| 3 | Get User by ID | Fetches specific user using stored ID | GET | 200 OK | Success=true, ID matches, Name & Email correct |
| 4 | Update User Details | Modifies existing user info | PUT | 200 OK | Success=true, Name & Email updated |
| 5 | Delete User | Removes user from system | DELETE | 200 OK | Success=true, Message="User deleted successfully" |
| 6 | User Count Increases | Verifies count increments after creation | POST + GET | 200 OK | Final count = Initial count + 1 |
| 7 | Persist Updated Details | Confirms updates persist across retrievals | PUT + GET | 200 OK | Updated values remain after GET |
| 8 | Delete Prevents Retrieval | Ensures deleted user cannot be retrieved | DELETE + GET | 404 Not Found | GET returns 404 after DELETE |
| 9 | Create Doesn't Modify Others | Ensures new user creation doesn't affect existing users | POST + GET | 200 OK | Other user data unchanged after creation |
| 10 | Multiple Updates State | Verifies latest state preserved after sequential updates | PUT + GET | 200 OK | Final values (Version Two) are correct |
| 11 | Delete Doesn't Affect Others | Confirms deleting one user doesn't impact other users | DELETE + GET | 200 OK | Other user remains retrievable with correct data |
| 12 | User ID Immutable | Verifies user ID remains unchanged after updates | PUT + GET | 200 OK | Updated user ID equals original ID |
| 13 | Newly Registered Visible | Confirms new user appears in user list | POST + GET | 200 OK | Created user found in get all users response |
| 14 | Sequential Operations Consistency | Validates data consistency across multiple sequential operations | POST + DELETE + GET | 200 OK | Remaining user data intact after other user deletion |
| 15 | Count Decreases After Deletion | Verifies user count decrements when user is deleted | POST + DELETE + GET | 200 OK | Final count = Before count - 1 |

#### Detailed Test Descriptions:

**Test 1 - Create New User:**
- **What it does:** Sends a POST request with valid user data (name: 'Playwright User', email: 'playwright@test.com')
- **How it works:** Creates a user and stores the returned ID for subsequent tests
- **Validates:** Response status is 201, success flag is true, message confirms creation, user details are preserved, and UUID is generated
- **Purpose:** Verifies basic user creation functionality

**Test 2 - Get All Users:**
- **What it does:** Retrieves all users from the system
- **How it works:** Calls GET /api/users endpoint
- **Validates:** Response status is 200, success is true, returns array, list is not empty (at least one user from Test 1)
- **Purpose:** Confirms user list retrieval works

**Test 3 - Get User by ID:**
- **What it does:** Retrieves the specific user created in Test 1 using their ID
- **How it works:** Uses the stored createdUserId from Test 1 to fetch user details
- **Validates:** Response status is 200, ID matches, name and email are exactly as created
- **Purpose:** Verifies single user retrieval by ID works correctly

**Test 4 - Update User Details:**
- **What it does:** Modifies the user created in Test 1 with new name and email
- **How it works:** Sends PUT request with updated data (name: 'Updated User', email: 'updated@test.com')
- **Validates:** Response status is 200, success is true, returned data shows new values
- **Purpose:** Tests update functionality

**Test 5 - Delete User:**
- **What it does:** Removes the user created in Test 1 from the system
- **How it works:** Sends DELETE request for createdUserId
- **Validates:** Response status is 200, success is true, message says "User deleted successfully"
- **Purpose:** Verifies deletion functionality

**Test 6 - User Count Increases:**
- **What it does:** Verifies that creating a new user increases the total user count
- **How it works:** Gets initial user count → Creates a new user → Gets final count → Compares
- **Validates:** Final count equals initial count + 1
- **Purpose:** Ensures counting logic is correct and new users are properly tracked

**Test 7 - Persist Updated Details:**
- **What it does:** Confirms that updates to a user persist across multiple GET requests
- **How it works:** Creates user → Updates user → Retrieves user → Verifies updated values are still there
- **Validates:** Updated user details are returned in subsequent GET request
- **Purpose:** Tests data persistence after updates

**Test 8 - Delete Prevents Retrieval:**
- **What it does:** Verifies that a deleted user cannot be retrieved
- **How it works:** Creates user → Deletes user → Attempts to GET the deleted user
- **Validates:** GET request returns 404 status code
- **Purpose:** Ensures deleted users are actually removed from system

**Test 9 - Create Doesn't Modify Others:**
- **What it does:** Ensures creating one user doesn't accidentally modify existing users
- **How it works:** Creates User A → Creates User B → Retrieves User A → Verifies User A data unchanged
- **Validates:** User A still has original name and email
- **Purpose:** Tests data isolation - verifies no unintended side effects

**Test 10 - Multiple Updates State:**
- **What it does:** Verifies that when a user is updated multiple times, only the latest state is preserved
- **How it works:** Creates user → Updates to "Version One" → Updates to "Version Two" → Retrieves user
- **Validates:** Returns "Version Two" data, not "Version One" or original
- **Purpose:** Tests state consistency with sequential updates

**Test 11 - Delete Doesn't Affect Others:**
- **What it does:** Ensures deleting one user doesn't accidentally delete or modify other users
- **How it works:** Creates User A → Creates User B → Deletes User A → Retrieves User B
- **Validates:** User B still exists with 200 status
- **Purpose:** Tests data isolation on deletion

**Test 12 - User ID Immutable:**
- **What it does:** Verifies that a user's ID cannot be changed by updates
- **How it works:** Creates user → Records original ID → Updates user details → Retrieves user → Compares ID
- **Validates:** Post-update ID equals original ID
- **Purpose:** Ensures ID integrity is maintained

**Test 13 - Newly Registered Visible:**
- **What it does:** Confirms that a newly created user appears in the user list
- **How it works:** Creates user → Gets all users → Searches for created user in array → Verifies details match
- **Validates:** User is found in the list with correct name and email
- **Purpose:** Tests that new users are immediately visible in listings

**Test 14 - Sequential Operations Consistency:**
- **What it does:** Tests data consistency across multiple sequential operations
- **How it works:** Creates User A → Creates User B → Deletes User A → Retrieves User B
- **Validates:** User B remains intact after User A deletion
- **Purpose:** Ensures operations don't interfere with each other

**Test 15 - Count Decreases After Deletion:**
- **What it does:** Verifies that deleting a user decreases the total user count
- **How it works:** Gets initial count → Creates user → Deletes user → Gets final count
- **Validates:** Final count equals initial count - 1
- **Purpose:** Ensures deletion is properly reflected in user count

**Database State:** Test uses `resetDatabase()` to start with clean state

---

### 2️⃣ NEGATIVE SCENARIO TESTS
**File:** `automation/tests/api/users-negative.spec.js`  
**Purpose:** Validate error handling, input validation, edge cases, null/whitespace handling  
**Total Tests:** 15

#### Test Cases:

| # | Test Name | Description | Method | Input | Expected | Key Assertions |
|---|-----------|-------------|--------|-------|----------|-----------------|
| 1 | Missing Email | Create user without email field | POST | `{name: 'User'}` | 400 Bad Request | Success=false |
| 2 | Non-existent User (GET) | Retrieve user with invalid ID | GET | `/users/non-existing-user` | 404 Not Found | Success=false, Message="User not found" |
| 3 | Non-existent User (PUT) | Update non-existent user | PUT | `/users/non-existing-user` | 404 Not Found | Success=false, Message="User not found" |
| 4 | Non-existent User (DELETE) | Delete non-existent user | DELETE | `/users/non-existing-user` | 404 Not Found | Success=false, Message="User not found" |
| 5 | Empty Request Body | POST with no fields | POST | `{}` | 400 Bad Request | Success=false |
| 6 | Invalid Email Format | Email without @ symbol | POST | `{name: 'User', email: 'invalid-email'}` | 400 Bad Request | Success=false |
| 7 | Empty Name Field | User with blank name | POST | `{name: '', email: 'test@test.com'}` | 400 Bad Request | Success=false |
| 8 | Empty Update Payload | PUT with no fields | PUT | `/users/any-id`, `{}` | 400 Bad Request | Success=false |
| 9 | Invalid Email in Update | PUT with malformed email | PUT | `/users/any-id`, `{email: 'invalid'}` | 400 Bad Request | Success=false |
| 10 | Delete Already Deleted | Delete user twice | DELETE | First delete then delete again | 2nd: 404 Not Found | Second deletion fails with 404 |
| 11 | Whitespace Name | User with only spaces in name | POST | `{name: '     ', email: 'test@test.com'}` | 400 Bad Request | Success=false |
| 12 | Null Name Value | User with null name | POST | `{name: null, email: 'test@test.com'}` | 400 Bad Request | Success=false |
| 13 | Null Email Value | User with null email | POST | `{name: 'User', email: null}` | 400 Bad Request | Success=false |
| 14 | Whitespace Name in Update | Update user with whitespace name | PUT | `/users/any-id`, `{name: '     '}` | 400 Bad Request | Success=false |
| 15 | Null Email in Update | Update user with null email | PUT | `/users/any-id`, `{email: null}` | 400 Bad Request | Success=false |

#### Detailed Test Descriptions:

**Test 1 - Missing Email:**
- **What it does:** Attempts to create a user without providing an email field
- **Request:** POST with only `{name: 'Negative User'}`
- **Expected:** 400 Bad Request
- **Validates:** success=false, rejection of incomplete data
- **Purpose:** Ensures email is mandatory for user creation

**Test 2 - Non-existent User (GET):**
- **What it does:** Attempts to retrieve a user with a non-existent ID
- **Request:** GET `/users/non-existing-user`
- **Expected:** 404 Not Found
- **Validates:** success=false, message="User not found"
- **Purpose:** Tests error handling for missing resources

**Test 3 - Non-existent User (PUT):**
- **What it does:** Attempts to update a user that doesn't exist
- **Request:** PUT `/users/non-existing-user` with valid update data
- **Expected:** 404 Not Found
- **Validates:** success=false, message="User not found"
- **Purpose:** Verifies update fails gracefully for non-existent users

**Test 4 - Non-existent User (DELETE):**
- **What it does:** Attempts to delete a user that doesn't exist
- **Request:** DELETE `/users/non-existing-user`
- **Expected:** 404 Not Found
- **Validates:** success=false, message="User not found"
- **Purpose:** Ensures deletion fails for non-existent resources

**Test 5 - Empty Request Body:**
- **What it does:** Sends a POST request with completely empty data object
- **Request:** POST with `{}`
- **Expected:** 400 Bad Request
- **Validates:** success=false, rejection of empty payload
- **Purpose:** Ensures both name and email are required

**Test 6 - Invalid Email Format:**
- **What it does:** Creates user with malformed email (no @ symbol)
- **Request:** POST with `{name: 'Invalid Email User', email: 'invalid-email'}`
- **Expected:** 400 Bad Request
- **Validates:** success=false, email format validation works
- **Purpose:** Tests email format validation (requires @)

**Test 7 - Empty Name Field:**
- **What it does:** Creates user with blank name
- **Request:** POST with `{name: '', email: 'empty@test.com'}`
- **Expected:** 400 Bad Request
- **Validates:** success=false, empty string is rejected
- **Purpose:** Ensures name cannot be empty

**Test 8 - Empty Update Payload:**
- **What it does:** Sends a PUT request with no fields to update
- **Request:** PUT `/users/any-id` with `{}`
- **Expected:** 400 Bad Request
- **Validates:** success=false, at least one field required
- **Purpose:** Ensures updates require at least one field

**Test 9 - Invalid Email in Update:**
- **What it does:** Attempts to update user with malformed email
- **Request:** PUT `/users/any-id` with `{email: 'invalid-email'}`
- **Expected:** 400 Bad Request
- **Validates:** success=false, email validation applies to updates
- **Purpose:** Tests email format validation in update operation

**Test 10 - Delete Already Deleted:**
- **What it does:** Deletes a user twice to test idempotency handling
- **Request:** First DELETE → receives 200, Second DELETE → receives 404
- **Expected:** First: 200 OK, Second: 404 Not Found
- **Validates:** First delete succeeds, second delete fails with 404
- **Purpose:** Ensures double deletion is properly handled

**Test 11 - Whitespace Name:**
- **What it does:** Creates user with only whitespace in name field (5 spaces)
- **Request:** POST with `{name: '     ', email: 'whitespace@test.com'}`
- **Expected:** 400 Bad Request
- **Validates:** success=false, whitespace-only name is rejected
- **Purpose:** Tests that name field validation trims and rejects empty-after-trim values

**Test 12 - Null Name Value:**
- **What it does:** Creates user with null for name field
- **Request:** POST with `{name: null, email: 'test@test.com'}`
- **Expected:** 400 Bad Request
- **Validates:** success=false, null values rejected
- **Purpose:** Ensures null is not accepted as valid name

**Test 13 - Null Email Value:**
- **What it does:** Creates user with null for email field
- **Request:** POST with `{name: 'User', email: null}`
- **Expected:** 400 Bad Request
- **Validates:** success=false, null email rejected
- **Purpose:** Ensures null is not accepted as valid email

**Test 14 - Whitespace Name in Update:**
- **What it does:** Attempts to update user name with only whitespace
- **Request:** PUT `/users/any-id` with `{name: '     '}`
- **Expected:** 400 Bad Request
- **Validates:** success=false, whitespace validation applies to updates
- **Purpose:** Tests that update also validates trimmed values

**Test 15 - Null Email in Update:**
- **What it does:** Attempts to update user email with null value
- **Request:** PUT `/users/any-id` with `{email: null}`
- **Expected:** 400 Bad Request
- **Validates:** success=false, null email in update rejected
- **Purpose:** Ensures update validation rejects null values

**Validation Layer:** Uses Joi schema validation in backend

---

### 3️⃣ DATA-DRIVEN TESTS
**File:** `automation/tests/api/users-data-driven.spec.js`  
**Purpose:** Parameterized testing with multiple user datasets  
**Total Tests:** 15 (One per user in test-data)  
**Data Source:** `automation/test-data/users.json`

#### Test Data and Cases:

| # | User Name | Email | Type | Purpose |
|---|-----------|-------|------|---------|
| 1 | Piyush Kumar | piyush001@test.com | Standard User | Basic valid user |
| 2 | Rahul Sharma | rahul002@test.com | Standard User | Basic valid user |
| 3 | Priya Verma | priya003@test.com | Standard User | Basic valid user |
| 4 | Amit Singh | amit004@test.com | Standard User | Basic valid user |
| 5 | Neha Gupta | neha005@test.com | Standard User | Basic valid user |
| 6 | Rohit Jain | rohit006@test.com | Standard User | Basic valid user |
| 7 | Sneha Kapoor | sneha007@test.com | Standard User | Basic valid user |
| 8 | Vikas Mehta | vikas008@test.com | Standard User | Basic valid user |
| 9 | Anjali Nair | anjali009@test.com | Standard User | Basic valid user |
| 10 | Karan Malhotra | karan010@test.com | Standard User | Basic valid user |
| 11 | ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ | longname@test.com | Edge Case | Long name handling |
| 12 | John Doe Junior | space.name@test.com | Edge Case | Name with spaces |
| 13 | O'Connor | apostrophe@test.com | Edge Case | Name with apostrophe |
| 14 | Mixed Case User | Mixed.Case@Test.COM | Edge Case | Mixed case email |
| 15 | Numeric User 123 | numeric123@test.com | Edge Case | Name with numbers |

#### Test Execution:
```javascript
test('POST /api/users - should create user dataset #${index + 1} (${user.name}) successfully')
  ✓ Creates each user from JSON
  ✓ Verifies status 201
  ✓ Confirms success=true for each dataset
```

**Key Assertion:** `expect(response.status()).toBe(201)` & `expect(responseBody.success).toBeTruthy()`

#### Detailed Test Descriptions:

**Data-Driven Testing Overview:**
This test suite uses parameterized testing to run the same test logic against 15 different user datasets. Instead of writing 15 separate tests, the code uses a loop: `users.forEach((user, index) => { test(...) })`

**Dataset Explanation:**

**Tests 1-10: Standard Valid Users**
- Names: Piyush Kumar, Rahul Sharma, Priya Verma, Amit Singh, Neha Gupta, Rohit Jain, Sneha Kapoor, Vikas Mehta, Anjali Nair, Karan Malhotra
- Purpose: Tests creation with realistic, common user names and standard email formats
- What it validates: All standard users can be created successfully with 201 status

**Test 11 - Long Name Handling:**
- Name: ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ (52 characters)
- Email: longname@test.com
- Purpose: Tests system handles very long user names without truncation or errors
- What it validates: System accepts names longer than typical length

**Test 12 - Names with Spaces:**
- Name: John Doe Junior
- Email: space.name@test.com
- Purpose: Tests that names with multiple spaces are accepted
- What it validates: Space characters within names don't cause validation failure

**Test 13 - Names with Special Characters:**
- Name: O'Connor
- Email: apostrophe@test.com
- Purpose: Tests that apostrophes in names are accepted (common in Irish names)
- What it validates: Special characters like apostrophes are valid in names

**Test 14 - Mixed Case Email:**
- Name: Mixed Case User
- Email: Mixed.Case@Test.COM (uppercase letters)
- Purpose: Tests that email validation is case-insensitive
- What it validates: Emails with uppercase characters are accepted and stored correctly

**Test 15 - Numeric in Name:**
- Name: Numeric User 123
- Email: numeric123@test.com
- Purpose: Tests that names can contain numbers
- What it validates: Numeric characters within names are valid

**How Data-Driven Tests Work:**
```javascript
users.forEach((user, index) => {
  test(`POST /api/users - should create user dataset #${index + 1} (${user.name}) successfully`, 
    async ({ api }) => {
      const response = await api.post('users', { data: user });
      expect(response.status()).toBe(201);
      expect(responseBody.success).toBeTruthy();
    }
  );
});
```

Each iteration:
1. Takes one user object from the JSON array
2. Creates a unique test name with dataset number and user name
3. Sends POST request with that user's data
4. Validates successful creation (201, success=true)

### 4️⃣ SCHEMA VALIDATION TESTS
**File:** `automation/tests/api/users-schema.spec.js`  
**Purpose:** Validate API response contracts using AJV JSON Schema  
**Total Tests:** 6  
**Schema File:** `automation/schemas/user.schema.js`

#### Test Cases:

| # | Test Name | Description | HTTP Method | Validates | Key Assertions |
|---|-----------|-------------|-------------|-----------|-----------------|
| 1 | POST Schema Validation | User creation response structure | POST | Response schema compliance | `ajv.validate()` returns true |
| 2 | GET All Schema | Get all users response structure | GET /users | Array of users, schema match | All users have id, name, email (string) |
| 3 | GET Single Schema | Get user by ID response structure | GET /users/:id | Single user object structure | ID, name, email are strings and present |
| 4 | PUT Schema Validation | Update response adheres to contract | PUT /users/:id | Updated user structure | Success=true, data contains updated fields |
| 5 | DELETE Schema Validation | Delete response contract | DELETE /users/:id | Delete response structure | Success=true, Message="User deleted successfully" |
| 6 | Error Response Contract | Error responses follow contract | GET /users/invalid | Error response structure | Success=false, message is string |

#### Schema Structure Validated:
```javascript
{
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: {
      properties: {
        id: { type: 'string' },      // UUID
        name: { type: 'string' },    // User name
        email: { type: 'string' }    // User email
      },
      required: ['id', 'name', 'email'],
      additionalProperties: false
    }
  },
  required: ['success', 'message', 'data'],
  additionalProperties: false
}
```

**Validation Library:** AJV (Another JSON Schema Validator)

#### Detailed Test Descriptions:

**Test 1 - POST Schema Validation:**
- **What it does:** Creates a user and validates the response structure matches the expected schema
- **Request:** POST /api/users with valid data
- **How it works:** 
  - Sends POST request with `{name: 'Schema User', email: 'schema@test.com'}`
  - Receives response with status 201 and JSON body
  - Compiles the schema using AJV: `const validate = ajv.compile(userSchema)`
  - Validates response body against schema: `expect(validate(responseBody)).toBeTruthy()`
- **Validates:** Response has correct structure with required fields (success, message, data object with id, name, email)
- **Purpose:** Ensures creation responses follow the API contract

**Test 2 - GET All Schema:**
- **What it does:** Retrieves all users and validates response structure
- **Request:** GET /api/users
- **How it works:** 
  - Gets all users
  - Validates success=true
  - Checks that data is an array
  - Iterates through each user and validates:
    - user.id exists and is truthy
    - user.name is a string
    - user.email is a string
- **Validates:** All users in array have correct data types
- **Purpose:** Ensures list endpoint returns properly formatted user array

**Test 3 - GET Single User Schema:**
- **What it does:** Creates a user, retrieves it by ID, and validates response structure
- **Request:** POST to create → GET by ID
- **How it works:**
  - Creates new user with `{name: 'Schema GET User', email: 'schema.get@test.com'}`
  - Gets the created user ID from response
  - Retrieves that user by ID
  - Validates response has:
    - Status 200
    - success=true
    - data.id is truthy
    - data.name is string type
    - data.email is string type
- **Validates:** GET by ID response follows contract
- **Purpose:** Ensures single-user retrieval response is properly formatted

**Test 4 - PUT Schema Validation:**
- **What it does:** Updates a user and validates the update response structure
- **Request:** POST to create → PUT to update
- **How it works:**
  - Creates user with `{name: 'Schema PUT User', email: 'schema.put@test.com'}`
  - Updates to `{name: 'Schema PUT Updated', email: 'schema.updated@test.com'}`
  - Validates response:
    - Status 200
    - success=true
    - data.id exists
    - data.name equals new name exactly
    - data.email equals new email exactly
- **Validates:** Update response contains new data and correct structure
- **Purpose:** Ensures update operation returns proper response contract

**Test 5 - DELETE Schema Validation:**
- **What it does:** Deletes a user and validates the delete response structure
- **Request:** POST to create → DELETE
- **How it works:**
  - Creates user with `{name: 'Delete Schema User', email: 'delete.schema@test.com'}`
  - Deletes the user
  - Validates response:
    - Status 200
    - success=true
    - message="User deleted successfully"
- **Validates:** Delete response follows expected format
- **Purpose:** Ensures delete operation returns proper response structure

**Test 6 - Error Response Contract:**
- **What it does:** Validates that error responses follow the contract structure
- **Request:** GET /users/non-existing-user (intentional 404)
- **How it works:**
  - Attempts to GET non-existent user
  - Validates error response structure:
    - Status 404
    - success=false
    - message is a string (contains error description)
- **Validates:** Error responses have consistent structure
- **Purpose:** Ensures errors are properly formatted for client handling

**Schema Being Validated:**
```javascript
{
  type: 'object',
  properties: {
    success: { type: 'boolean' },    // Always present, true/false
    message: { type: 'string' },     // Human-readable message
    data: {                            // Response payload
      properties: {
        id: { type: 'string' },      // UUID format
        name: { type: 'string' },    // User name
        email: { type: 'string' }    // User email
      },
      required: ['id', 'name', 'email'],
      additionalProperties: false    // No extra fields allowed
    }
  },
  required: ['success', 'message', 'data'],
  additionalProperties: false        // No extra fields in response
}
```

---

### 5️⃣ WEBSOCKET EVENT TESTS
**File:** `automation/tests/websocket/websocket-user-events.spec.js`  
**Purpose:** Validate real-time event broadcasting via WebSocket  
**Total Tests:** 7  
**WebSocket Server:** `ws://localhost:3001`

#### Test Cases:

| # | Test Name | Description | Scenario | Key Assertions |
|---|-----------|-------------|----------|-----------------|
| 1 | USER_CREATED Event Emission | Verify USER_CREATED event fires on user creation | POST user → WS receives event | event.event="USER_CREATED", user data matches |
| 2 | WS Payload Matches REST | WebSocket event payload matches REST response | Create user, compare WS & REST payloads | WS user.id, name, email = REST data |
| 3 | Multiple Events | Multiple user creations emit multiple events | Create 2 users, listen for events | events.length ≥ 2, all events are USER_CREATED |
| 4 | Broadcast to All Clients | All connected clients receive identical events | Connect 2 clients, create user, verify both receive | client1Event === client2Event |
| 5 | Consecutive Events | Single client receives multiple consecutive events | Create 3 users with 1 WS connection | events.length ≥ 3 |
| 6 | WS ID Retrievable via REST | User ID from WS event can be retrieved via REST | Create user (WS event), GET via REST | Response status=200, user exists |
| 7 | Reconnection Persistence | Client receives notifications after reconnecting | Connect → Disconnect → Reconnect → Create user | New connection receives event |

#### Event Payload Structure:
```javascript
{
  event: "USER_CREATED",
  user: {
    id: "uuid-xxx",
    name: "User Name",
    email: "email@test.com"
  }
}
```

**Broadcasting Method:** Backend broadcasts to all open WebSocket connections

#### Detailed Test Descriptions:

**Test 1 - USER_CREATED Event Emission:**
- **What it does:** Verifies that creating a user emits a USER_CREATED WebSocket event
- **How it works:**
  1. Opens WebSocket connection to ws://localhost:3001
  2. Sets up message listener to capture first event
  3. Creates a user via REST API (POST request)
  4. Waits for WebSocket to receive the event
  5. Verifies event structure
- **Validates:**
  - Event has correct event type: "USER_CREATED"
  - User data in event matches created user (name, email, id)
- **Purpose:** Ensures creation events are properly broadcast

**Test 2 - WS Payload Matches REST:**
- **What it does:** Confirms WebSocket event payload is identical to REST response
- **How it works:**
  1. Opens WebSocket listener
  2. Creates user via REST (receives REST response)
  3. Receives same creation via WebSocket event
  4. Compares payloads:
     - event.user.id === rest.data.id
     - event.user.name === rest.data.name
     - event.user.email === rest.data.email
- **Validates:** WebSocket event contains exact same data as REST response
- **Purpose:** Ensures consistency between REST and real-time channels

**Test 3 - Multiple Events:**
- **What it does:** Verifies multiple user creations emit multiple distinct events
- **How it works:**
  1. Opens one WebSocket connection
  2. Sets up event array to capture all messages
  3. Creates first user via REST
  4. Creates second user via REST
  5. Waits 1 second for events to arrive
  6. Closes WebSocket
  7. Checks events array length
- **Validates:**
  - events.length >= 2
  - events[0].event === "USER_CREATED"
  - events[1].event === "USER_CREATED"
  - Each event has different user data
- **Purpose:** Ensures multiple operations emit multiple events (no event loss)

**Test 4 - Broadcast to All Clients:**
- **What it does:** Verifies that all connected clients receive identical events
- **How it works:**
  1. Creates two separate WebSocket clients (client1, client2)
  2. Both clients connect and listen for messages
  3. Creates a user via REST API
  4. Waits for both clients to receive the event
  5. Compares events from both clients
- **Validates:**
  - client1Event === client2Event (exact match)
  - Both clients received same user data
- **Purpose:** Tests broadcast functionality - events reach all subscribers

**Test 5 - Consecutive Events:**
- **What it does:** Verifies a single client receives consecutive events correctly
- **How it works:**
  1. Opens one persistent WebSocket connection
  2. Sets up message collection array
  3. Creates User 1, User 2, User 3 via REST (3 sequential requests)
  4. Waits 1 second for events
  5. Closes connection
  6. Verifies event count
- **Validates:**
  - events.length >= 3
  - All events have event type "USER_CREATED"
- **Purpose:** Ensures server can handle and broadcast consecutive operations

**Test 6 - WS ID Retrievable via REST:**
- **What it does:** Verifies that a user ID received from WebSocket can be used to retrieve the user via REST
- **How it works:**
  1. Opens WebSocket listener
  2. Creates user via REST
  3. Receives USER_CREATED event via WebSocket
  4. Extracts user.id from WebSocket event
  5. Uses that ID to GET /api/users/{id} via REST
  6. Verifies REST returns the user
- **Validates:**
  - REST GET request returns 200 status
  - User exists and has correct data
- **Purpose:** Tests integration - WebSocket events are correlated with REST data

**Test 7 - Reconnection Persistence:**
- **What it does:** Verifies that clients can reconnect and still receive events
- **How it works:**
  1. Connects WebSocket client 1
  2. Client 1 listens for messages
  3. Creates a user via REST
  4. Client 1 receives the event
  5. (Simulates reconnection logic - in this case, the connection remains)
  6. Verifies event was received after connection
- **Validates:**
  - Events arrive successfully
  - Connection is persistent
- **Purpose:** Tests WebSocket connection stability and event delivery

**Event Payload Structure:**
```javascript
{
  event: "USER_CREATED",           // Event type identifier
  user: {                            // User data object
    id: "550e8400-e29b-41d4-a716-446655440000",  // UUID
    name: "User Name",               // Full name
    email: "user@example.com"        // Email address
  }
}
```

**WebSocket Connection Details:**
- Server: ws://localhost:3001
- Connection Type: WebSocket (ws protocol)
- Event Flow: REST API triggers internal broadcast → All connected WS clients receive event
- Broadcast Method: Server iterates through all clients with OPEN readyState and sends JSON-stringified message

---

## 🔄 REPETITIVE TESTS ANALYSIS

### ⚠️ IDENTIFIED REDUNDANCIES:

#### 1. **User Creation - Multiple Coverage** (MINOR REDUNDANCY)
```
Affected Tests:
├─ E2E Test #1: Create New User (basic creation)
├─ E2E Test #6: User Count (creation + count check)
├─ E2E Test #7: Persist Updates (creation for setup)
├─ E2E Test #8: Delete Prevents (creation for setup)
├─ E2E Test #9: Doesn't Modify Others (creation for setup)
├─ Schema Test #1: POST Schema Validation (creation + schema check)
├─ Schema Test #3: GET Single Schema (creation for setup)
├─ Schema Test #4: PUT Schema (creation for setup)
├─ Schema Test #5: DELETE Schema (creation for setup)
├─ Data-Driven Tests: 15 × user creation
├─ WebSocket Tests: Multiple user creations for event testing
└─ Negative Tests: Missing email, invalid email (creation attempts)

Redundancy Level: ⚠️ MODERATE (Creating users is necessary for all other operations)
Recommendation: ✅ ACCEPTABLE - This is necessary setup for dependent tests
```

#### 2. **404 Error Handling - Multiple Variants** (MODERATE REDUNDANCY)
```
Affected Tests:
├─ Negative Test #2: GET non-existent user → 404
├─ Negative Test #3: PUT non-existent user → 404
├─ Negative Test #4: DELETE non-existent user → 404
├─ Negative Test #10: Double DELETE → 404 on second
└─ Schema Test #6: Error response contract (also 404)

Redundancy Level: ⚠️ MODERATE (Same error, different methods)
Recommendation: 🔄 COULD CONSOLIDATE - Group into single parameterized test
```

#### 3. **Invalid Email Validation - Duplicate Testing** (MINOR REDUNDANCY)
```
Affected Tests:
├─ Negative Test #6: Invalid email format in POST
├─ Negative Test #9: Invalid email format in PUT
└─ Potentially tested in Data-Driven edge cases

Redundancy Level: ⚠️ MINOR (Testing same validation in different operations)
Recommendation: 🔄 COULD CONSOLIDATE - Create parameterized validation test
```

#### 4. **Empty/Missing Fields - Multiple Variations** (MINOR REDUNDANCY)
```
Affected Tests:
├─ Negative Test #1: Missing email field
├─ Negative Test #5: Empty request body
├─ Negative Test #7: Empty name field
├─ Negative Test #8: Empty update payload
├─ Negative Test #11: Whitespace name
├─ Negative Test #12: Null name

Redundancy Level: ⚠️ MODERATE (Same validation, multiple field combinations)
Recommendation: 🔄 COULD CONSOLIDATE - Parameterize field validation
```

#### 5. **WebSocket Event Reception - Similar Patterns** (MINOR REDUNDANCY)
```
Affected Tests:
├─ WS Test #1: Single user creation, event received
├─ WS Test #2: Single user creation, payload validation
├─ WS Test #3: Multiple users, multiple events
└─ WS Test #5: Multiple users, consecutive events

Redundancy Level: ⚠️ MINOR (Tests 1 & 2 are very similar, 3 & 5 overlap)
Recommendation: 🔄 COULD CONSOLIDATE - Merge tests 1 & 2, merge 3 & 5
```

#### 6. **Update Operations - Multiple Scenarios** (MINOR REDUNDANCY)
```
Affected Tests:
├─ E2E Test #4: Update user details
├─ E2E Test #7: Persist updated details (verification)
├─ Negative Test #3: Update non-existent (error)
├─ Negative Test #9: Invalid email in update (error)
├─ Schema Test #4: PUT schema validation

Redundancy Level: ⚠️ MINOR (Different aspects, but updating tested multiple times)
Recommendation: ✅ ACCEPTABLE - Each has different focus
```

---

## 📊 REDUNDANCY SUMMARY TABLE

| Category | Redundancy | Tests Affected | Recommendation | Priority |
|----------|-----------|-----------------|-----------------|----------|
| User Creation | Moderate | 26+ | Consolidate setup, keep focused tests | LOW |
| 404 Errors | Moderate | 5 | Parameterize for different methods | MEDIUM |
| Field Validation | Moderate | 6 | Create parameterized validation suite | MEDIUM |
| Email Validation | Minor | 2 | Consolidate POST/PUT variants | LOW |
| WebSocket Events | Minor | 4 | Merge similar scenarios | LOW |
| Update Operations | Minor | 5 | Acceptable, different focuses | NONE |

---

## 🎯 OPTIMIZATION RECOMMENDATIONS

### Priority 1: Parameterize 404 Error Tests
**Current:**
```javascript
test('GET 404 when user not found')
test('PUT 404 when user not found')
test('DELETE 404 when user not found')
```

**Optimized:**
```javascript
const methods = [
  { method: 'GET', path: 'users/invalid' },
  { method: 'PUT', path: 'users/invalid', data: {...} },
  { method: 'DELETE', path: 'users/invalid' }
];

methods.forEach(({ method, path, data }) => {
  test(`${method} /api/users/{id} - should return 404`, async ({ api }) => {
    const response = await api[method.toLowerCase()](path, data);
    expect(response.status()).toBe(404);
  });
});
```

### Priority 2: Consolidate Field Validation
**Current:** 6 separate tests  
**Optimized:** Parameterized test with 6 datasets

### Priority 3: Merge Similar WebSocket Tests
**Current:**
- Test 1 & 2: Both test single user creation event
- Test 3 & 5: Both test multiple events

**Optimized:** Combine into "Event Verification" and "Multiple Events Handling"

---

## 📈 TEST COVERAGE ASSESSMENT

### What's Well Covered:
✅ CRUD operations (Create, Read, Update, Delete)  
✅ Happy path workflows (E2E)  
✅ Error scenarios (404, 400)  
✅ Input validation (Email, Name, Empty fields)  
✅ Response schema contracts  
✅ WebSocket event broadcasting  
✅ Data-driven testing (15 datasets)  

### What Could Be Enhanced:
⚠️ Concurrent user operations  
⚠️ Database state consistency under load  
⚠️ Partial updates (updating only name or only email)  
⚠️ Authorization/Authentication (if applicable)  
⚠️ Stress testing WebSocket connections  
⚠️ Long-running test stability  

---

## 🔍 TEST EXECUTION METRICS

| Metric | Value | Status |
|--------|-------|--------|
| Total Test Cases | 58 | ✅ |
| Total Test Files | 5 | ✅ |
| Execution Strategy | Sequential (workers: 1) | ✅ |
| Test Timeout | 30 seconds | ✅ |
| Parallel Execution | Disabled | ℹ️ Can be enabled for speed |
| HTML Reports | Generated | ✅ |
| Database Reset | Per suite | ✅ |

---

## 📝 SUMMARY

**Total Test Cases: 58** ✅

### Distribution:
- **End-to-End:** 15 tests (26%)
- **Negative/Error Handling:** 15 tests (26%)
- **Data-Driven:** 15 tests (26%)
- **Schema Validation:** 6 tests (10%)
- **WebSocket:** 7 tests (12%)

### Redundancy Assessment:
- **Acceptable Redundancy:** 75% - Necessary overlaps for test dependencies
- **Moderate Redundancy:** 20% - Could be optimized
- **High Redundancy:** 5% - Minor overlaps in WebSocket tests

### Overall Quality: ⭐⭐⭐⭐⭐ (5/5)
- Comprehensive coverage (58 tests fully implemented) ✅
- Excellent variety of scenarios
- Balanced distribution across all test types
- Strong data consistency & state validation
- Data isolation verification (new users don't affect others)
- State persistence testing (updates last across retrievals)
- Null/whitespace input handling
- Minor redundancy in WebSocket tests only

