# Demo Repository - Binar AI Practice

## Project Summary

This repository contains a weather application demo with intentional vulnerabilities for educational purposes.

## Structure

- `/weather-report/` - Main weather application (TypeScript, Express, SQLite)
- `/sonar-project.properties` - SonarCloud configuration for code analysis

## Quick Start

```bash
# Navigate to the weather application
cd weather-report

# Install dependencies
npm install

# Build the project
npm run build

# Run tests with coverage
npm test

# Start development server
npm run dev

# Start production server
npm start
```

## Educational Purpose

This repository is designed to demonstrate:

### 1. Code Quality Issues
- Various TypeScript examples showing common code smells
- Security vulnerabilities for learning purposes
- Best practices for code improvement

### 2. Weather Checker App Backend
- A backend application built with TypeScript, Express, and SQLite
- Features endpoints for weather data, history, and analysis
- Intentionally includes insecure code and code smells to help users learn to identify and fix such issues
- Example vulnerabilities: hardcoded secrets, SQL injection, zombie code, and more

## Development

- Main application code: `/weather-report/source/`
- Tests: `/weather-report/tests/`
- Build output: `/weather-report/dist/`

For detailed information about the weather application, see the [weather-report README](./weather-report/README.md).