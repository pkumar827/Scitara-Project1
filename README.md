# Scitara Project 1 – Playwright Automation Framework

## Project Overview

This project demonstrates a robust Playwright-based automation framework developed to validate a User Management System. The framework covers REST API testing, WebSocket validation, schema verification, negative testing, data-driven testing, and end-to-end business workflows.

The framework has been designed with scalability, maintainability, and reporting capabilities in mind, following industry-standard automation practices.

---

## Objectives

* Validate REST APIs for a User Management System.
* Perform end-to-end business workflow testing.
* Implement data-driven and negative test scenarios.
* Validate API response contracts using JSON Schema.
* Verify real-time notifications through WebSocket testing.
* Generate detailed HTML execution reports.
* Maintain source control using Git branching strategies.

---

## Technology Stack

| Category                | Technology               |
| ----------------------- | ------------------------ |
| Language                | JavaScript               |
| Automation Tool         | Playwright               |
| Backend Framework       | Node.js + Express.js     |
| Schema Validation       | AJV                      |
| Real-Time Communication | WebSocket (`ws`)         |
| Version Control         | Git & GitHub             |
| Reporting               | Playwright HTML Reporter |

---

## Framework Features

* REST API Automation
* End-to-End Business Workflow Validation
* Negative Testing
* Data-Driven Testing
* JSON Schema Validation
* WebSocket Event Validation
* Professional HTML Reporting
* Git-Based Branching Strategy

---

## Test Coverage

| Test Category                 | Number of Tests |
| ----------------------------- | --------------- |
| End-to-End Business Workflows | 15              |
| Negative Scenarios            | 15              |
| Data-Driven Scenarios         | 15              |
| Schema Validation             | 6               |
| WebSocket Validation          | 7               |
| **Total**                     | **58**          |

---

## Project Structure

```text
Scitara-Project1
│
├── advanced/
│   └── websocket/
│
├── automation/
│   ├── playwright.config.js
│   ├── tests/
│   │   ├── api/
│   │   └── websocket/
│   ├── schemas/
│   ├── test-data/
│   ├── utils/
│   ├── playwright-report/
│   └── test-results/
│
├── backend/
│   ├── src/
│   ├── data/
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Execution Steps

### 1. Clone the Repository

```bash
git clone https://github.com/pkumar827/Scitara-Project1.git

cd Scitara-Project1
```

---

### 2. Install Backend Dependencies

```bash
cd backend

npm install
```

---

### 3. Install Automation Dependencies

```bash
cd ../automation

npm install
```

---

### 4. Execute Tests

```bash
npx playwright test
```

---

### 5. View HTML Report

```bash
npx playwright show-report
```

---

## Sample Execution Summary

```text
Running 58 tests using 1 worker

58 passed (XX.Xs)
```

---

## Git Workflow

The project followed a feature-based branching strategy.

### Branches Used

* `main` – Release branch
* `master` – Integration branch
* `feature/websocket-integration` – Feature development branch

---

## Key Learnings

* Designing maintainable Playwright automation frameworks.
* Testing REST APIs using Playwright's APIRequestContext.
* Validating real-time events using WebSocket clients.
* Implementing data-driven and schema-based testing strategies.
* Managing execution evidence through Playwright reporting.
* Applying Git branching and merge workflows in automation projects.

---

## Future Enhancements

* CI/CD integration using GitHub Actions.
* Dockerized test execution.
* Automated report distribution.
* Parallel execution optimization.

---

## Author

**Piyush Kumar**

Senior Software Development Engineer in Test (SDET)

* Experience: 7+ Years
* Expertise: API Automation, UI Automation, Salesforce Testing, Playwright Framework Development

GitHub: https://github.com/pkumar827

---

## License

This project has been created for learning, demonstration, and professional portfolio purposes.
# Scitara-Project1