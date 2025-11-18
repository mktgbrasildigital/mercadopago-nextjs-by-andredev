# Script para fazer deploy apenas do servidor no Google Cloud Run
# Execute: .\deploy-server.ps1

Write-Host "🚀 Preparando deploy do servidor Express no Google Cloud Run..." -ForegroundColor Green

# Criar diretório temporário para o deploy
$deployDir = "deploy-server"
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# Copiar apenas os arquivos necessários
Write-Host "📦 Copiando arquivos necessários..." -ForegroundColor Yellow
Copy-Item "server.js" -Destination $deployDir
Copy-Item "package-server.json" -Destination "$deployDir\package.json"
Copy-Item "Dockerfile" -Destination $deployDir
Copy-Item ".dockerignore" -Destination $deployDir

# Navegar para o diretório de deploy
Set-Location $deployDir

# Criar package-lock.json limpo
Write-Host "📋 Gerando package-lock.json limpo..." -ForegroundColor Yellow
npm install --package-lock-only

# Fazer deploy
Write-Host "☁️ Fazendo deploy no Google Cloud Run..." -ForegroundColor Cyan
gcloud run deploy mercadopago-server `
    --source . `
    --region=us-central1 `
    --allow-unauthenticated `
    --port=8080

# Voltar para o diretório original
Set-Location ..

# Limpar diretório temporário
Write-Host "🧹 Limpando arquivos temporários..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $deployDir

Write-Host "✅ Deploy concluído!" -ForegroundColor Green
