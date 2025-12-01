# 🚀 Inside AI - Plateforme Complète d'IA pour les Professionnels Africains

Plateforme web révolutionnaire qui démocratise l'usage de l'Intelligence Artificielle en combinant formation active, veille technologique, micro-learning et communauté.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Structure du projet](#-structure-du-projet)
- [Base de données](#-base-de-données)
- [Déploiement](#-déploiement)

## ✨ Fonctionnalités

### 🎯 MVP (Version 1.0)

1. **Coach Ella - Chat IA**
   - Assistant IA personnalisé pour vous guider dans l'utilisation de l'IA
   - Suggestions contextuelles
   - Historique des conversations
   - Interface moderne et intuitive

2. **Veille IA Automatisée**
   - Rapports personnalisés selon votre métier et industrie
   - Génération à la demande
   - Contenu actionnable et adapté

3. **Communauté**
   - Chat de groupe pour échanger sur l'IA
   - Partage d'expériences
   - Système de likes et commentaires

4. **Tips Quotidiens**
   - Astuces courtes et actionnables
   - Personnalisées selon votre niveau
   - Micro-learning quotidien

## 🛠 Technologies

### Frontend
- **Next.js 16** (App Router) - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI modernes
- **Framer Motion** - Animations
- **React Hook Form** - Gestion de formulaires

### Backend & Services
- **Supabase** - Base de données PostgreSQL + Auth
- **OpenAI Assistants API** - Intelligence Artificielle
- **Next.js API Routes** - Backend API

## 📦 Installation

### Prérequis

- Node.js 20+
- npm ou yarn
- Compte Supabase
- Compte OpenAI avec clé API

### Étapes

1. **Cloner le projet**

```bash
git clone <repository-url>
cd InsideAI
```

2. **Installer les dépendances**

```bash
cd frontend
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env.local` dans le dossier `frontend` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_ASSISTANT_CHAT_ID=asst_...
OPENAI_ASSISTANT_VEILLE_ID=asst_...
OPENAI_ASSISTANT_COMMUNAUTE_ID=asst_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Configurer la base de données**

- Créez un projet sur [Supabase](https://supabase.com)
- Exécutez le script SQL dans `supabase/migrations/001_initial_schema.sql`
- Ou utilisez l'éditeur SQL de Supabase

5. **Lancer le serveur de développement**

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

### Supabase

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez l'URL et la clé anonyme dans Settings > API
4. Exécutez les migrations SQL

### OpenAI

1. Créez un compte sur [platform.openai.com](https://platform.openai.com)
2. Générez une clé API dans Settings > API Keys
3. Créez 3 Assistants :
   - **Coach Ella (Chat)** : Assistant avec instructions pour guider les utilisateurs
   - **Veille** : Assistant pour générer des rapports de veille
   - **Communauté** : Assistant pour modération et aide

#### Instructions pour Coach Ella

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

## 📁 Structure du projet

```
InsideAI/
├── frontend/                 # Application Next.js
│   ├── app/
│   │   ├── (auth)/          # Pages d'authentification
│   │   ├── (dashboard)/     # Pages protégées
│   │   │   ├── chat/        # Coach Ella
│   │   │   ├── veille/      # Veille IA
│   │   │   ├── communaute/  # Communauté
│   │   │   └── tips/        # Tips quotidiens
│   │   └── api/             # API Routes
│   ├── components/
│   │   ├── ui/              # Composants shadcn/ui
│   │   └── layout/          # Composants layout
│   ├── lib/
│   │   ├── supabase/        # Clients Supabase
│   │   └── openai/          # Client OpenAI
│   └── types/               # Types TypeScript
├── supabase/
│   └── migrations/         # Migrations SQL
└── README.md
```

## 🗄️ Base de données

Le schéma de base de données est défini dans `supabase/migrations/001_initial_schema.sql`.

### Tables principales

- `users` - Profils utilisateurs
- `conversations` - Conversations avec les assistants
- `messages` - Messages des conversations
- `ai_veille` - Rapports de veille
- `community_posts` - Posts de la communauté
- `ai_tips` - Tips quotidiens

### Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Policies pour garantir que les utilisateurs ne voient que leurs données
- Exception : `community_posts` et `ai_tips` sont publics en lecture

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement à chaque push

### Autres plateformes

L'application peut être déployée sur :
- Netlify
- Railway
- Render
- Tout hébergeur supportant Next.js

## 📝 Roadmap

### Phase 1 (MVP) - ✅ En cours
- [x] Authentification
- [x] Chat IA (Coach Ella)
- [x] Veille IA
- [x] Communauté
- [x] Tips quotidiens
- [ ] Streaming des réponses
- [ ] Voice input

### Phase 2
- [ ] Application mobile
- [ ] Notifications push
- [ ] Export des rapports
- [ ] API publique
- [ ] Marketplace de templates

### Phase 3
- [ ] Multilingue (wolof, swahili, etc.)
- [ ] IA locale (modèles entraînés)
- [ ] Solutions sectorielles
- [ ] Certifications

## 🤝 Contribution

Ce projet est en développement actif. Les contributions sont les bienvenues !

## 📄 Licence

Propriétaire - Inside AI © 2024

## 📧 Contact

Pour toute question ou suggestion, contactez-nous.

---

**Fait avec ❤️ pour les professionnels africains**

