# trello-app
---
This is a trello api project. The project is built on MongoDB, ExpressJs, Nodejs.

- Backend Deploy (Render): [https://trello-app-backend-kedr.onrender.com]
---

## 1. Key Features

The project is divided into two separate parts: Back-end (API).

- Authentication & Authorization:

  - Implemented JWT-based authentication using accessToken and refreshToken.
  
  - Stored tokens in httpOnly cookies to enhance security (XSS protection).
  
  - Built middleware for protected routes and role-based access control.
  
  - Implemented automatic token refresh flow.

- Board / Column / Card Management:

  - Designed RESTful APIs for full CRUD operations.
  
  - Structured MongoDB schema for Board → Columns → Cards relationship.
  
  - Implemented drag-and-drop position persistence (update order indexes in database).

- Database Optimization:

  - Used MongoDB Aggregation Pipeline for complex queries and data filtering.

- Real-time Notification:

  - Integrated Socket.io for real-time communication.
  
  - Authenticated socket connection via httpOnly cookies.
  
  - Implemented server-side event handling and broadcasting.

- File Upload & Media Handling:

  - Handled file uploads using Multer.
  
  - Stored images securely on Cloudinary.

- Validation & Error Handling:

  - Implemented request validation using Joi.
  
  - Built centralized error handling middleware.

## 2. Tech Stack

- Framework: NodeJs, ExpressJs

- Language: JavaScript

- Database: MongoDB (with Driver)

- Authentication: jsonwebtoken (JWT), bcrypt (Hashing)

- Real-time: Socket.io

- API: REST API, Cookie-Parser, CORS

- File Upload: Multer (file handling), Cloudinary (image storage)

- Validator: Joi
--- 


