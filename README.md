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
- 🗄️ **SQL-Backed Storage** (MariaDB)
- ⚙️ **TypeScript-Powered Express API**  
- 🌐 **Static HTML/CSS Front-End**  

## Tech Stack

- **Node.js** & **Express** (API server)  
- **TypeScript** in src  
- **SQL** database (MariaDB)  
- **HTML/CSS** front-end in `public/webpages`
- **dotenv** for environment-based configuration  
- **Docker**   

## Getting Started

### Prerequisites

- Docker instance

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/fvelo/Air-Quality-Site.git
   cd Air-Quality-Site
   ```   
### Configuration
1. **Copy the example env file**
   ```bash
   cp .env.example .env
   ```
2. **Edit .env and fill in your credentials and settings:**
   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=airquality_user
   DB_PASSWORD=your_password
   DB_NAME=airquality
   PORT=3000
   ```
### Running locally
  1. Build image
     ```bash
      docker build -t air-quality-fullstack .
      ```
  2. Run it with yaml
     ```bash
     service:
       air-quality-fullstack:
         container_name: air-quality-fullstack
         build: .
         image: air-quality-fullstack:latest
         ports:
            - "3000:3000"
         restart: always
     ```
