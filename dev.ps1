# Ruta al directorio raíz del monorepo
$rootPath = Get-Location

# Ruta al directorio de la app y la API
$appPath = Join-Path $rootPath "app"
$apiPath = Join-Path $rootPath "api"

# Ejecutar "npm run dev" en /app en una nueva ventana
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "Set-Location '$appPath'; npm run dev"

# Ejecutar "node --watch index.js" en /api en una nueva ventana
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "Set-Location '$apiPath'; node --watch index.js"
