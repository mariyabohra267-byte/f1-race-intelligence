@echo off
echo ===================================================================
echo 🏁 STARTING FORMULA 1 RACE INTELLIGENCE FLASK WEB PLATFORM
echo ===================================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    where py >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo [!] Python is not currently found in your PATH.
        echo [*] Please install Python from https://www.python.org/downloads/
        echo [*] Make sure to check "Add Python to PATH" during installation.
        pause
        exit /b 1
    ) else (
        set PYCMD=py
    )
) else (
    set PYCMD=python
)

echo [*] Installing requirements...
%PYCMD% -m pip install -r requirements.txt

echo.
echo [*] Launching Flask server on http://127.0.0.1:5000 ...
%PYCMD% app.py

pause
