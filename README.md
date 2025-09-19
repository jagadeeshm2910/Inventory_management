# Inventory Management System

A simple web application for managing food orders and deliveries.

## Features

- Create and manage food orders
- Track order status (Order Received → Yet to be Packed → Dispatched)
- Manage customers and caterers
- View daily order summaries
- Filter orders by delivery date
- Track different flavors and quantities

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: FastAPI (Python)
- **Database**: SQLAlchemy

## Quick Setup

### Frontend
```bash
cd inventory_management
npm install
npm run dev
```

### Backend
```bash
cd Inventory_Backend/fastapi-template
pip install fastapi sqlalchemy uvicorn
uvicorn app.main:app --reload
```

## API Endpoints

- `POST /` - Create order
- `GET /` - Get all orders
- `PATCH /{order_id}` - Update order
- `DELETE /{order_id}` - Delete order
- `PATCH /{order_id}/status` - Update order status
- `POST /customers` - Create customer
- `GET /customers` - Get all customers
- `POST /summary` - Get order summary by date
- `POST /flavour-summary-details` - Get flavor summary

## Usage

1. Start both frontend and backend servers
2. Create customers, add orders, and track deliveries

## Project Structure

```
├── inventory_management/          # React Frontend
├── Inventory_Backend/            # FastAPI Backend
└── README.md
```

Built for efficient food delivery management.
