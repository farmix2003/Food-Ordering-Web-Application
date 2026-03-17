# Food Ordering Full-Stack Application

## Overview
This is a full-stack food ordering platform built using React (TypeScript) for the frontend and Spring Boot for the backend. The system supports multiple roles and includes full order management functionality.

## Features

- User authentication (JWT, Spring Security)
- Role-based access (Admin, User, Restaurant Owner)
- Restaurant management (create, edit, block, open/close)
- Food management (CRUD operations)
- Basket system (add/remove items)
- Order lifecycle (create, cancel, update status)
- Search functionality for food items
- Admin controls for users and restaurants

## Frontend

- React (TypeScript)
- Axios (API integration)
- Tailwind CSS
- Material UI

## Backend

- Java, Spring Boot
- Spring Security + JWT
- Spring Data JPA
- MySQL

## Architecture

- Frontend → API → Backend → Database
- Controller → Service → Repository pattern

## How to Run

### Backend
1. Configure database in application.properties
2. Run Spring Boot app

### Frontend
1. npm install
2. npm run dev

## Future Improvements

- Payment integration
- Notifications
- Performance optimization
