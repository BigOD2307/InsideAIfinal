# 🚨 Configuration Supabase - Action Immédiate Requise

## ⚠️ Problème détecté

Votre fichier `.env.local` contient encore le placeholder `REMPLACEZ_PAR_VOTRE_CLE_ANON_SUPABASE` au lieu de votre vraie clé Supabase.

## ✅ Solution en 3 étapes (5 minutes)

### Étape 1 : Obtenir votre clé Supabase

1. **Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)**
2. **Connectez-vous** avec votre compte
3. **Sélectionnez votre projet** : `eefbnycxaheylwycqhez`
4. **Cliquez sur Settings** (⚙️) dans le menu de gauche
5. **Cliquez sur API** dans le menu Settings
6. **Trouvez la section "Project API keys"**
7. **Copiez la clé "anon public"** (elle commence par `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Étape 2 : Mettre à jour le fichier .env.local

**Option A : Utiliser le script automatique**
```bash
cd frontend
node fix-supabase.js
```
Entrez votre clé quand demandé.

**Option B : Modification manuelle**
1. Ouvrez le fichier `frontend/.env.local` dans votre éditeur
2. Trouvez cette ligne :
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=REMPLACEZ_PAR_VOTRE_CLE_ANON_SUPABASE
   ```
3. Remplacez `REMPLACEZ_PAR_VOTRE_CLE_ANON_SUPABASE` par votre vraie clé (celle que vous avez copiée)
4. Sauvegardez le fichier

**Exemple de ce que ça devrait ressembler :**
```env
NEXT_PUBLIC_SUPABASE_URL=https://eefbnycxaheylwycqhez.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlZmJueWN4YWhleWx3eWNxaGV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MT... (votre vraie clé complète)
```

### Étape 3 : Redémarrer le serveur ⚠️ IMPORTANT

**C'est crucial !** Next.js ne recharge pas automatiquement les variables d'environnement.

```bash
# 1. Arrêtez le serveur (Ctrl+C dans le terminal où npm run dev tourne)
# 2. Relancez-le
cd frontend
npm run dev
```

## ✅ Vérification

Après avoir fait ces 3 étapes, l'erreur devrait disparaître. Pour vérifier :

1. Ouvrez la console du navigateur (F12)
2. L'erreur "Configuration Supabase manquante" ne devrait plus apparaître
3. Essayez de vous inscrire - ça devrait fonctionner

## 🐛 Si ça ne marche toujours pas

### Vérifier que la clé est correcte
```bash
cd frontend
node check-config.js
```

### Vérifier le format du fichier .env.local
- Le fichier doit être dans `frontend/.env.local` (pas `frontend/frontend/.env.local`)
- Pas d'espaces autour du `=`
- Pas de guillemets autour de la valeur
- Pas de ligne vide avant ou après

### Exemple correct :
```env
NEXT_PUBLIC_SUPABASE_URL=https://eefbnycxaheylwycqhez.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Exemple incorrect :
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJ..."  ❌ (espaces et guillemets)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...     ✅ (correct)
```

## 📞 Besoin d'aide ?

Si vous avez toujours des problèmes après ces étapes :
1. Vérifiez que vous avez bien redémarré le serveur
2. Vérifiez que la clé dans Supabase est bien la "anon public" (pas la service_role)
3. Consultez `TROUBLESHOOTING.md` pour plus d'aide

