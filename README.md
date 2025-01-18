# Payever Technical Assessment Project

Welcome to the Payever Technical Assessment Project! This project demonstrates my skills in building scalable, modular, and efficient microservices using **Nest.js**, **MongoDB**, and **RabbitMQ**. It showcases my ability to design and implement a system that handles invoice generation, report distribution, and message queuing, all while adhering to best practices in software development and DevOps.

This project is a testament to my passion for solving real-world problems with clean, maintainable, and well-documented code. I hope it reflects my dedication to excellence and my enthusiasm for joining the Payever team.

---

## Project Overview

The project consists of two microservices:

1. **Invoicer Service**: A REST API for creating invoices and a cron job that generates daily reports, emitting them to a RabbitMQ queue.
2. **Report Consumer Service**: A microservice that consumes reports from RabbitMQ and sends them via email.

The system is designed to be **scalable**, **decoupled**, and **easy to maintain**, leveraging modern technologies and tools.

---

## Key Features

- **REST API**: Create and manage invoices via a well-defined API.
- **Cron Job**: Automatically generate and queue reports daily at 12 PM.
- **Message Queuing**: Use RabbitMQ to decouple the invoicer and email microservices.
- **Health Checks**: Monitor the health of the invoicer service to ensure reliability.
- **Dockerized Setup**: Easy-to-run setup using Docker and Docker Compose.

---

## Technologies Used

- **Backend**: Nest.js (Node.js framework)
- **Database**: MongoDB
- **Message Queue**: RabbitMQ
- **Package Manager**: pnpm
- **Containerization**: Docker and Docker Compose
- **DevOps**: Health checks, multi-stage Docker builds, and environment variable management

---

## Project Structure

The project is organized as a monorepo with the following structure:

payever-assessment/
├── apps/
│ ├── payever-invoicer/ # Invoicer service (REST API + cron job)
│ │ ├── src/ # Source code for the invoicer service
│ │ ├── Dockerfile # Dockerfile for the invoicer service
│ │ └── package.json # Dependencies for the invoicer service
│ ├── report-consumer/ # Report consumer service (email microservice)
│ │ ├── src/ # Source code for the email microservice
│ │ ├── Dockerfile # Dockerfile for the email microservice
│ │ └── package.json # Dependencies for the email microservice
│ └── ... # Other apps (if any)
├── docker-compose.yaml # Docker Compose configuration
├── package.json # Root package.json for the monorepo
├── pnpm-lock.yaml # Lock file for pnpm
└── README.md # Project documentation
Copy

---

## How to Run the Project

### Prerequisites

Before running the project, ensure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)
- **pnpm**: [Install pnpm](https://pnpm.io/installation)

---

### Step-by-Step Guide

#### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/your-username/payever-assessment.git
cd payever-assessment

2. Set Up Environment Variables

Ensure the following environment variables are set in your docker-compose.yaml file or in a .env file:

    MongoDB:

        MONGO_INITDB_ROOT_USERNAME: Root username for MongoDB.

        MONGO_INITDB_ROOT_PASSWORD: Root password for MongoDB.

    RabbitMQ:

        RABBITMQ_DEFAULT_USER: Username for RabbitMQ.

        RABBITMQ_DEFAULT_PASS: Password for RabbitMQ.

    Invoicer Service:

        MONGODB_URI: MongoDB connection string.

        RABBITMQ_URL: RabbitMQ connection string.

    Report Consumer Service:

        RABBITMQ_URL: RabbitMQ connection string.

3. Build and Run the Project

Use Docker Compose to build and run the project:
bash
Copy

docker-compose up --build

This will:

    Start MongoDB and RabbitMQ.

    Build and start the invoicer service.

    Build and start the report-consumer service.

4. Access the Services

    Invoicer Service: Access the REST API at http://localhost:3000.

        Health check endpoint: http://localhost:3000/health.

    RabbitMQ Management UI: Access the RabbitMQ management interface at http://localhost:15672.

        Username: payever

        Password: 112358

5. Stop the Project

To stop the project, run:
bash
Copy

docker-compose down

Why This Project?

This project reflects my commitment to building robust, scalable, and maintainable systems. It demonstrates my ability to:

    Design and implement microservices using Nest.js.

    Use message queuing (RabbitMQ) to decouple services.

    Containerize applications using Docker and Docker Compose.

    Write clean, well-documented, and efficient code.

I believe that my technical skills, combined with my passion for innovation and problem-solving, make me a strong candidate for the Payever team. I am excited about the opportunity to contribute to Payever's mission and grow as part of your talented team.
Final Thoughts

Thank you for taking the time to review my technical assessment project. I hope it provides a clear picture of my capabilities and my enthusiasm for joining Payever. I am eager to bring my skills and dedication to your team and contribute to building innovative solutions that make a difference.

Let’s build the future together! 🚀

If you have any questions or would like to discuss the project further, please feel free to reach out. I look forward to the opportunity to work with you!
```
