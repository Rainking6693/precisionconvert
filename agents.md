# Repository Guidelines

## Project Structure & Module Organization

DirectoryBolt follows a standard Next.js 14 structure with TypeScript. Source code is organized in `/pages` for Next.js pages and API routes, `/components` for React components grouped by feature (ai-portal, analytics, dashboard, etc.), `/lib` for utilities, database connections, AI services, and type definitions, and `/public` for static assets. The `/autobolt-extension` directory contains the Chrome extension code for automated submissions.

## Build, Test, and Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Code quality checks
npm run lint

# Comprehensive testing
npm run test:comprehensive

# E2E testing
npm run test:e2e

# AI integration tests
npm run test:ai-integration
```

## Coding Style & Naming Conventions

- **Indentation**: 2 spaces (TypeScript/JavaScript)
- **File naming**: kebab-case for components, camelCase for utilities
- **Function/variable naming**: camelCase with descriptive names
- **Linting**: ESLint with Next.js configuration, TypeScript strict mode enabled

## Testing Guidelines

- **Framework**: Jest for unit tests, Playwright for E2E testing
- **Test files**: Located in `/tests` directory with feature-specific subdirectories
- **Running tests**: Use `npm run test:comprehensive` for full test suite
- **Coverage**: Comprehensive test coverage for AI services, payment flows, and user journeys

## Commit & Pull Request Guidelines

- **Commit format**: Descriptive messages focusing on feature/fix areas (e.g., "autobolt", "fixes", "updates")
- **PR process**: Team-based development with code review requirements
- **Branch naming**: Feature branches with descriptive names

---

# Repository Tour

## 🎯 What This Repository Does

Precisionconvert is a webbased platform that automates unit conversion.

--

