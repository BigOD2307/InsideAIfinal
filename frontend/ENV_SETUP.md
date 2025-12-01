# 🔧 Configuration des Variables d'Environnement

## ⚠️ Important

L'application nécessite un fichier `.env.local` avec vos clés API pour fonctionner.

## 📝 Étapes de configuration

### 1. Créer le fichier `.env.local`

Dans le dossier `frontend`, créez un fichier nommé `.env.local` (sans extension).

### 2. Copier le template

Copiez le contenu de `.env.local.example` dans `.env.local` :

```bash
# Windows PowerShell
Copy-Item .env.local.example .env.local

# Linux/Mac
cp .env.local.example .env.local
```

### 3. Remplir les valeurs

#### Supabase (Obligatoire)

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Créez un nouveau projet
4. Allez dans **Settings > API**
5. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### OpenAI (Obligatoire)

1. Allez sur [platform.openai.com](https://platform.openai.com)
2. Créez un compte ou connectez-vous
3. Allez dans **Settings > API Keys**
4. Créez une nouvelle clé secrète
5. Copiez la clé → `OPENAI_API_KEY`

#### Assistants OpenAI (Obligatoire)

1. Allez sur [platform.openai.com/assistants](https://platform.openai.com/assistants)
2. Créez 3 assistants :

   **Assistant Chat (Coach Ella)**
   - Nom : "Coach Ella"
   - Instructions :
   ```
   Tu es Ella, une experte en intelligence artificielle bienveillante et pédagogue. 
   Tu aides les professionnels africains à maîtriser l'IA pour leur métier.
   
   Ton rôle :
   - Expliquer les concepts IA de manière simple
   - Recommander des outils adaptés au contexte africain
   - Aider à créer des prompts efficaces
   - Guider dans l'intégration de l'IA dans les processus métier
   - Adapter tes conseils selon le niveau et le secteur de l'utilisateur
   
   Sois toujours encourageante, pratique et orientée résultats.
   ```
   - Modèle : GPT-4 Turbo
   - Copiez l'ID (commence par `asst_`) → `OPENAI_ASSISTANT_CHAT_ID`

   **Assistant Veille**
   - Nom : "Veille IA"
   - Instructions :
   ```
   Tu es un expert en veille technologique IA. Tu génères des rapports de veille 
   personnalisés pour les professionnels africains.
   
   Format de réponse :
   - Titre accrocheur
   - Résumé en 2-3 phrases
   - Contenu structuré avec sections
   - Exemples concrets et actionnables
   - Focus sur l'applicabilité en contexte africain
   ```
   - Modèle : GPT-4 Turbo
   - Copiez l'ID → `OPENAI_ASSISTANT_VEILLE_ID`

   **Assistant Communauté** (optionnel)
   - Nom : "Modérateur Communauté"
   - Instructions : Modération et aide dans les discussions
   - Modèle : GPT-4 Turbo
   - Copiez l'ID → `OPENAI_ASSISTANT_COMMUNAUTE_ID`

### 4. Vérifier le fichier

Votre `.env.local` devrait ressembler à :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
OPENAI_ASSISTANT_CHAT_ID=asst_xxxxxxxxxxxxx
OPENAI_ASSISTANT_VEILLE_ID=asst_xxxxxxxxxxxxx
OPENAI_ASSISTANT_COMMUNAUTE_ID=asst_xxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Redémarrer le serveur

Après avoir créé/modifié `.env.local`, redémarrez le serveur :

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

## ✅ Vérification

Si tout est bien configuré, l'application devrait :
- ✅ Démarrer sans erreurs
- ✅ Afficher la page de login
- ✅ Permettre l'inscription/connexion
- ✅ Fonctionner avec les API

## 🐛 Dépannage

### Erreur "supabaseUrl is required"
- Vérifiez que `.env.local` existe dans le dossier `frontend`
- Vérifiez que les variables commencent par `NEXT_PUBLIC_` pour Supabase
- Redémarrez le serveur après modification

### Erreur "Invalid API key"
- Vérifiez que votre clé OpenAI est correcte
- Vérifiez que vous avez des crédits sur votre compte OpenAI

### Les assistants ne répondent pas
- Vérifiez que les IDs des assistants sont corrects
- Vérifiez que les assistants existent dans votre compte OpenAI

## 🔒 Sécurité

⚠️ **NE COMMITEZ JAMAIS** le fichier `.env.local` dans Git !
- Il est déjà dans `.gitignore`
- Contient des clés secrètes
- Doit rester local

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation OpenAI](https://platform.openai.com/docs)
- [Guide de setup complet](./SETUP.md)

