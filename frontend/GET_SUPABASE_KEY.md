# 🔑 Comment obtenir votre clé Supabase Anon Key

## Étapes rapides

1. **Connectez-vous à Supabase**
   - Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Connectez-vous avec votre compte

2. **Sélectionnez votre projet**
   - Projet : `eefbnycxaheylwycqhez`
   - URL : `https://eefbnycxaheylwycqhez.supabase.co`

3. **Accédez aux paramètres API**
   - Dans le menu de gauche, cliquez sur **Settings** (⚙️)
   - Puis cliquez sur **API**

4. **Copiez la clé "anon public"**
   - Vous verrez une section "Project API keys"
   - Copiez la clé qui commence par `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - C'est la clé **anon public** (pas la service_role)

5. **Mettez à jour .env.local**
   - Ouvrez le fichier `frontend/.env.local`
   - Remplacez `REMPLACEZ_PAR_VOTRE_CLE_ANON_SUPABASE` par la clé que vous venez de copier
   - Sauvegardez le fichier

## Exemple

Votre `.env.local` devrait ressembler à :

```env
NEXT_PUBLIC_SUPABASE_URL=https://eefbnycxaheylwycqhez.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlZmJueWN4YWhleWx3eWNxaGV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MT... (votre vraie clé)
```

## ⚠️ Important

- Ne partagez JAMAIS cette clé publiquement
- Ne la commitez PAS dans Git (elle est déjà dans .gitignore)
- Cette clé est publique mais limitée par les Row Level Security (RLS)

## ✅ Vérification

Après avoir mis à jour `.env.local`, redémarrez le serveur :

```bash
npm run dev
```

L'application devrait maintenant fonctionner correctement !

