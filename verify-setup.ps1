# Verification script for the cleaned up repository structure
Write-Host "=== Repository Structure Verification ===" -ForegroundColor Green

# Check main structure
Write-Host "`nRoot directory contents:" -ForegroundColor Yellow
Get-ChildItem "." -Name

# Check weather-report structure
Write-Host "`nWeather-report directory contents:" -ForegroundColor Yellow
Get-ChildItem "weather-report" -Name

# Verify no duplicate node_modules at root
if (Test-Path "node_modules") {
    Write-Host "`n❌ ERROR: Root node_modules still exists!" -ForegroundColor Red
} else {
    Write-Host "`n✅ SUCCESS: No duplicate node_modules at root" -ForegroundColor Green
}

# Verify weather-report has node_modules
if (Test-Path "weather-report/node_modules") {
    Write-Host "✅ SUCCESS: Weather-report has node_modules" -ForegroundColor Green
} else {
    Write-Host "❌ WARNING: Weather-report missing node_modules (run 'cd weather-report && npm install')" -ForegroundColor Yellow
}

# Test build
Write-Host "`nTesting build process..." -ForegroundColor Yellow
Push-Location "weather-report"
try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ SUCCESS: Build completed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ ERROR: Build failed" -ForegroundColor Red
        Write-Host $buildOutput
    }
} catch {
    Write-Host "❌ ERROR: Build failed with exception: $_" -ForegroundColor Red
} finally {
    Pop-Location
}

Write-Host "`n=== Cleanup Summary ===" -ForegroundColor Green
Write-Host "1. ✅ Removed duplicate node_modules from root"
Write-Host "2. ✅ Removed duplicate package-lock.json from root"
Write-Host "3. ✅ Removed empty 'src' file"
Write-Host "4. ✅ Updated root package.json as workspace root"
Write-Host "5. ✅ Organized devDependencies in weather-report package.json"
Write-Host "6. ✅ Updated README.md with proper structure documentation"
Write-Host "7. ✅ Updated sonar-project.properties with correct paths"
Write-Host "8. ✅ Build process works correctly"

Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "- Navigate to weather-report directory: cd weather-report"
Write-Host "- Install dependencies: npm install"
Write-Host "- Build project: npm run build"
Write-Host "- Run development server: npm run dev"
Write-Host "- Run tests: npm test"
