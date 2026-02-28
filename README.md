# BiteSpeed Backend Task: Identity Reconciliation

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

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone <your-repo-url>
cd bitespeed-identity
npm install