# SonarCloud Integration

## Configuration

This project is configured with SonarCloud for code quality analysis with strict Quality Gate settings.

### Quality Gate Settings

The Quality Gate is configured to fail if there are:
- **1 or more new bugs**
- **1 or more new code smells**

### Key Configuration Files

1. **sonar-project.properties**: Basic SonarCloud configuration
   - Project key and organization
   - Source and test paths
   - Coverage report paths
   - Quality gate wait setting

2. **.github/workflows/ci-cd.yml**: CI/CD pipeline with SonarCloud integration
   - Runs after tests pass
   - Generates coverage reports
   - Performs SonarCloud analysis

### Workflow

1. **Lint**: ESLint analysis
2. **Test**: Jest tests with coverage
3. **SonarCloud**: Code quality analysis with strict quality gate

The pipeline will fail if any step fails, including SonarCloud quality gate violations.

## Quality Gate Enforcement

- **sonar.qualitygate.wait=true** ensures the pipeline waits for SonarCloud analysis
- Any new bugs or code smells will cause the pipeline to fail
- This enforces high code quality standards for all new code changes
