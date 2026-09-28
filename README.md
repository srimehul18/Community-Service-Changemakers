# ChangeMakers — Society Issue Management Platform

ChangeMakers is a web-based society issue management platform designed to provide a structured and centralized way for residents to report issues, maintenance staff to manage them, and committee administrators to monitor and analyze them.

The platform replaces fragmented issue reporting through verbal communication, phone calls, messaging groups, and manual records with a centralized workflow for reporting, assignment, tracking, resolution, feedback, and analytics.

## Live Application

**Live Website:** https://community-service-changemakers.vercel.app/

## Project Overview

Residential societies often lack a centralized mechanism for reporting and tracking maintenance issues. As a result, complaints can be difficult to prioritize, assign, follow up, and maintain a history of.

ChangeMakers addresses this problem through a role-based platform with three primary users:

- **Resident** — reports issues, tracks their status, and provides feedback after resolution.
- **Maintenance Staff** — views assigned issues, updates their status, and records resolution notes.
- **Committee Admin** — manages users, categories, society configuration, issue assignment, prioritization, and analytics.

The platform is designed as a single-society pilot.

## Key Features

### Resident

- Register and log in securely
- Report maintenance issues
- Add issue title and description
- Select issue category and priority
- Select structured society location
- Upload photographs as evidence
- View previously reported issues
- Track issue status
- View issue details and status history
- Submit feedback after resolution
- Reopen resolved or closed issues when required

### Maintenance Staff

- Secure login
- View assigned issues
- View issue details
- Update issue status
- Add resolution notes
- Track assigned work

### Committee Admin

- Secure role-based access
- View all reported issues
- Assign issues to maintenance staff
- Manage users and roles
- Manage issue categories
- Configure society towers, floors, and common areas
- View issue analytics
- Identify recurring issues
- Monitor issue priorities and statuses

## Issue Workflow

The core workflow of the platform is:

```text
Resident Reports Issue
        |
        v
Issue Created
        |
        v
Admin Reviews / Prioritizes
        |
        v
Issue Assigned to Staff
        |
        v
Staff Updates Status
        |
        v
Issue Resolved
        |
        v
Resident Provides Feedback
        |
        v
Issue Closed / Reopened if Required
```

Every status change can be maintained in the issue's status history.

## Society Configuration

The platform provides an administrator-controlled society structure.

Administrators can configure:

- Towers
- Floors
- Common areas

These configured values are then used by residents while reporting issues.

The location workflow supports two types of issue locations:

```text
Location Type
    |
    +-- Inside a Flat
    |      |
    |      +-- Tower
    |      +-- Floor
    |      +-- Flat Number
    |
    +-- Common Area
           |
           +-- Common Area
```

This reduces inconsistent manually entered locations and provides structured data for issue analytics and recurring-issue detection.

## Recurring Issue Detection

ChangeMakers includes a descriptive recurring-issue analysis mechanism.

An issue group is considered recurring when the same:

```text
Category + Location
```

has been reported at least three times.

For example:

```text
Category: Electrical
Location: Tower B, Lift Lobby
Reports: 3
```

Such patterns can help administrators identify repeated problems in particular locations.

The system does not use machine learning or predictive modeling for this feature.

## Analytics

The administrator analytics dashboard provides information such as:

- Total issues
- Open issues
- In-progress issues
- Resolved issues
- Closed issues
- Issues by priority
- Issues by category
- Resolution rate
- Issue trends
- Recurring issues

The analytics are based on the actual issue data stored in the system.

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Recharts

### Backend

- Node.js
- Express.js
- REST APIs
- JWT authentication
- bcryptjs

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### File Storage

- Cloudinary
- Multer

### Deployment

- Vercel — frontend
- Render — backend
- MongoDB Atlas — database
- GitHub — source control

### Development and Testing

- Postman
- Git
- GitHub

## Project Structure

```text
Community Service/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── Changemakers/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── data/
    │   ├── hooks/
    │   ├── pages/
    │   │   ├── admin/
    │   │   ├── resident/
    │   │   └── staff/
    │   ├── routes/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    │
    ├── .env
    ├── .gitignore
    ├── package.json
    └── vite.config.js
```

## Backend API

The backend exposes REST APIs for authentication, users, categories, issues, uploads, and society configuration.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/test
GET  /api/auth/admin-test
```

### Users

```text
GET    /api/users
GET    /api/users/me
GET    /api/users/:id
PATCH  /api/users/me
PATCH  /api/users/:id
DELETE /api/users/:id
POST   /api/users
```

### Categories

```text
GET    /api/categories
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

### Issues

```text
GET    /api/issues
POST   /api/issues
GET    /api/issues/:id
PATCH  /api/issues/:id
DELETE /api/issues/:id
POST   /api/issues/:id/feedback
PATCH  /api/issues/:id/reopen
GET    /api/issues/analytics
```

### Society Configuration

```text
GET   /api/society-config
PATCH /api/society-config
```

Society configuration modification is restricted to administrators.

## Authentication and Authorization

Authentication is implemented using JSON Web Tokens.

Passwords are hashed using bcryptjs before being stored.

The application implements role-based access control for:

```text
resident
staff
admin
```

Examples:

- Residents can create and manage their own issue workflow.
- Staff can manage issues assigned to them.
- Administrators can manage users, categories, society configuration, assignments, and analytics.

Protected API routes require a valid Bearer token.

## Environment Variables

### Backend

Create a `.env` file inside the `Backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend

Create a `.env` file inside the `Changemakers` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, replace the API URL with the deployed backend URL.

Do not commit `.env` files or secret credentials to GitHub.

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Configure backend environment variables

Create the backend `.env` file using the variables described above.

### 4. Start the backend

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd Changemakers
npm install
```

### 6. Configure frontend environment variables

Create:

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Start the frontend

```bash
npm run dev
```

The Vite development server will provide the frontend URL in the terminal.

## Database

The project uses MongoDB Atlas for persistent data storage.

The main data models include:

```text
User
Category
Issue
SocietyConfig
```

### User

Stores:

- Name
- Email
- Password
- Role
- Age
- Phone
- Tower
- Flat
- Household members

### Category

Stores:

- Category name
- Description
- Active/inactive status

### Issue

Stores:

- Title
- Description
- Category
- Priority
- Status
- Reporter
- Assigned staff
- Location
- Attachments
- Status history
- Feedback
- Timestamps

### SocietyConfig

Stores:

- Towers
- Floors
- Common areas

## Issue Statuses

The system supports the following statuses:

```text
Open
In Progress
Resolved
Closed
```

Status transitions are recorded in the issue history along with the user who made the change.

## Scope

### Included

- Single-society deployment
- Responsive web application
- Resident, staff, and admin roles
- Issue reporting
- Photo evidence
- Structured location
- Issue assignment
- Status tracking
- Resolution notes
- Resident feedback
- Society configuration
- Analytics
- Recurring issue identification

### Out of Scope

The following are outside the current project scope:

- Maps and GPS
- Payment and billing systems
- Society dues management
- IoT integration
- City-wide deployment
- Multi-society management

## Methodology

The project follows the following development methodology:

1. **Validate** — Confirm the society workflow, structure, locations, and issue categories.
2. **Design** — Define the database schema, roles, issue lifecycle, and API structure.
3. **Backend Development** — Implement authentication, role-based access control, database models, and issue APIs.
4. **Frontend Development** — Develop responsive interfaces for residents, staff, and administrators.
5. **Integration and Deployment** — Connect the frontend with the backend and deploy the application.
6. **Pilot and Refinement** — Test the platform with real users and refine the system based on feedback.

Development is organized into small modules with testing, version control, and human review throughout the process.

## Testing

The application has been tested across the major role-based workflows, including:

- Resident authentication
- Staff authentication
- Admin authentication
- JWT-protected routes
- Role-based authorization
- Issue creation
- Issue assignment
- Status updates
- Feedback submission
- Issue reopening
- User management
- Category management
- Society configuration
- Analytics
- Recurring issue detection
- Frontend-to-backend communication
- Production deployment

API endpoints can be tested using Postman.

## Deployment

The production architecture consists of:

```text
User
  |
  v
Vercel
React Frontend
  |
  | REST API
  v
Render
Node.js / Express Backend
  |
  +------------------+
  |                  |
  v                  v
MongoDB Atlas     Cloudinary
Database          Image Storage
```

## Future Improvements

Potential future improvements include:

- More detailed resident usability studies
- Additional analytics based on pilot data
- Improved notification mechanisms
- Further UI/UX refinement based on user feedback
- Additional workflow customization based on society requirements

These improvements would be considered after evaluating the platform through real-user testing.

## Project Status

The core application is implemented and deployed.

The current system includes:

- Role-based authentication
- Resident issue reporting
- Staff issue management
- Administrative management
- Society configuration
- Photo uploads
- Issue history
- Feedback
- Analytics
- Recurring issue detection
- Production deployment

The remaining project phase focuses on pilot testing, collecting real-user feedback, refinement, and final documentation.

## License

This project was developed as an academic project.
