@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ⚙️ Kiểm tra nếu đang chạy trong PowerShell → chuyển sang CMD
set "PSCHECK=%ComSpec%"
if /i not "%PSCHECK%"=="C:\Windows\System32\cmd.exe" (
    echo Đang chuyển sang môi trường CMD để chạy đúng cách...
    cmd /c "%~f0"
    exit /b
)

title 🚀 Expo Cloud Publisher Menu
echo.
echo ===========================================
echo     📦 XUẤT BẢN ỨNG DỤNG LÊN EXPO CLOUD
echo ===========================================
echo.

:: -----------------------------
::  CHỌN BRANCH CẦN PUBLISH
:: -----------------------------
echo 🔀 Chọn branch để xuất bản:
echo.
echo   [1] main   - Bản chính (ổn định)
echo   [2] dev    - Bản phát triển nội bộ
echo   [3] beta   - Bản thử nghiệm
echo.

set /p CHOICE=👉 Nhập số (1-3): 

if "%CHOICE%"=="1" set BRANCH=main
if "%CHOICE%"=="2" set BRANCH=dev
if "%CHOICE%"=="3" set BRANCH=beta

if "%BRANCH%"=="" (
    echo ❌ Lựa chọn không hợp lệ. Thoát...
    pause
    exit /b
)

echo.
set /p MESSAGE=📝 Nhập nội dung cập nhật (message): 
if "%MESSAGE%"=="" set MESSAGE=Auto publish at %date% %time%

echo.
echo 🔍 Kiểm tra trạng thái đăng nhập Expo...

:: Dò thông tin tài khoản đang đăng nhập
for /f "tokens=*" %%A in ('npx expo whoami 2^>nul') do set "EXPO_USER=%%A"

if "%EXPO_USER%"=="" (
    echo ⚠️  Bạn chưa đăng nhập vào Expo!
    echo -------------------------------------------
    echo 🔐 Bắt đầu đăng nhập...
    echo.
    npx expo login
    if %errorlevel% neq 0 (
        echo ❌ Đăng nhập thất bại. Dừng tiến trình.
        pause
        exit /b
    )
) else (
    echo ✅ Đã đăng nhập với tài khoản: %EXPO_USER%
)

echo.
echo 🧩 Kiểm tra thay đổi trong app.json...

:: Tính hash MD5 của app.json
for /f "tokens=*" %%H in ('certutil -hashfile app.json MD5 ^| find /i /v "hash"') do set "CUR_HASH=%%H"

set "HASH_FILE=.last_appjson_hash"
set "PREV_HASH="

if exist "%HASH_FILE%" (
    set /p PREV_HASH=<"%HASH_FILE%"
)

if "%PREV_HASH%"=="" (
    echo 🔰 Lần đầu chạy, lưu hash mới...
    echo !CUR_HASH!>"%HASH_FILE%"
)

if /i "%CUR_HASH%"=="%PREV_HASH%" (
    echo ✅ Không có thay đổi trong app.json → chỉ publish nhanh (eas update)
    echo.
    npx eas update --branch %BRANCH% --message "%MESSAGE%"
) else (
    echo ⚙️ Có thay đổi trong app.json → thực hiện cập nhật đầy đủ (eas update)
    echo.
    echo !CUR_HASH!>"%HASH_FILE%"
    npx eas update --branch %BRANCH% --message "%MESSAGE%"
)


if %errorlevel% equ 0 (
    echo.
    echo ✅ Hoàn tất! Ứng dụng đã được publish thành công.
    echo 🌐 Truy cập: https://expo.dev/accounts/tungocvan/projects/my-app
    start https://expo.dev/accounts/tungocvan/projects/my-app
) else (
    echo.
    echo ❌ Xuất bản thất bại. Kiểm tra lại lỗi ở trên.
)

echo.
pause
