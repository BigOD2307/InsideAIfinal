# ⚡ Fix Rapide - Erreur Supabase

## Le problème
```
❌ Configuration Supabase manquante ou incorrecte!
```

## La solution (2 minutes)

1. **Ouvrez** `frontend/.env.local`

2. **Trouvez** cette ligne :
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=REMPLACEZ_PAR_VOTRE_CLE_ANON_SUPABASE
   ```

3. **Remplacer** `REMPLACEZ_PAR_VOTRE_CLE_ANON_SUPABASE` par votre vraie clé

4. **Obtenir la clé** :
   - https://supabase.com/dashboard
   - Votre projet → Settings → API
   - Copiez "anon public" key

5. **Redémarrer** le serveur :
   ```bash
   # Ctrl+C pour arrêter
   npm run dev
   ```

**C'est tout !** L'erreur devrait disparaître.

