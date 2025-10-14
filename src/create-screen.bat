@echo off
REM === create-screen.bat ===
REM Usage: create-screen setting

if "%~1"=="" (
  echo ❌ Vui lòng nhập tên màn hình. Ví dụ: create-screen setting
  exit /b 1
)

set NAME=%~1

REM === Tạo PascalCase ===
for /f "usebackq delims=" %%A in (`powershell -NoProfile -Command "('%NAME%'.Substring(0,1).ToUpper()+('%NAME%'.Substring(1)))"`) do set PASCAL=%%A

set BASEDIR=%~dp0
set TEMPLATE=%BASEDIR%screens\DemoScreen.js
set DEST=%BASEDIR%screens\%PASCAL%Screen.js

echo 🚀 Đang tạo màn hình: %PASCAL%Screen
echo 📂 Thư mục: %BASEDIR%

if not exist "%TEMPLATE%" (
  echo ❌ Không tìm thấy file mẫu: %TEMPLATE%
  exit /b 1
)

if exist "%DEST%" (
  echo ⚠️  File đã tồn tại: %DEST% → Bỏ qua.
  exit /b 0
)

copy "%TEMPLATE%" "%DEST%" >nul
if errorlevel 1 (
  echo ❌ Sao chép thất bại.
  exit /b 1
)

echo 🔄 Đang thay thế chuỗi "Demo" → "%PASCAL%" ...
powershell -NoProfile -Command "(Get-Content -Raw -Encoding UTF8 '%DEST%') -replace 'Demo', '%PASCAL%' | Set-Content -Encoding UTF8 '%DEST%'"

echo ✅ Đã tạo thành công: %DEST%
exit /b 0
