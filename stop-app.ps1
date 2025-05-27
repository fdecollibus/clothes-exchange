# Stop the application components
Write-Host "Stopping Clothes Exchange Application..." -ForegroundColor Yellow

# Function to stop processes by name
function Stop-Processes {
    param (
        [string]$processName
    )
    
    $processes = Get-Process $processName -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host "Stopping $processName..." -ForegroundColor Yellow
        $processes | Stop-Process -Force
    }
}

# Function to stop processes by port
function Stop-ProcessesByPort {
    param (
        [int]$port
    )
    
    $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
                 Select-Object -ExpandProperty OwningProcess | 
                 Get-Process -ErrorAction SilentlyContinue
    
    if ($processes) {
        Write-Host "Stopping processes on port $port..." -ForegroundColor Yellow
        $processes | Stop-Process -Force
    }
}

# Stop processes by port
$ports = @(3001, 5173, 5174)
foreach ($port in $ports) {
    Stop-ProcessesByPort -port $port
}

# Stop Node.js processes
Stop-Processes -processName "node"

# Stop MongoDB
Stop-Processes -processName "mongod"

# Stop any remaining PowerShell windows running the dev servers
Get-Process powershell | Where-Object {
    $_.MainWindowTitle -match "npm run dev"
} | Stop-Process -Force

# Stop all Node.js processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Stop MongoDB
Get-Process mongod -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "`nAll components stopped!" -ForegroundColor Green
Write-Host "To start the application again, run: .\start-app.ps1" -ForegroundColor Yellow
Write-Host "All services stopped." 