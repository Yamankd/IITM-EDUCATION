@echo off
cd server
echo Resetting Admin Details...
node reset_admin.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ Failed to reset admin.
) else (
    echo.
    echo ✅ Admin reset script finished.
)
pause
