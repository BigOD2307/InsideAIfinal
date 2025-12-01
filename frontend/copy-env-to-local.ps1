# Script pour copier .env vers .env.local
$envFile = Join-Path $PSScriptRoot ".env"
$envLocalFile = Join-Path $PSScriptRoot ".env.local"

Write-Host "🔧 Copie de .env vers .env.local" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $envFile)) {
    Write-Host "❌ Fichier .env introuvable!" -ForegroundColor Red
    exit 1
}

$content = Get-Content $envFile -Raw

if ([string]::IsNullOrWhiteSpace($content)) {
    Write-Host "⚠️  Le fichier .env est vide" -ForegroundColor Yellow
    Write-Host "📝 Assurez-vous d'avoir ajouté vos variables dans .env" -ForegroundColor Yellow
    exit 1
}

# Copier vers .env.local
$content | Out-File -FilePath $envLocalFile -Encoding utf8 -NoNewline

Write-Host "✅ Fichier .env.local créé avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. ⚠️  IMPORTANT: Redémarrez le serveur Next.js" -ForegroundColor Yellow
Write-Host "      - Arrêtez le serveur (Ctrl+C)" -ForegroundColor Gray
Write-Host "      - Relancez: npm run dev" -ForegroundColor Gray
Write-Host "   2. Vérifiez avec: node verify-env.js" -ForegroundColor Gray
Write-Host "   3. Visitez: http://localhost:3000/test-env" -ForegroundColor Gray
Write-Host ""

