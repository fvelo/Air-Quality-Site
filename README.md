# Air-Quality-Site

A full-stack Node.js/TypeScript API and dashboard for collecting, storing, and visualizing data from a custom air-quality monitor.

## Table of Contents

- [About](#about)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Configuration](#configuration)  
  - [Running Locally](#running-locally)  

## About

This repository contains a Node.js/TypeScript back-end API and a static front-end dashboard for monitoring air quality. Data is ingested from a custom hardware sensor, stored in a SQL database, and visualized in real time and via historical charts.

## Features

- 🔄 **Real-Time Data Ingestion** from your air-quality sensor  
- 📊 **Interactive Charts & Historical Trends**  (in the future)
- 🗄️ **SQL-Backed Storage** (MySQL)
- ⚙️ **TypeScript-Powered Express API**  
- 🌐 **Static HTML/CSS Front-End**  

## Tech Stack

- **Node.js** & **Express** (API server)  
- **TypeScript** & **JavaScript**  
- **SQL** database (MySQL)  
- **HTML/CSS/TypeScript** front-end in `public/webpages`  
- **dotenv** for environment-based configuration  
- **Docker** (optional)  

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v22.14.0  
- npm
- A running SQL database instance

### Installation

1. **Clone the repo**  
   
   ```bash
   git clone https://github.com/fvelo/Air-Quality-Site.git
   cd Air-Quality-Site
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
### Configuration
1. **Copy the example env file**
   ```bash
   cp .env.example .env
   ```
2. ***Edit .env and fill in your credentials and settings:***
| Variable      | Description                 | Example           |
| ------------- | --------------------------- | ----------------- |
| `DB_HOST`     | Database host               | `localhost`       |
| `DB_PORT`     | Database port               | `5432`            |
| `DB_USER`     | Database username           | `airquality_user` |
| `DB_PASSWORD` | Database user password      | `your_password`   |
| `DB_NAME`     | Database name               | `airquality`      |
| `PORT`        | Port for the Express server | `3000`            |

### Running locally
  1. For dev with nodemon
    ```
    npm start
    ```
  2. In docker
     ```bash
     npm run build
     ```
