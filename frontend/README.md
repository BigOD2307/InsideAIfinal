# Inside AI - Frontend

Plateforme web complète pour maîtriser l'IA : formation, veille technologique et communauté.

## 🚀 Technologies

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (composants UI modernes)
- **Supabase** (authentification & base de données)
- **OpenAI** (Assistants API)

## 📦 Installation

1. **Cloner le projet et installer les dépendances :**

```bash
cd frontend
npm install
```

2. **Configurer les variables d'environnement :**

Créez un fichier `.env.local` à la racine du dossier `frontend` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_ASSISTANT_CHAT_ID=asst_d0dP7bYg4s6AqmUWopE4UQba
OPENAI_ASSISTANT_VEILLE_ID=your_veille_assistant_id
OPENAI_ASSISTANT_COMMUNAUTE_ID=your_communaute_assistant_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Lancer le serveur de développement :**

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🗄️ Structure de la base de données (Supabase)

### Tables nécessaires :

#### `users` (étend la table auth.users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  job_title TEXT,
  industry TEXT,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `conversations`
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT,
  assistant_id TEXT,
  thread_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `messages`
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `ai_veille`
```sql
CREATE TABLE ai_veille (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT,
  content TEXT,
  summary TEXT,
  sources TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `community_posts`
```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  content TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `ai_tips`
```sql
CREATE TABLE ai_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT,
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 Fonctionnalités

### ✅ Implémenté

- [x] Authentification (Login/Register)
- [x] Layout principal avec sidebar
- [x] Page Chat IA (Coach Ella)
- [x] Page Veille IA
- [x] Page Communauté
- [x] Page Tips
- [x] Design system avec shadcn/ui
- [x] API routes pour chat, veille, communauté

### 🚧 À compléter

- [ ] Intégration complète OpenAI Assistants
- [ ] Gestion des threads de conversation
- [ ] Historique des conversations
- [ ] Streaming des réponses
- [ ] Voice input (Speech-to-Text)
- [ ] Système de likes/commentaires communauté
- [ ] Génération automatique de tips
- [ ] Profil utilisateur complet
- [ ] Mode sombre/clair

## 📁 Structure du projet

```
frontend/
├── app/
│   ├── (auth)/          # Pages d'authentification
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/     # Pages protégées
│   │   ├── chat/        # Coach Ella
│   │   ├── veille/      # Veille IA
│   │   ├── communaute/  # Communauté
│   │   └── tips/        # Tips quotidiens
│   ├── api/             # API Routes
│   │   ├── chat/
│   │   ├── veille/
│   │   └── communaute/
│   ├── layout.tsx       # Layout racine
│   └── page.tsx         # Page d'accueil
├── components/
│   ├── ui/              # Composants shadcn/ui
│   └── layout/          # Composants layout
├── lib/
│   ├── supabase/        # Clients Supabase
│   ├── openai/          # Client OpenAI
│   └── utils.ts         # Utilitaires
└── types/
    └── index.ts         # Types TypeScript
```

## 🔧 Configuration OpenAI

1. Créez un compte sur [OpenAI](https://platform.openai.com)
2. Générez une clé API
3. Créez des Assistants pour chaque fonctionnalité :
   - **Chat** : Assistant avec instructions pour Coach Ella
   - **Veille** : Assistant pour générer des rapports de veille
   - **Communauté** : Assistant pour modération/aide

## 🚀 Déploiement

### Vercel (recommandé)

1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez !

### Autres plateformes

L'application peut être déployée sur n'importe quelle plateforme supportant Next.js.

## 📝 Notes

- Les API routes nécessitent une configuration Supabase et OpenAI
- Assurez-vous d'avoir configuré les assistants OpenAI avec les bons IDs
- Activez Row Level Security (RLS) sur Supabase pour la sécurité

## 🤝 Contribution

Ce projet est en développement actif. N'hésitez pas à contribuer !

## 📄 Licence

Propriétaire - Inside AI
