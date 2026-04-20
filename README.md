# Real Estate Channel Partner Management System

A full-stack web application for managing real estate channel partners, including partner onboarding, property listings, commission tracking, lead management, and reporting dashboards.

## Features

- **Backend**: Spring Boot 3.x with MySQL, JWT authentication, REST APIs
- **Frontend**: React with Material UI
- **Modules**: Builders, Projects, Customers, FollowUps, Visits, Sales
- **Features**: Track customer lifecycle, site visits, follow-ups, calculate earnings, dashboard stats

## Prerequisites

- Java 17+
- MySQL 8+
- Node.js 18+
- Maven 3.6+

## Setup Instructions

### Database Setup

1. Install MySQL and create a database:
```sql
CREATE DATABASE channel_partner_db;
```

2. Run the schema script:
```bash
mysql -u root -p channel_partner_db < database/schema.sql
```

### Backend Setup

1. Navigate to the project root:
```bash
cd channel_partner
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```
or
```bash
java -jar target/channel-partner-1.0.0.jar
```

The backend will run on http://localhost:2026

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## API Endpoints

- `GET /api/builders` - Get all builders
- `POST /api/builders` - Create builder
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `GET /api/followups` - Get all follow-ups
- `POST /api/followups` - Create follow-up
- `GET /api/visits` - Get all visits
- `POST /api/visits` - Create visit
- `GET /api/sales` - Get all sales
- `GET /api/sales/earnings` - Get total earnings
- `POST /api/sales` - Create sale
- `POST /api/auth/login` - User login

## Default Users

- Username: admin, Password: admin123 (Role: ADMIN)
- Username: partner, Password: partner123 (Role: PARTNER)

## Project Structure

```
channel_partner/
├── src/main/java/com/example/channelpartner/
│   ├── ChannelPartnerApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   └── JwtAuthenticationFilter.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── BuilderController.java
│   │   ├── CustomerController.java
│   │   ├── FollowUpController.java
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ProjectController.java
│   │   ├── SaleController.java
│   │   └── VisitController.java
│   ├── dto/
│   │   ├── BuilderDTO.java
│   │   ├── CustomerDTO.java
│   │   ├── FollowUpDTO.java
│   │   ├── JwtResponse.java
│   │   ├── LoginRequest.java
│   │   ├── ProjectDTO.java
│   │   ├── SaleDTO.java
│   │   ├── UserDTO.java
│   │   └── VisitDTO.java
│   ├── model/
│   │   ├── Builder.java
│   │   ├── Customer.java
│   │   ├── FollowUp.java
│   │   ├── Project.java
│   │   ├── Sale.java
│   │   ├── User.java
│   │   └── Visit.java
│   ├── repository/
│   │   ├── BuilderRepository.java
│   │   ├── CustomerRepository.java
│   │   ├── FollowUpRepository.java
│   │   ├── ProjectRepository.java
│   │   ├── SaleRepository.java
│   │   ├── UserRepository.java
│   │   └── VisitRepository.java
│   └── service/
│       ├── BuilderService.java
│       ├── CustomerService.java
│       ├── FollowUpService.java
│       ├── JwtService.java
│       ├── ProjectService.java
│       ├── SaleService.java
│       ├── UserService.java
│       └── VisitService.java
├── src/main/resources/
│   └── application.properties
├── database/
│   └── schema.sql
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   └── pages/
│   │       ├── Builders.jsx
│   │       ├── Customers.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Projects.jsx
│   │       └── Sales.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── pom.xml
└── README.md
```

## Technologies Used

- **Backend**: Spring Boot 3, Spring Security, JWT, JPA/Hibernate, MySQL
- **Frontend**: React 18, Material UI, Axios, React Router
- **Build Tools**: Maven, Vite
- **Database**: MySQL 8

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
