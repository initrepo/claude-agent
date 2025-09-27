@echo off
REM NPM Publishing Script for Windows - InitRepo Claude Agent

echo 🚀 InitRepo Claude Agent - NPM Publishing (Windows)
echo ========================================

REM Check if logged in to npm
npm whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not logged in to npm. Please run: npm login
    echo    Use username: carobbinschris
    exit /b 1
)

for /f %%i in ('npm whoami') do set NPM_USER=%%i
if not "%NPM_USER%"=="carobbinschris" (
    echo ❌ Wrong npm user. Expected: carobbinschris, Got: %NPM_USER%
    echo    Please run: npm logout && npm login
    exit /b 1
)

echo ✅ Logged in as: %NPM_USER%

REM Check git status
git status --porcelain >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('git status --porcelain') do (
        echo ❌ Working directory not clean. Please commit all changes first.
        exit /b 1
    )
)

echo ✅ Working directory is clean

REM Get current version
for /f %%i in ('node -p "require('./package.json').version"') do set CURRENT_VERSION=%%i
echo 📋 Current version: %CURRENT_VERSION%

REM Dry run publish
echo 🔍 Performing dry run...
npm publish --dry-run
if %errorlevel% neq 0 (
    echo ❌ Dry run failed
    exit /b 1
)

REM Confirm publish
set /p confirm="🚀 Ready to publish version %CURRENT_VERSION% to npm. Continue? [y/N]: "
if /i not "%confirm%"=="y" if /i not "%confirm%"=="yes" (
    echo ❌ Publish cancelled
    exit /b 1
)

REM Publish to npm
echo 📤 Publishing to npm...
npm publish
if %errorlevel% neq 0 (
    echo ❌ Publish failed
    exit /b 1
)

echo.
echo 🎉 Successfully published initrepo-claude-agent@%CURRENT_VERSION%!
echo.
echo 📋 Next steps:
echo    • Push to git: git push
echo    • Create GitHub release
echo    • Update documentation if needed
echo.
echo 🔗 Package URL: https://www.npmjs.com/package/initrepo-claude-agent