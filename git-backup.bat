@echo off

REM Lấy tham số commit message
set "param1=%~1"
if "%param1%"=="" (
    echo Vui long nhap ten de commit
    exit /b 1
)

REM Git commands
git add .
git commit -m "%param1%"
git push
