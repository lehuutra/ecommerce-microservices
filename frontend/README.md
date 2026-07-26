# E-Commerce Frontend

Customer storefront for the e-commerce microservices project. It uses Next.js
App Router, React, TypeScript, and Tailwind CSS.

## Features

- Account registration, login, session display, and logout.
- Product catalog with search, category filters, and product details.
- Redis-backed cart management.
- Checkout and order creation.
- Order history, order details, and payment status refresh.
- Responsive loading, error, empty, and not-found states.

## Architecture

The browser only calls Next.js Route Handlers. Those handlers form a small BFF
layer that forwards allowlisted requests to the API Gateway.

```text
Browser -> Next.js BFF -> API Gateway -> Microservices
```

The JWT is stored in an `HttpOnly` cookie and is never exposed to browser
JavaScript.

## Local development

Start the backend stack from the repository root:

```powershell
docker compose up -d --wait
```

Create the local frontend environment file:

```powershell
Copy-Item frontend/.env.example frontend/.env.local
```

Install dependencies and start the frontend:

```powershell
Set-Location frontend
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose | Local default |
|---|---|---|
| `BACKEND_API_URL` | API Gateway URL used by server-side code | `http://localhost:8080` |
| `FRONTEND_URL` | Public frontend origin used by metadata | `http://localhost:3000` |

## Verification

```powershell
npm run lint
npm run build
```

Frontend TypeScript and TSX use ES6+ syntax and arrow functions for components,
route handlers, callbacks, and helpers.
