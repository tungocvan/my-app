@echo off
setlocal enabledelayedexpansion

:: ==== CONFIG ====
set BASE_URL=exp://u.expo.dev/65def5d4-5f12-40d5-91a5-df9c677e2406/group/
set GROUP=%~1

echo 🔍 Group lấy được: %GROUP%

echo ✅ Link hoàn chỉnh:
echo %BASE_URL%%GROUP%
echo.

pause
