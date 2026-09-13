@echo off
title Deploiement Menu du Jour sur Vercel
color 0A
echo ========================================================
echo    DEPLOIEMENT EN PRODUCTION - MENU DU JOUR
echo ========================================================
echo.
echo [1/3] Verification des fichiers modifies...
git status
echo.
echo [2/3] Enregistrement du commit avec la refonte et le logo x3...
git add .
git commit -m "feat: refonte super admin /admin, octroi manuel abonnements, separation profil/localisation, logo x3 et media 100Mo"
echo.
echo [3/3] Envoi vers GitHub et declenchement de Vercel...
git push origin main
echo.
echo ========================================================
echo  SUCCES ! Le deploiement est en cours sur Vercel :
echo  https://menu-du-jour-phi.vercel.app
echo ========================================================
pause
