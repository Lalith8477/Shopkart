
# ShopKart — Full-Stack E-Commerce Application

ShopKart is a full-stack e-commerce application developed as part of the Full-Stack Lab Project. It brings together customer authentication, product browsing, wishlist management, shopping cart operations, checkout, payment processing, and order management in a single application.

The project uses React for the frontend, Node.js and Express for the backend, MongoDB for persistent data storage, and Razorpay for payment integration.

**Repository:** https://github.com/Lalith8477/Shopkart

---

## 1. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Routing | React Router |
| API Communication | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt, Cookie Parser |
| Middleware | CORS, Authentication Middleware |
| Payment Integration | Razorpay |
| Development Tools | npm, Git, ESLint |

---

## 2. Application Features

### Customer Authentication
- Customer registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected frontend routes
- Authentication-aware API requests

### Product Catalog
- Retrieve and display products
- View individual product details
- Search and category-based filtering, where implemented

### Wishlist
- Add products to the wishlist
- Retrieve saved products
- Remove products from the wishlist
- Associate wishlist data with the authenticated user

### Shopping Cart
- Add products to the cart
- Retrieve cart items and product details
- Update product quantities
- Remove products from the cart
- Maintain cart state across the application

### Checkout and Orders
- Collect shipping information
- Validate cart items and product availability
- Calculate order totals on the backend
- Integrate Razorpay into the payment workflow
- Verify payment before confirming an order
- View order history and order details

---

## 3. Project Structure

```text
Shopkart/
├── backend/
│   ├── config/
│   │   └── razorpay.js
│   ├── controllers/
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── product.controller.js
│   │   ├── user.controller.js
│   │   └── wishlist.controller.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── order.model.js
│   │   ├── product.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   ├── product.routes.js
│   │   ├── user.routes.js
│   │   └── wishlist.routes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   └── vite-project/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── context/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── App.jsx
│       │   ├── App.css
│       │   ├── index.css
│       │   └── main.jsx
│       ├── index.html
│       ├── package.json
│       ├── package-lock.json
│       └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 4. Application Architecture

ShopKart follows a client-server architecture.

```text
Customer
   |
   v
React Frontend
   |
   | Axios API Requests
   v
Express.js Backend
   |
   |-- Authentication Middleware
   |
   |-- Route Handlers
   |
   |-- Controllers
   |
   |-- Mongoose Models
   |
   v
MongoDB Database
```

The frontend handles the user interface, navigation, forms, and application state. The backend processes API requests, applies business rules, validates data, and communicates with MongoDB.

Protected operations identify the authenticated user through the application's authentication mechanism. Sensitive operations, including payment verification and order creation, are handled by the backend.

---

## 5. API Reference

The following endpoint paths describe the API contracts for the ShopKart lab workflow. The final paths and any common prefix must match the routers mounted in `backend/index.js`.

### 5.1 Authentication APIs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/customers/register` | Public | Register a customer |
| POST | `/customers/login` | Public | Authenticate a customer |
| GET | `/customers/me` | Protected | Retrieve the current customer |
| POST | `/customers/logout` | Protected | Clear the authentication cookie |

**Authentication flow**

1. The customer submits registration details.
2. The backend validates the input and stores the password as a bcrypt hash.
3. During login, the backend verifies the credentials and generates a JWT.
4. The authentication mechanism establishes the customer's authenticated session.
5. Protected requests are validated by authentication middleware.

### 5.2 Product APIs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/products` | As configured | Create a product |
| GET | `/products` | Public | Retrieve products |
| GET | `/products/:id` | Public | Retrieve a product by ID |

**Query examples**

```http
GET /products?search=keyboard
GET /products?category=Electronics
GET /products?search=keyboard&category=Electronics
```

The product catalog supplies the data used by the product listing and product details pages.

### 5.3 Wishlist APIs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/wishlist/:productId` | Protected | Add a product to the wishlist |
| GET | `/wishlist` | Protected | Retrieve the current user's wishlist |
| DELETE | `/wishlist/:productId` | Protected | Remove a product from the wishlist |

Wishlist operations should use the authenticated user's identity rather than accepting an arbitrary user ID from the client.

### 5.4 Shopping Cart APIs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/cart/:productId` | Protected | Add a product to the cart |
| GET | `/cart` | Protected | Retrieve the current user's cart |
| PATCH | `/cart/:productId` | Protected | Update item quantity |
| DELETE | `/cart/:productId` | Protected | Remove a cart item |

Cart operations should validate product availability and quantity limits. The backend returns the updated cart so the frontend can synchronize its displayed state.

### 5.5 Checkout and Order APIs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/orders/create-payment-order` | Protected | Validate the cart and initiate payment |
| POST | `/orders/verify-payment` | Protected | Verify payment and confirm the order |
| GET | `/orders` | Protected | Retrieve the current user's orders |
| GET | `/orders/:id` | Protected | Retrieve an individual order |

These paths follow the checkout and order lab specification. Confirm the actual route names and mounting prefix against the backend implementation before using this table as a tested API reference.

---

## 6. Main Application Workflows

### 6.1 Product Browsing

```text
Open Product Listing
        |
        v
Frontend Requests Products
        |
        v
Backend Queries MongoDB
        |
        v
Products Returned as JSON
        |
        v
Frontend Displays Product Cards
        |
        v
Customer Opens Product Details
```

### 6.2 Wishlist Management

```text
Customer Selects Wishlist Action
        |
        v
Authenticated API Request
        |
        v
Backend Validates User
        |
        v
Wishlist Updated in MongoDB
        |
        v
Updated Data Returned
        |
        v
Frontend Refreshes Wishlist State
```

### 6.3 Shopping Cart Management

```text
Customer Adds or Updates a Product
        |
        v
Frontend Sends Cart API Request
        |
        v
Backend Validates Product and Quantity
        |
        v
Cart Updated in Database
        |
        v
Updated Cart Returned
        |
        v
Cart Page and Cart Count Updated
```

### 6.4 Checkout and Payment

```text
Customer Proceeds to Checkout
        |
        v
Shipping Details Submitted
        |
        v
Backend Validates Cart and Stock
        |
        v
Order and Payment Initiated
        |
        v
Customer Completes Razorpay Payment
        |
        v
Backend Verifies Payment Signature
        |
        v
Order Status Updated
        |
        v
Order History Becomes Available
```

Payment must be verified by the backend. A successful frontend redirect alone should not be treated as proof of payment.

---

## 7. Database Design

ShopKart uses MongoDB with Mongoose models to manage application data.

| Model | Responsibility |
|---|---|
| User | Customer information, authentication-related data, and user-associated shopping data |
| Product | Product details, pricing, categories, images, and stock |
| Order | Order items, totals, shipping details, payment information, and order status |

The exact schema fields depend on the model definitions in the source code.

---

## 8. Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB or a MongoDB Atlas database
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/Lalith8477/Shopkart.git
cd Shopkart
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` and configure the environment variables used by the application.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

The names and port above are examples. Use the exact variable names expected by the backend source code and replace the placeholder values with your own configuration.

Start the backend:

```bash
node index.js
```

### Step 3: Install Frontend Dependencies

Open a second terminal from the project root:

```bash
cd frontend/vite-project
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite in the terminal.

### Step 4: Verify the Configuration

Before testing the application, make sure that:

- MongoDB is accessible.
- Backend environment variables are configured.
- The backend starts successfully.
- The frontend API configuration points to the correct backend address.
- Cross-origin requests and authentication cookies are configured correctly for the local setup.

---

## 9. Available Frontend Scripts

Run these commands from `frontend/vite-project/`.

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Generate the production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## 10. Security Considerations

- Store passwords as hashes rather than plain text.
- Protect user-specific APIs with authentication middleware.
- Validate request data on the backend.
- Calculate order totals on the server instead of trusting client-submitted totals.
- Verify Razorpay payment signatures on the backend.
- Keep database credentials and payment secrets in environment variables.
- Never commit `.env` files or real credentials to GitHub.

---



## Author

**Lalith**

Full-Stack Lab Project
