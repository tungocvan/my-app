@echo off
chcp 65001 >nul
REM === create-module.bat ===
REM Cú pháp:
REM   create-module <tên>
REM   create-module <tên> --delete
REM Hỗ trợ tiếng Việt, UTF-8
REM Gọi create-screen.bat và create-stack.bat trong cùng thư mục

if "%~1"=="" (
  echo ❌ Vui lòng nhập tên module. Ví dụ: create-module about
  exit /b 1
)

set NAME=%~1
set ACTION=create

if "%~2"=="--delete" (
  set ACTION=delete
)

set BASEDIR=%~dp0
set SCREENS_DIR=%BASEDIR%screens
set STACKS_DIR=%BASEDIR%navigation\stacks

REM Chuyển chữ cái đầu thành hoa (About)
for /f "tokens=1* delims=" %%A in ("%NAME%") do (
  set "CAP_NAME=%%A"
)
set "CAP_NAME=%CAP_NAME:~0,1%"
set "LOWER_NAME=%CAP_NAME%"
for %%i in (%NAME%) do (
  set "CAP_NAME=!CAP_NAME!!NAME:~1!"
)
setlocal enabledelayedexpansion
set "CAP_NAME=%NAME%"
set "CAP_NAME=!CAP_NAME:~0,1!"
for %%A in (!CAP_NAME!) do set "CAP_NAME=!CAP_NAME:%CAP_NAME:~0,1%=!NAME:~0,1!!"
endlocal

REM Chữ cái đầu viết hoa chuẩn:
set "CAP_NAME=%NAME:~0,1%"
for %%A in (%NAME%) do set "CAP_NAME=%CAP_NAME%%NAME:~1%"
setlocal enabledelayedexpansion
set "CAP_NAME=!CAP_NAME:~0,1!"
endlocal

REM Chuẩn hóa tên file
set "FILE_SCREEN=%SCREENS_DIR%\%NAME:~0,1%.tmp"
set "CAP_NAME=%NAME:~0,1%"
set "CAP_NAME=%CAP_NAME:A=a%"
set "CAP_NAME=%CAP_NAME:B=b%"
REM === Bắt đầu ===
echo ====================================================
echo 🚀 Đang xử lý module: %NAME%  (Chế độ: %ACTION%)
echo ====================================================

if "%ACTION%"=="delete" (
    echo 🗑️  Đang xóa các file của module %NAME%...
    set SCREEN_FILE=%SCREENS_DIR%\%NAME:~0,1%%NAME:~1%Screen.js
    set STACK_FILE=%STACKS_DIR%\%NAME:~0,1%%NAME:~1%Stack.js

    if exist "%SCREENS_DIR%\%NAME:~0,1%%NAME:~1%Screen.js" (
        del "%SCREENS_DIR%\%NAME:~0,1%%NAME:~1%Screen.js"
        echo ✅ Đã xóa: %SCREENS_DIR%\%NAME:~0,1%%NAME:~1%Screen.js
    ) else (
        echo ⚠️  Không tìm thấy: %SCREENS_DIR%\%NAME:~0,1%%NAME:~1%Screen.js
    )

    if exist "%STACKS_DIR%\%NAME:~0,1%%NAME:~1%Stack.js" (
        del "%STACKS_DIR%\%NAME:~0,1%%NAME:~1%Stack.js"
        echo ✅ Đã xóa: %STACKS_DIR%\%NAME:~0,1%%NAME:~1%Stack.js
    ) else (
        echo ⚠️  Không tìm thấy: %STACKS_DIR%\%NAME:~0,1%%NAME:~1%Stack.js
    )

    echo ====================================================
    echo 🧹 Đã hoàn tất xóa module: %NAME%
    echo ====================================================
    exit /b 0
)

REM Nếu không có --delete → tạo module
echo ▶️  Đang tạo module %NAME%...

if exist "%BASEDIR%create-screen.bat" (
  call "%BASEDIR%create-screen.bat" %NAME%
) else (
  echo ❌ Không tìm thấy create-screen.bat
)

if exist "%BASEDIR%create-stack.bat" (
  call "%BASEDIR%create-stack.bat" %NAME%
) else (
  echo ❌ Không tìm thấy create-stack.bat
)

echo ====================================================
echo ✅ Hoàn tất tạo module: %NAME%
echo ====================================================
exit /b 0
