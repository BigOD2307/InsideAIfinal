# 🔧 Dépannage - Problèmes d'Inscription

## Problème : L'inscription ne fonctionne pas

### ✅ Vérifications à faire

#### 1. Vérifier la configuration Supabase

Ouvrez la console du navigateur (F12) et vérifiez s'il y a des erreurs.

**Erreur : "supabaseUrl is required"**
- Le fichier `.env.local` n'existe pas ou n'est pas correctement configuré
- Solution : Vérifiez que le fichier existe dans `frontend/.env.local`
- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont corrects

#### 2. Vérifier la clé Supabase

**Erreur : "Invalid API key" ou "JWT expired"**
- La clé Supabase anon key est incorrecte ou expirée
- Solution : 
  1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
  2. Settings > API
  3. Copiez la nouvelle clé "anon public"
  4. Mettez à jour `.env.local`
  5. Redémarrez le serveur

#### 3. Vérifier les migrations SQL

**Erreur : "relation does not exist" ou erreur de trigger**
- Les migrations SQL n'ont pas été exécutées
- Solution :
  1. Allez dans Supabase > SQL Editor
  2. Exécutez le script `supabase/migrations/001_initial_schema.sql`
  3. Vérifiez que les tables `users`, `conversations`, etc. existent

#### 4. Vérifier la confirmation d'email

**L'inscription semble réussir mais vous ne pouvez pas vous connecter**
- Par défaut, Supabase envoie un email de confirmation
- Solution (pour le développement) :
  1. Allez dans Supabase > Authentication > Settings
  2. Désactivez "Enable email confirmations" temporairement
  3. Ou vérifiez votre boîte email et cliquez sur le lien de confirmation

#### 5. Vérifier les policies RLS

**Erreur : "new row violates row-level security policy"**
- Les policies RLS bloquent la création du profil
- Solution : Vérifiez que le trigger `on_auth_user_created` existe et fonctionne

### 🔍 Debug étape par étape

1. **Ouvrez la console du navigateur (F12)**
   - Allez dans l'onglet "Console"
   - Essayez de vous inscrire
   - Regardez les messages d'erreur

2. **Vérifiez les logs Supabase**
   - Allez dans Supabase > Logs > API Logs
   - Regardez les requêtes d'authentification

3. **Testez directement avec Supabase**
   - Allez dans Supabase > Authentication > Users
   - Essayez de créer un utilisateur manuellement
   - Vérifiez si cela fonctionne

### 🛠️ Solutions rapides

#### Solution 1 : Désactiver la confirmation d'email (développement)

Dans Supabase :
1. Authentication > Settings
2. Désactivez "Enable email confirmations"
3. Sauvegardez
4. Réessayez l'inscription

#### Solution 2 : Vérifier le fichier .env.local

```bash
cd frontend
# Vérifiez que le fichier existe
cat .env.local

# Vérifiez les variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

#### Solution 3 : Réinitialiser Supabase

Si rien ne fonctionne :
1. Créez un nouveau projet Supabase
2. Exécutez les migrations SQL
3. Mettez à jour `.env.local` avec les nouvelles clés
4. Redémarrez l'application

### 📝 Messages d'erreur courants

| Erreur | Cause | Solution |
|--------|-------|----------|
| "supabaseUrl is required" | Variables d'environnement manquantes | Vérifier `.env.local` |
| "Invalid API key" | Clé Supabase incorrecte | Récupérer la nouvelle clé |
| "User already registered" | Email déjà utilisé | Utiliser un autre email ou se connecter |
| "Password should be at least 6 characters" | Mot de passe trop court | Utiliser un mot de passe de 6+ caractères |
| "Email rate limit exceeded" | Trop de tentatives | Attendre quelques minutes |
| "relation does not exist" | Tables manquantes | Exécuter les migrations SQL |

### 🆘 Besoin d'aide supplémentaire ?

1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs Supabase
3. Vérifiez que toutes les étapes de configuration sont complètes
4. Consultez la documentation Supabase : [supabase.com/docs](https://supabase.com/docs)

