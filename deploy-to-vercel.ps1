Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   DEPLOIEMENT EN PRODUCTION - MENU DU JOUR" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[1/3] Verification des modifications..." -ForegroundColor Green
git status
Write-Host ""
Write-Host "[2/3] Commit des modifications du logo officiel..." -ForegroundColor Green
git add .
git commit -m "fix: integration du logo officiel bundle et correction des images"
Write-Host ""
Write-Host "[3/3] Envoi vers GitHub et Vercel..." -ForegroundColor Green
git push origin main
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " SUCCES ! Deploiement lance sur Vercel :" -ForegroundColor Green
Write-Host " https://menu-du-jour-phi.vercel.app" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Read-Host -Prompt "Appuyez sur Entree pour fermer..."
