# 🚀 Guide de Démarrage Rapide - Inside AI

Ce guide vous aidera à configurer et lancer l'application rapidement.

## ⚡ Démarrage en 5 minutes

### 1. Installation des dépendances

```bash
cd frontend
npm install
```

### 2. Configuration Supabase

1. **Créer un compte Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un nouveau projet
   - Notez l'URL et la clé anonyme

2. **Configurer la base de données**
   - Dans Supabase, allez dans SQL Editor
   - Copiez-collez le contenu de `supabase/migrations/001_initial_schema.sql`
   - Exécutez le script

3. **Récupérer les clés**
   - Settings > API
   - Copiez `Project URL` et `anon public` key

### 3. Configuration OpenAI

1. **Créer un compte OpenAI**
   - Allez sur [platform.openai.com](https://platform.openai.com)
   - Créez un compte et ajoutez des crédits

2. **Créer les Assistants**

   **Assistant Chat (Coach Ella)**
   - Allez dans Assistants
   - Créez un nouvel assistant
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
   - Copiez l'ID de l'assistant (commence par `asst_`)

   **Assistant Veille**
   - Créez un nouvel assistant
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
   - Copiez l'ID

   **Assistant Communauté** (optionnel pour MVP)
   - Créez un nouvel assistant
   - Nom : "Modérateur Communauté"
   - Instructions : Modération et aide dans les discussions
   - Modèle : GPT-4 Turbo
   - Copiez l'ID

3. **Générer une clé API**
   - Settings > API Keys
   - Créez une nouvelle clé secrète
   - Copiez-la (vous ne pourrez plus la voir après)

### 4. Configuration des variables d'environnement

Créez `frontend/.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_ASSISTANT_CHAT_ID=asst_...
OPENAI_ASSISTANT_VEILLE_ID=asst_...
OPENAI_ASSISTANT_COMMUNAUTE_ID=asst_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## ✅ Vérification

1. **Test d'authentification**
   - Allez sur `/register`
   - Créez un compte
   - Connectez-vous

2. **Test du Chat**
   - Allez sur `/chat`
   - Posez une question à Ella
   - Vérifiez que la réponse arrive

3. **Test de la Veille**
   - Allez sur `/veille`
   - Cliquez sur "Générer un rapport"
   - Attendez la génération

4. **Test de la Communauté**
   - Allez sur `/communaute`
   - Publiez un message
   - Vérifiez qu'il apparaît

## 🐛 Dépannage

### Erreur "Unauthorized" dans les API routes
- Vérifiez que vous êtes connecté
- Vérifiez les variables d'environnement Supabase

### Erreur OpenAI
- Vérifiez que votre clé API est valide
- Vérifiez que vous avez des crédits
- Vérifiez que les IDs des assistants sont corrects

### Erreur base de données
- Vérifiez que les migrations SQL ont été exécutées
- Vérifiez les policies RLS dans Supabase

### L'application ne démarre pas
- Vérifiez Node.js version (20+)
- Supprimez `node_modules` et `package-lock.json`
- Réinstallez : `npm install`

## 📚 Prochaines étapes

1. Personnalisez le design dans `app/globals.css`
2. Ajoutez votre logo dans `components/layout/sidebar.tsx`
3. Configurez les emails de confirmation Supabase
4. Ajoutez des fonctionnalités selon vos besoins

## 💡 Astuces

- Utilisez le mode développement de Supabase pour voir les logs
- Testez les assistants directement dans OpenAI Playground
- Activez les logs dans Next.js pour déboguer

## 🆘 Besoin d'aide ?

Consultez la documentation :
- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [OpenAI](https://platform.openai.com/docs)

