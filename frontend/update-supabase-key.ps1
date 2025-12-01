# Script PowerShell pour mettre à jour la clé Supabase
Write-Host "🔧 Mise à jour de la clé Supabase" -ForegroundColor Cyan
Write-Host ""

$envFile = Join-Path $PSScriptRoot ".env.local"

if (-not (Test-Path $envFile)) {
    Write-Host "❌ Fichier .env.local introuvable!" -ForegroundColor Red
    Write-Host "📝 Créez-le d'abord avec: node setup-env.js" -ForegroundColor Yellow
    exit 1
}

Write-Host "📝 Entrez votre clé Supabase Anon Key:" -ForegroundColor Yellow
Write-Host "   (Vous pouvez la trouver dans Supabase > Settings > API > anon public)" -ForegroundColor Gray
Write-Host "   (La clé commence généralement par: eyJ...)" -ForegroundColor Gray
Write-Host ""

$newKey = Read-Host "Clé Supabase Anon Key"

if ([string]::IsNullOrWhiteSpace($newKey)) {
    Write-Host "❌ Clé vide. Opération annulée." -ForegroundColor Red
    exit 1
}

# Nettoyer la clé (enlever les espaces)
$newKey = $newKey.Trim()

# Lire le fichier
$content = Get-Content $envFile -Raw

# Remplacer la clé
$pattern = 'NEXT_PUBLIC_SUPABASE_ANON_KEY=.*'
$replacement = "NEXT_PUBLIC_SUPABASE_ANON_KEY=$newKey"

if ($content -match $pattern) {
    $content = $content -replace $pattern, $replacement
    
    # Sauvegarder
    Set-Content -Path $envFile -Value $content -NoNewline
    
    Write-Host ""
    Write-Host "✅ Clé Supabase mise à jour avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "   1. ⚠️  IMPORTANT: Redémarrez le serveur Next.js" -ForegroundColor Yellow
    Write-Host "      - Arrêtez le serveur (Ctrl+C)" -ForegroundColor Gray
    Write-Host "      - Relancez: npm run dev" -ForegroundColor Gray
    Write-Host "   2. Vérifiez que les migrations SQL sont exécutées dans Supabase" -ForegroundColor Gray
    Write-Host "   3. Testez l'inscription à nouveau" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "❌ Impossible de trouver NEXT_PUBLIC_SUPABASE_ANON_KEY dans le fichier" -ForegroundColor Red
    exit 1
}

