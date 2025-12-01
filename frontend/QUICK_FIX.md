# 🚨 Solution Rapide - Problème Supabase

## ⚡ Solution en 3 étapes

### Étape 1 : Mettre à jour la clé Supabase

**Option A : Utiliser le script automatique**
```bash
cd frontend
node fix-supabase.js
```
Entrez votre clé Supabase quand demandé.

**Option B : Modifier manuellement**
1. Ouvrez `frontend/.env.local`
2. Trouvez la ligne : `NEXT_PUBLIC_SUPABASE_ANON_KEY=REMPLACEZ_PAR_VOTRE_CLE_ANON_SUPABASE`
3. Remplacez `REMPLACEZ_PAR_VOTRE_CLE_ANON_SUPABASE` par votre vraie clé
4. Sauvegardez le fichier

**Pour obtenir votre clé :**
- Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
- Settings > API
- Copiez la clé "anon public"

### Étape 2 : Redémarrer le serveur ⚠️ IMPORTANT

**C'est crucial !** Next.js ne recharge pas automatiquement les variables d'environnement.

```bash
# 1. Arrêtez le serveur (Ctrl+C dans le terminal)
# 2. Relancez-le
npm run dev
```

### Étape 3 : Vérifier les migrations SQL

1. Allez dans Supabase > SQL Editor
2. Exécutez le script `supabase/migrations/001_initial_schema.sql`
3. Vérifiez que les tables sont créées

## ✅ Vérification

Après avoir fait ces 3 étapes :

1. Ouvrez l'application : http://localhost:3000
2. Allez sur `/register`
3. Essayez de vous inscrire
4. Ouvrez la console du navigateur (F12) si ça ne marche pas

## 🐛 Si ça ne marche toujours pas

### Vérifier la configuration
```bash
node check-config.js
```

### Vérifier les erreurs
1. Ouvrez la console du navigateur (F12)
2. Regardez l'onglet "Console"
3. Notez les erreurs affichées

### Erreurs courantes

**"supabaseUrl is required"**
- Le fichier `.env.local` n'est pas lu
- Solution : Redémarrez le serveur

**"Invalid API key"**
- La clé est incorrecte
- Solution : Vérifiez la clé dans Supabase > Settings > API

**"relation does not exist"**
- Les migrations SQL ne sont pas exécutées
- Solution : Exécutez le script SQL dans Supabase

**"new row violates row-level security policy"**
- Les policies RLS bloquent l'insertion
- Solution : Vérifiez que le trigger `on_auth_user_created` existe

## 📞 Besoin d'aide ?

Consultez `TROUBLESHOOTING.md` pour plus de détails.

