# CI/CD Setup Guide

This repository is configured for proper CI/CD workflows with a unified structure.

## For CI/CD Pipelines

Use these commands in your CI/CD pipeline:

```bash
# Install dependencies (clean install for reproducible builds)
npm ci

# Run linting
npm run lint

# Build the project
npm run build

# Run tests with coverage
npm test

# Security audit
npm run audit
```

## For Development

```bash
# Install dependencies for development
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

## Unified Project Structure

The project now has a clean, flat structure:

```
demo-repository/
├── source/              # All TypeScript source code
├── tests-new/           # All test files
├── dist/                # Build output
├── coverage/            # Test coverage reports
├── node_modules/        # Single dependency folder
├── package.json         # Single package configuration
├── package-lock.json    # Single lock file for CI/CD
├── tsconfig.json        # TypeScript configuration
├── jest.config.js       # Jest test configuration
└── .eslintrc.js        # ESLint configuration
```

## Benefits of Unified Structure

- ✅ Single `node_modules` directory
- ✅ Single `package.json` with all dependencies
- ✅ Simplified CI/CD scripts
- ✅ No nested project complexity
- ✅ Faster dependency installation
- ✅ Easier maintenance

## Files Required for CI/CD

- `package-lock.json` - Committed for reproducible builds
- `package.json` - Contains all scripts and dependencies

## Notes

- No more nested weather-report directory
- All source code directly in `/source/`
- All tests directly in `/tests-new/`
- Single unified dependency management
- Simplified build and test processes
