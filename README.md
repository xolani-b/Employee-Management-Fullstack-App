# Factory Work App

Factory Work App is a React + Spring Boot system for factory employee self-service, supervisors, HR, payroll, safety, factory managers, and admin users.

The app now starts on the login page. The old landing page, demo employee/department screens, test snapshots, MongoDB dependency, and deployment demo documents were removed.

## Main Modules

- Worker dashboard: shift details, machine assignment, transport request, payslip view, incident upload, profile photo, contact details, emergency contact, and chatbot.
- Supervisor dashboard: mark attendance, mark absent, complete PPE and shift checks, record incidents, and assign workers to machines.
- HR dashboard: approve/suspend users, manage site view, send notifications, track birthdays, manage transport pickup/drop-off, and export weekly transport CSV.
- Payroll dashboard: pay-short cases, payslip access, weekly hours, and overtime view.
- Safety dashboard: incident queue, photo evidence, severity trends, anonymous reports, and machine-linked reports.
- Factory manager dashboard: absenteeism trends by site, total hours worked by site, operational machine status, and production risk overview.
- Admin/IT dashboard: account status rules, offline sync queue, site structure, and machine register.

## MySQL Persistence

The dashboard now syncs factory operations data through Spring Boot APIs into MySQL tables:

- `factory_shifts`
- `factory_machines`
- `factory_transport_requests`
- `factory_incidents`
- `factory_shift_checks`
- `factory_notifications`
- `factory_attendance`

Main API endpoints:

- `GET /api/factory/state`
- `PUT /api/factory/state`
- `GET /api/factory/shifts`
- `GET /api/factory/machines`
- `GET /api/factory/transport-requests`
- `GET /api/factory/incidents`
- `GET /api/factory/shift-checks`
- `GET /api/factory/notifications`
- `GET /api/factory/attendance`

These endpoints require a logged-in user token.

## Default Login

The backend creates or updates this local admin account on startup:

```text
Username: admin
Password: admin123
```

New users can register, but they start as `PENDING_APPROVAL`. The admin account is `APPROVED`.

## Tech Stack

- Frontend: React, Material UI, Chart.js
- Backend: Spring Boot, Java 11, JWT, WebAuthn/passkeys
- Database: MySQL
- Removed: MongoDB

## Run With Docker Compose

From the project root:

```bash
docker compose up --build
```

Open:

```text
http://localhost:3000
```

On a Raspberry Pi or another device on the network, use the Pi IP:

```text
http://<pi-ip>:3000
```

If workers will open the app from phones or other computers, build the frontend with the backend URL set to the Pi IP:

```bash
REACT_APP_API_BASE_URL=http://<pi-ip>:8080 docker compose up --build
```

On Windows PowerShell:

```powershell
$env:REACT_APP_API_BASE_URL="http://<pi-ip>:8080"
docker compose up --build
```

## Run Manually

Backend:

```bash
cd backend
mvn spring-boot:run
```

If Maven is not installed but Java is available:

```bash
cd backend
./mvnw spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm start
```

Local URLs:

```text
Frontend: http://localhost:3000
Backend health: http://localhost:8080/api/health
```

## MySQL Settings

The app reads database settings from environment variables or `backend/config.properties`.

Example:

```properties
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=employee_management
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_SSL_MODE=DISABLED
JWT_SECRET=change-this-secret
WEBAUTHN_RP_NAME=Factory Work App
WEBAUTHN_RP_ID=localhost
WEBAUTHN_ORIGINS=http://localhost:3000
```

## Current Project Status

The factory modules now use a MySQL-backed API for transport, shifts, machines, incidents, notifications, shift checks, and attendance. The frontend still keeps offline local storage so supervisors can capture data without network and sync when the connection returns.

On the Raspberry Pi, verify the backend with:

```bash
cd backend
./mvnw -DskipTests package
```
