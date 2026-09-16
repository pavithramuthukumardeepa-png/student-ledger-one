# Student Management System

## Project Title

Student Management System — B.Tech Artificial Intelligence and Data Science mini project.

## Project Description

A complete, fully functional CRUD web application for managing college student records.
Staff can add new students, view and search all records, open a detailed record, update
details, and delete records with a confirmation step. All data is stored permanently in a
PostgreSQL database — there is no static or local-only data.

## Features

- Dashboard with Total Students, Average Marks and Average Attendance
- Add a new student with full form validation
- View all students in a searchable, responsive table
- Search students by ID, name, department, year, email or phone
- Student details page with the complete record
- Edit an existing student
- Delete a student with a confirmation dialog
- Success and error messages for every operation
- Responsive design for mobile, tablet and desktop

## Technologies Used

- React 19 + TypeScript
- TanStack Start / TanStack Router (routing and SSR)
- TanStack Query (data fetching and cache)
- Tailwind CSS v4 (design tokens and styling)
- shadcn/ui components, Lucide icons, Sonner toasts
- Vite build tooling

## Database Used

PostgreSQL, hosted on Lovable Cloud (Supabase under the hood).

### `students` table

| Column      | Type          | Notes                          |
| ----------- | ------------- | ------------------------------ |
| id          | uuid          | primary key                    |
| student_id  | text          | unique student ID              |
| name        | text          | student name                   |
| department  | text          | department                     |
| year        | text          | year of study                  |
| email       | text          | email address                  |
| phone       | text          | 10-digit phone number          |
| attendance  | numeric(5,2)  | 0–100, checked in the database  |
| marks       | numeric(5,2)  | 0–100, checked in the database  |
| created_at  | timestamptz   | auto                           |
| updated_at  | timestamptz   | auto-updated by trigger        |

Row Level Security is enabled. The app is open (no login), so read, insert, update and
delete policies allow access for app users.

Five sample student records are inserted for testing.

## CRUD Operations

| Operation | Page                     | Route                | Database action                  |
| --------- | ------------------------ | -------------------- | -------------------------------- |
| Create    | Add Student              | `/students/new`      | `insert` into `students`         |
| Read      | Dashboard, View Students | `/`, `/students`     | `select` from `students`         |
| Read one  | Student Details          | `/students/:id`      | `select` single row              |
| Update    | Edit Student             | `/students/:id/edit` | `update` by id                   |
| Delete    | View Students / Details  | `/students`          | `delete` by id, after confirming |

## Validation Rules

- Student ID is required and must be unique (checked before saving)
- Student name is required
- Email must be a valid email address
- Phone number must be exactly 10 digits
- Attendance must be between 0 and 100
- Marks must be between 0 and 100
- Department and year are required

## Setup Instructions

1. Install dependencies:
   ```bash
   bun install
   ```
2. Environment variables (auto-provisioned by Lovable Cloud in `.env`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Start the development server:
   ```bash
   bun run dev
   ```
4. Open the app at the printed local URL (default `http://localhost:8080`).
5. Build for production:
   ```bash
   bun run build
   ```

The database schema and the five sample records are created by the migration in
`supabase/migrations/`.

## Pages

1. Dashboard — `/`
2. Add Student — `/students/new`
3. View Students — `/students`
4. Student Details — `/students/:id`
5. Edit Student — `/students/:id/edit`
