# CI/CD Setup Guide

This repository is now configured for proper CI/CD workflows.

## For CI/CD Pipelines

Use these commands in your CI/CD pipeline:

```bash
# Install dependencies (clean install for reproducible builds)
npm run ci

# Run linting
npm run lint

# Build the project
npm run build

# Run tests with coverage
npm run test

# Security audit
npm run audit
```

## For Development

```bash
# Install dependencies for development
npm run install:all

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Files Required for CI/CD

- `package-lock.json` (root) - Generated and committed for reproducible builds
- `weather-report/package-lock.json` - Generated and committed for reproducible builds

## Notes

- Both package-lock.json files are now tracked in git for CI/CD reproducibility
- Use `npm run ci` instead of `npm ci` directly for multi-package setup
- All scripts can be run from the root directory
