Write-Host "===================================================================" -ForegroundColor Red
Write-Host "🏁 FORMULA 1 RACE INTELLIGENCE FLASK WEB PLATFORM" -ForegroundColor White
Write-Host "===================================================================" -ForegroundColor Red
Write-Host ""

$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $pythonCmd = "py"
}

if (-not $pythonCmd) {
    Write-Host "[!] Python executable not found in PATH." -ForegroundColor Yellow
    Write-Host "[*] Please install Python from https://www.python.org/downloads/ (Check 'Add Python to PATH')" -ForegroundColor Cyan
    Exit 1
}

Write-Host "[*] Checking and installing Python dependencies..." -ForegroundColor Cyan
& $pythonCmd -m pip install -r requirements.txt

Write-Host ""
Write-Host "[*] Starting Flask web application on http://127.0.0.1:5000 ..." -ForegroundColor Green
Write-Host "[*] Dashboard URL: http://127.0.0.1:5000/dashboard" -ForegroundColor Green
Write-Host "[*] Story URL:     http://127.0.0.1:5000/story" -ForegroundColor Green
Write-Host "[*] Guide:         http://127.0.0.1:5000/instructions" -ForegroundColor Green
Write-Host ""

& $pythonCmd app.py
