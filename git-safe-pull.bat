@echo off
:: ============================================
:: Safe Git Pull Script for Windows (.bat)
:: Tác giả: Từ Ngọc Vân (chuyển từ bash)
:: ============================================
chcp 65001 >nul

setlocal enabledelayedexpansion

:: Cấu hình
set "BRANCH=main"
set "BACKUP_DIR=git-backups"

:: Tạo thư mục backup nếu chưa có
if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
)

:: Tạo timestamp (YYYYMMDD-HHMMSS)
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do (
    set today=%%c%%b%%a
)
for /f "tokens=1-2 delims=: " %%a in ("%time%") do (
    set now=%%a%%b
)
set "TIMESTAMP=%today%-%now%"
set "PATCH_FILE=%BACKUP_DIR%\backup-%TIMESTAMP%.patch"

echo 🔍 Kiểm tra thay đổi local...

:: Kiểm tra thay đổi local (unstaged + staged)
git diff --quiet
set DIFF1=%ERRORLEVEL%
git diff --cached --quiet
set DIFF2=%ERRORLEVEL%

if not "%DIFF1%"=="0" (
    set CHANGED=1
) else if not "%DIFF2%"=="0" (
    set CHANGED=1
) else (
    set CHANGED=0
)

if "%CHANGED%"=="1" (
    echo 📦 Phát hiện thay đổi local → tạo backup: %PATCH_FILE%
    git diff > "%PATCH_FILE%"
) else (
    echo ✅ Không có thay đổi local.
)

echo ⬇️  Fetching remote...
git fetch --all

echo 🧹 Reset về origin/%BRANCH%...
git reset --hard origin/%BRANCH%

echo ⬇️  Pull code mới nhất...
git pull origin %BRANCH%

echo 🎉 Hoàn tất! Code đã được đồng bộ với remote.

if exist "%PATCH_FILE%" (
    echo 📂 Backup thay đổi local lưu tại: %PATCH_FILE%
    echo 👉 Nếu muốn áp lại, dùng: git apply "%PATCH_FILE%"
)

pause
