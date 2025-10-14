@echo off
REM ================================
REM Script create standard folders safely for React Native / Expo project
REM ================================

echo Creating project folder structure...

REM Assets folders
IF NOT EXIST "assets" mkdir "assets"
IF NOT EXIST "assets\images" mkdir "assets\images"
IF NOT EXIST "assets\icons" mkdir "assets\icons"
IF NOT EXIST "assets\fonts" mkdir "assets\fonts"

REM Source folders
IF NOT EXIST "src" mkdir "src"
IF NOT EXIST "src\api" mkdir "src\api"
IF NOT EXIST "src\components" mkdir "src\components"
IF NOT EXIST "src\constants" mkdir "src\constants"
IF NOT EXIST "src\hooks" mkdir "src\hooks"
IF NOT EXIST "src\navigation" mkdir "src\navigation"
IF NOT EXIST "src\redux" mkdir "src\redux"
IF NOT EXIST "src\redux\slices" mkdir "src\redux\slices"
IF NOT EXIST "src\screens" mkdir "src\screens"
IF NOT EXIST "src\services" mkdir "src\services"
IF NOT EXIST "src\utils" mkdir "src\utils"

echo All folders created successfully!
pause
