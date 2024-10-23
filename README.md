# Document Manager Backend

## Project Overview

This backend service is for the **Document Manager**, handling role-based and relationship-based access control (RBAC & ReBAC) using **Permit.io** for policy management and resource authorization. It exposes a RESTful API to manage documents, categories, user roles, and permissions.

The backend is built using **Node.js** and **Express.js**, with **Permit.io** handling authorization logic to enforce RBAC and ReBAC policies.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Permit.io Setup](#permitio-setup)
- [Available API Endpoints](#available-api-endpoints)
  - [Public Routes](#public-routes)
  - [Protected Routes](#protected-routes)
- [Permissions](#permissions)
- [Running Locally](#running-locally)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack
- **Backend Framework**: Node.js, Express.js
- **Authorization**: Permit.io (RBAC & ReBAC)
- **API**: RESTful API with role-based and relationship-based access control
- **Environment**: Docker for local PDP (Permit Decision Point)

## Installation

To get started, clone the repository and install dependencies.

```bash
git clone https://github.com/Umoren/doc-rebac-server.git
cd doc-rebac-server
yarn install
```

## Environment Variables
Create a `.env` file in the root directory and add the following variables:

```bash
PERMIT_TOKEN=your-permit-api-token
PROJECT_ID=your-permit-project-id
ENVIRONMENT_ID=your-permit-environment-id
PORT=5000 # or any port you want to use for the server
```

> Note: You can obtain the PERMIT_TOKEN, PROJECT_ID, and ENVIRONMENT_ID from your Permit.io dashboard.

## Project Structure
Here’s an overview of the folder structure:

```bash
.
├── controllers/        # Route handlers (Business logic for categories, documents, policies)
│   ├── categoryController.js
│   ├── documentController.js
│   └── policyController.js
├── middleware/         # Authorization middleware
│   └── authMiddleware.js
├── routes/             # API route definitions
│   └── policyRoutes.js
├── utils/              # Permit.io instance for API calls
│   └── permitInstance.js
├── server.js           # Entry point to start the application
└── package.json        # Project configuration
```

## Permit.io Setup
For role-based and relationship-based access control, the Permit.io platform is integrated using its Node.js SDK.

- Roles like Viewer, DocumentOwner, SuperAdmin are managed through Permit.io.
- Relationship-based access control (ReBAC): Relationships between resources like documents and categories are managed, allowing users with access to a parent resource (e.g., category) to inherit access to child resources (e.g., documents).
You can set up Permit.io PDP (Permit Decision Point) locally using Docker. 

Follow the instructions from the Permit.io PDP setup documentation.

## Available API Endpoints

If you find any issues or bugs with the Node SDK, please refer to the Open API spec [here](https://api.permit.io/v2/redoc) 

### Public Routes

These routes do not require authentication or permission checks.

POST /api/policies/register: Register a new user in the system.

GET /api/policies/list-roles: Get a list of all roles.

GET /api/policies/list-resource-instances: List all resource instances.

GET /api/policies/categories: Get all categories.

GET /api/policies/documents: Get all documents.

### Protected Routes
These routes require permission checks and authentication.

POST /api/policies/assign-role: Assign a role to a user for a specific resource.

POST /api/policies/check-permission: Check if a user has a permission on a resource.

POST /api/policies/create-relationship: Create a relationship between two resources.

POST /api/policies/create-resource-instance: Create a new resource instance.

POST /api/policies/create-role: Create a new role.

POST /api/policies/assign-superadmin: Assign the SuperAdmin role to a user.

GET /api/policies/user-roles/:userId: Get the roles assigned to a user.

GET /api/policies/users: Get all users.

GET /api/policies/users/:userId: Get a specific user.

GET /api/policies/get-role/:roleKey: Get details of a specific role.

PUT /api/policies/categories/:id: Update a category.

DELETE /api/policies/categories/:id: Delete a category.

PUT /api/policies/documents/:id: Update a document.

DELETE /api/policies/documents/:id: Delete a document.

## Permissions
Permissions are managed through Permit.io, allowing fine-grained access control over categories, documents, and more. Users can only perform actions on resources for which they have the appropriate role or permission.

- Role-based: Users are assigned roles like DocumentOwner, Viewer, Editor, etc.
- Relationship-based: If a user has access to a parent resource (e.g., a category), they may inherit permissions for child resources (e.g., documents).

## Example Permission Check:
In the backend, permissions are checked using middleware:

```js
const { checkPermission } = require('../middleware/authMiddleware');

// Protecting the route to check if the user can create a document
router.post('/documents', checkPermission('create', 'Document'), documentController.createDocument);
```
## Running Locally
To run the backend server locally:

- Set up Permit PDP: Use Docker to run the Permit.io PDP for local development. Follow the Permit.io PDP setup.

Start the server: `yarn dev`