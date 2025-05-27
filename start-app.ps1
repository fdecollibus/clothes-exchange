# Start the application components
Write-Host "Starting Clothes Exchange Application..." -ForegroundColor Green

# Function to start a component
function Start-Component {
    param (
        [string]$name,
        [string]$directory,
        [string]$command
    )
    
    Write-Host "Starting $name..." -ForegroundColor Yellow
    if (-not (Test-Path $directory)) {
        Write-Host "Error: Directory '$directory' not found!" -ForegroundColor Red
        return $false
    }
    
    try {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$directory'; $command"
        return $true
    } catch {
        Write-Host ("Error starting {0}: {1}" -f $name, $_.Exception.Message) -ForegroundColor Red
        return $false
    }
}

# Function to check if a port is in use
function Test-PortInUse {
    param (
        [int]$port
    )
    $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $port)
    try {
        $listener.Start()
        $listener.Stop()
        return $false
    } catch {
        return $true
    }
}

# Check and stop any existing processes
Write-Host "Checking for existing processes..." -ForegroundColor Yellow
$ports = @(3001, 5173, 5174)
foreach ($port in $ports) {
    if (Test-PortInUse $port) {
        Write-Host "Port $port is in use. Attempting to free it..." -ForegroundColor Yellow
        Get-Process | Where-Object {$_.MainWindowTitle -eq ""} | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# Start MongoDB (if installed)
try {
    Write-Host "Checking MongoDB..." -ForegroundColor Yellow
    $mongod = Get-Process mongod -ErrorAction SilentlyContinue
    if (-not $mongod) {
        Write-Host "Starting MongoDB..." -ForegroundColor Yellow
        Start-Process mongod -NoNewWindow
        Start-Sleep -Seconds 2
    }
} catch {
    Write-Host "MongoDB not found or already running" -ForegroundColor Yellow
}

# Start Backend
$backendStarted = Start-Component -name "Backend" -directory "backend" -command "npm run dev"
if (-not $backendStarted) {
    Write-Host "Failed to start Backend. Please check the backend directory and try again." -ForegroundColor Red
    exit 1
}

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start Frontend
$frontendStarted = Start-Component -name "Frontend" -directory "frontend" -command "npm run dev"
if (-not $frontendStarted) {
    Write-Host "Failed to start Frontend. Please check the frontend directory and try again." -ForegroundColor Red
    exit 1
}

# Start Admin Frontend
$adminFrontendStarted = Start-Component -name "Admin Frontend" -directory "admin-frontend" -command "npm run dev"
if (-not $adminFrontendStarted) {
    Write-Host "Failed to start Admin Frontend. Please check the admin-frontend directory and try again." -ForegroundColor Red
    exit 1
}

Write-Host "`nAll components started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Admin Frontend: http://localhost:5174" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "`nTo stop all components, run: .\stop-app.ps1" -ForegroundColor Yellow 