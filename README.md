# BiteSpeed Backend Task

WEBSITE LINK: https://fluxkart-entity-resolution.onrender.com/

A web service that consolidates customer identities across different purchases. If a customer shops with different contact details (email/phone) but shares a common identifier, this service links them into a single "Primary" identity.

Built with **Node.js**, **TypeScript**, **PostgreSQL**, and **TypeORM**.

---

## Features
* **Identity Resolution:** Automatically links guest orders to registered customers.
* **Merge Logic:** Handles complex scenarios where two separate primary accounts must be merged into one.
* **Web Interface (Bonus):** Includes a simple frontend to visually test the API without needing Postman or cURL.
* **Type Safety:** Fully typed codebase using TypeScript.

---

## Tech Stack
* **Runtime:** Node.js (v18+)
* **Language:** TypeScript
* **Framework:** Express.js
* **Database:** PostgreSQL
* **ORM:** TypeORM
* **Deployment:** Render (compatible)

---

## Getting Started

### Prerequisites
* Node.js installed.
* PostgreSQL running locally or via Docker.

### TEST CASES:
Test Case 1: New Customer (Baseline)
Scenario: A customer makes a purchase for the first time.

Request:

```Bash
curl -X POST http://localhost:3000/identify \
-H "Content-Type: application/json" \
-d '{"email": "lorraine@hillvalley.edu", "phoneNumber": "123456"}'
```
Expected Response:
```
JSON
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```
Logic: No existing contacts match, so a new Primary contact is created.

Test Case 2: Link Existing Customer
Scenario: The same customer returns with a new email but the same phone number.

Request:
```
JSON
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```
Expected Response:
```
JSON
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [2]
  }
}
```
Logic: The phone number matched existing Primary ID 1. The new email is added, and a Secondary contact (ID 2) is created to link them.

Test Case 3: The "Merge" (Edge Case)
Scenario: Two initially separate profiles turn out to be the same person and must be merged.

Step A: Create a separate user "Doc".
```
Request: {"email": "doc@future.com", "phoneNumber": "999999"}

Response: Creates Primary Contact ID 3.
```
Step B: Link "Doc" to the original customer (using the old phone number).
```
Request:

JSON
{
  "email": "doc@future.com",
  "phoneNumber": "123456"
}
```
Expected Response:
```
JSON
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu", "doc@future.com"],
    "phoneNumbers": ["123456", "999999"],
    "secondaryContactIds": [2, 3]
  }
}
```

