# 👤 Créer un Compte de Test

## ⚠️ Prérequis

**Vous devez d'abord configurer Supabase !**

Si vous voyez encore l'erreur "Supabase non configuré", suivez d'abord les instructions dans `SOLUTION_FINALE.md`.

## ✅ Méthode 1 : Script automatique (Recommandé)

Une fois Supabase configuré :

```bash
cd frontend
node create-test-user.js
```

Cela créera un utilisateur avec :
- **Email** : `test@insideai.com`
- **Mot de passe** : `Test123456!`

## ✅ Méthode 2 : Via l'interface (Plus simple)

1. **Configurez Supabase** (voir `SOLUTION_FINALE.md`)
2. **Redémarrez le serveur** : `npm run dev`
3. **Allez sur** : http://localhost:3000/register
4. **Créez un compte** avec :
   - Nom : Votre nom
   - Email : Votre email
   - Mot de passe : Votre mot de passe
5. **Connectez-vous** sur : http://localhost:3000/login

## ✅ Méthode 3 : Via Supabase Dashboard

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. **Authentication** → **Users**
4. Cliquez sur **"Add user"** → **"Create new user"**
5. Entrez :
   - Email : `test@example.com`
   - Mot de passe : `Test123456!`
   - Auto Confirm User : ✅ (cochez cette case)
6. Cliquez sur **"Create user"**
7. Connectez-vous avec ces identifiants

## 🎯 Identifiants de test (si créés via script)

- **Email** : `test@insideai.com`
- **Mot de passe** : `Test123456!`

## 📝 Note importante

Si la confirmation d'email est activée dans Supabase :
- Désactivez-la temporairement dans **Authentication** → **Settings** → **Disable "Enable email confirmations"**
- Ou vérifiez votre boîte email et cliquez sur le lien de confirmation

## 🚀 Après connexion

Une fois connecté, vous serez redirigé vers :
- `/onboarding` si vous n'avez pas complété l'onboarding
- `/dashboard` si vous avez déjà complété l'onboarding

