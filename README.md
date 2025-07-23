# Weather Checker Application

A Node.js/TypeScript backend application with intentional vulnerabilities for educational purposes.

## Project Structure

```
demo-repository/
├── source/              # TypeScript source code
│   ├── app.ts          # Main application entry
│   ├── weatherService.ts
│   ├── weatherController.ts
│   ├── weatherRoutes.ts
│   ├── weatherModel.ts
│   └── database.ts
├── tests-new/          # Jest test files
├── dist/               # Build output
├── coverage/           # Test coverage reports
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── jest.config.js      # Jest test configuration
└── .eslintrc.js       # ESLint configuration
```

## Quick Start

```bash
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

# Run linting
npm run lint
```

## Educational Purpose

This repository demonstrates:

### Code Quality Issues
- TypeScript examples showing common code smells
- Security vulnerabilities for learning purposes
- Best practices for code improvement

### Weather Application Features
- Express.js REST API
- SQLite database integration
- Weather data endpoints
- Request/response handling
- Error management

### Intentional Vulnerabilities
- SQL injection examples
- Hardcoded secrets
- Input validation issues
- Error handling problems

## Development

- **Main source**: `/source/`
- **Tests**: `/tests-new/`
- **Build output**: `/dist/`
- **Coverage reports**: `/coverage/`

## Testing

The project includes comprehensive tests with:
- Unit tests for services
- Integration tests for routes
- Code coverage reporting
- Jest configuration

Run `npm test` to execute all tests and generate coverage reports.

## CI/CD

The project is configured for continuous integration with:
- TypeScript compilation
- ESLint code quality checks
- Jest test execution
- Coverage reporting
- SonarCloud integration

Use `npm run ci` for clean dependency installation in CI environments.