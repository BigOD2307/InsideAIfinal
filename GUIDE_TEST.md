# 🧪 Guide de Test - Inside AI

Guide complet pour tester toutes les fonctionnalités de l'application.

## 📋 Prérequis avant de tester

### 1. Vérifier l'installation

```bash
cd frontend
npm install
```

### 2. Vérifier les variables d'environnement

Assurez-vous d'avoir un fichier `frontend/.env.local` avec :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle
OPENAI_API_KEY=votre_cle_openai
OPENAI_ASSISTANT_CHAT_ID=asst_...
OPENAI_ASSISTANT_VEILLE_ID=asst_...
OPENAI_ASSISTANT_COMMUNAUTE_ID=asst_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Vérifier la base de données Supabase

- Les migrations SQL doivent être exécutées
- Les tables doivent exister
- RLS (Row Level Security) doit être activé

## 🚀 Lancer l'application

```bash
cd frontend
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

## ✅ Checklist de test complète

### 🔐 Test 1 : Authentification

#### 1.1 Test d'inscription

1. **Accéder à la page d'inscription**
   - URL : `http://localhost:3000/register`
   - ✅ La page doit s'afficher correctement
   - ✅ Le formulaire doit être visible

2. **Remplir le formulaire**
   - Nom complet : "Test User"
   - Email : "test@example.com"
   - Mot de passe : "password123" (minimum 6 caractères)
   - ✅ Cliquer sur "S'inscrire"

3. **Vérifier le résultat**
   - ✅ Message de succès affiché
   - ✅ Redirection vers `/login`
   - ✅ Vérifier dans Supabase que l'utilisateur est créé dans `auth.users`
   - ✅ Vérifier que le profil est créé dans la table `users`

#### 1.2 Test de connexion

1. **Accéder à la page de connexion**
   - URL : `http://localhost:3000/login`
   - ✅ La page doit s'afficher

2. **Se connecter**
   - Email : "test@example.com"
   - Mot de passe : "password123"
   - ✅ Cliquer sur "Se connecter"

3. **Vérifier le résultat**
   - ✅ Message de succès
   - ✅ Redirection vers `/chat`
   - ✅ La sidebar doit être visible
   - ✅ Le nom de l'utilisateur doit apparaître dans la sidebar

#### 1.3 Test de déconnexion

1. **Cliquer sur "Déconnexion"** dans la sidebar
   - ✅ Redirection vers `/login`
   - ✅ La session doit être fermée

---

### 💬 Test 2 : Chat IA (Coach Ella)

#### 2.1 Interface du chat

1. **Accéder à la page chat**
   - URL : `http://localhost:3000/chat`
   - ✅ Le titre "Coach Ella" doit être visible
   - ✅ La description doit s'afficher
   - ✅ Les suggestions doivent être visibles (si pas de messages)

2. **Vérifier les suggestions**
   - ✅ 4 suggestions doivent être affichées
   - ✅ Cliquer sur une suggestion doit remplir le champ de texte

#### 2.2 Envoyer un message

1. **Taper un message**
   - Exemple : "Comment utiliser l'IA pour mon business ?"
   - ✅ Le champ de texte doit être fonctionnel
   - ✅ Le bouton "Envoyer" doit être activé

2. **Envoyer le message**
   - Cliquer sur "Envoyer" ou appuyer sur Entrée
   - ✅ Le message doit apparaître immédiatement (côté utilisateur)
   - ✅ Un indicateur de chargement doit apparaître (3 points animés)

3. **Vérifier la réponse**
   - ✅ La réponse de l'IA doit apparaître après quelques secondes
   - ✅ Le format doit être lisible
   - ✅ Le message doit être pertinent

#### 2.3 Test de plusieurs messages

1. **Envoyer plusieurs messages successifs**
   - Message 1 : "Quels outils IA me recommandez-vous ?"
   - Attendre la réponse
   - Message 2 : "Comment les intégrer dans mon workflow ?"
   - ✅ Chaque message doit être affiché correctement
   - ✅ Les réponses doivent être cohérentes avec la conversation

#### 2.4 Test des erreurs

1. **Tester sans connexion OpenAI**
   - Désactiver temporairement la clé API dans `.env.local`
   - Envoyer un message
   - ✅ Un message d'erreur doit s'afficher

2. **Tester avec un message vide**
   - Essayer d'envoyer un message vide
   - ✅ Le bouton doit être désactivé
   - ✅ Aucun message ne doit être envoyé

---

### 📰 Test 3 : Veille IA

#### 3.1 Interface de veille

1. **Accéder à la page veille**
   - URL : `http://localhost:3000/veille`
   - ✅ Le titre "Veille IA" doit être visible
   - ✅ Le bouton "Générer un rapport" doit être visible

2. **État initial (pas de rapports)**
   - ✅ Un message "Aucun rapport de veille" doit s'afficher
   - ✅ Un bouton "Générer mon premier rapport" doit être visible

#### 3.2 Générer un rapport

1. **Cliquer sur "Générer un rapport"**
   - ✅ Le bouton doit afficher "Génération..."
   - ✅ Le bouton doit être désactivé pendant la génération

2. **Attendre la génération**
   - ⏱️ Cela peut prendre 10-30 secondes
   - ✅ Un indicateur de chargement doit être visible

3. **Vérifier le résultat**
   - ✅ Le rapport doit apparaître dans une card
   - ✅ Le titre doit être visible
   - ✅ La date doit être affichée
   - ✅ Le contenu doit être structuré
   - ✅ Le badge "Nouveau" doit être visible

#### 3.3 Générer plusieurs rapports

1. **Générer un deuxième rapport**
   - ✅ Le nouveau rapport doit apparaître en premier
   - ✅ Les deux rapports doivent être visibles
   - ✅ Les dates doivent être différentes

#### 3.4 Vérifier dans la base de données

1. **Dans Supabase**
   - Aller dans Table Editor > `ai_veille`
   - ✅ Les rapports doivent être sauvegardés
   - ✅ Le `user_id` doit correspondre à votre utilisateur

---

### 👥 Test 4 : Communauté

#### 4.1 Interface de communauté

1. **Accéder à la page communauté**
   - URL : `http://localhost:3000/communaute`
   - ✅ Le titre "Communauté" doit être visible
   - ✅ Le formulaire de nouveau message doit être visible

2. **État initial (pas de posts)**
   - ✅ Un message "Aucun message" doit s'afficher

#### 4.2 Publier un message

1. **Remplir le formulaire**
   - Taper : "Bonjour ! Je cherche des conseils sur l'utilisation de ChatGPT pour mon entreprise."
   - ✅ Le champ de texte doit être fonctionnel

2. **Publier le message**
   - Cliquer sur "Publier"
   - ✅ Le message doit apparaître immédiatement
   - ✅ Votre nom doit être affiché
   - ✅ La date et l'heure doivent être affichées
   - ✅ Les boutons "J'aime" et "Commentaires" doivent être visibles

#### 4.3 Vérifier l'affichage

1. **Vérifier les informations du post**
   - ✅ Votre avatar doit être visible
   - ✅ Votre nom complet doit être affiché
   - ✅ Le badge avec votre job_title doit être visible (si configuré)
   - ✅ Le contenu du message doit être correct

2. **Tester les interactions**
   - Cliquer sur "J'aime"
   - ✅ Le compteur doit s'incrémenter (à implémenter)
   - Cliquer sur "Commentaires"
   - ✅ Le compteur doit être visible (à implémenter)

#### 4.4 Publier plusieurs messages

1. **Publier 2-3 messages supplémentaires**
   - ✅ Tous les messages doivent être visibles
   - ✅ Les messages doivent être triés par date (plus récent en premier)
   - ✅ Chaque message doit avoir ses propres boutons d'interaction

#### 4.5 Vérifier dans la base de données

1. **Dans Supabase**
   - Aller dans Table Editor > `community_posts`
   - ✅ Les posts doivent être sauvegardés
   - ✅ Le `user_id` doit correspondre à votre utilisateur
   - ✅ Le `content` doit être correct

---

### 💡 Test 5 : Tips Quotidiens

#### 5.1 Interface des tips

1. **Accéder à la page tips**
   - URL : `http://localhost:3000/tips`
   - ✅ Le titre "Tips IA Quotidiens" doit être visible
   - ✅ La description doit s'afficher

2. **État initial (pas de tips)**
   - ✅ Un message "Aucun tip disponible" doit s'afficher
   - ⚠️ Note : Les tips doivent être générés ou ajoutés manuellement

#### 5.2 Ajouter des tips (via Supabase)

1. **Dans Supabase SQL Editor, exécuter :**
```sql
INSERT INTO ai_tips (title, content, category, difficulty)
VALUES 
  ('Utiliser des prompts spécifiques', 'Pour obtenir de meilleurs résultats avec ChatGPT, soyez précis dans vos prompts. Au lieu de "écris un email", utilisez "écris un email professionnel de 150 mots pour annuler une réunion".', 'Productivité', 'beginner'),
  ('Automatiser les tâches répétitives', 'Identifiez les tâches que vous faites quotidiennement et voyez comment l''IA peut les automatiser. Par exemple, la génération de rapports ou la réponse aux emails courants.', 'Automatisation', 'intermediate'),
  ('Créer des templates réutilisables', 'Créez des templates de prompts pour vos besoins récurrents. Sauvegardez-les dans un document pour les réutiliser rapidement.', 'Optimisation', 'advanced');
```

2. **Recharger la page**
   - ✅ Les tips doivent apparaître en grille
   - ✅ Chaque tip doit avoir une card
   - ✅ Le badge de difficulté doit être visible
   - ✅ Les boutons "J'aime" et "Lu" doivent être visibles

#### 5.3 Tester l'affichage des tips

1. **Vérifier les informations**
   - ✅ Le titre doit être visible
   - ✅ Le contenu doit être lisible
   - ✅ La catégorie doit être affichée
   - ✅ La date doit être visible
   - ✅ Le badge de difficulté doit avoir la bonne couleur

---

### 🎨 Test 6 : Navigation et UI

#### 6.1 Test de la sidebar

1. **Vérifier les liens**
   - ✅ Tous les liens doivent être cliquables
   - ✅ Le lien actif doit être mis en surbrillance
   - ✅ Les icônes doivent être visibles

2. **Test de navigation**
   - Cliquer sur chaque lien
   - ✅ La navigation doit être fluide
   - ✅ La page doit changer correctement
   - ✅ L'URL doit correspondre

#### 6.2 Test responsive

1. **Réduire la largeur du navigateur**
   - ✅ Le layout doit s'adapter
   - ✅ Le contenu doit rester lisible
   - ⚠️ Note : Le responsive complet sera amélioré dans les prochaines versions

#### 6.3 Test des animations

1. **Vérifier les transitions**
   - ✅ Les transitions doivent être fluides
   - ✅ Les hover effects doivent fonctionner

---

### 🔍 Test 7 : Gestion des erreurs

#### 7.1 Test sans authentification

1. **Déconnecter l'utilisateur**
2. **Essayer d'accéder à `/chat`**
   - ✅ Redirection vers `/login`
   - ✅ Message d'erreur si nécessaire

#### 7.2 Test avec API invalide

1. **Modifier temporairement la clé OpenAI dans `.env.local`**
2. **Essayer d'envoyer un message**
   - ✅ Un message d'erreur doit s'afficher
   - ✅ L'application ne doit pas crasher

#### 7.3 Test avec base de données indisponible

1. **Désactiver temporairement Supabase**
2. **Essayer de se connecter**
   - ✅ Un message d'erreur doit s'afficher
   - ✅ L'application doit gérer l'erreur gracieusement

---

## 📊 Checklist finale

### Fonctionnalités Core
- [ ] Authentification (inscription/connexion/déconnexion)
- [ ] Chat IA fonctionnel avec réponses
- [ ] Génération de rapports de veille
- [ ] Publication de messages dans la communauté
- [ ] Affichage des tips (si ajoutés)

### UI/UX
- [ ] Navigation fluide
- [ ] Design cohérent
- [ ] Messages d'erreur clairs
- [ ] Loading states visibles
- [ ] Responsive de base

### Base de données
- [ ] Utilisateurs créés correctement
- [ ] Conversations sauvegardées (à vérifier)
- [ ] Rapports de veille sauvegardés
- [ ] Posts de communauté sauvegardés

### Sécurité
- [ ] Redirection si non authentifié
- [ ] RLS fonctionnel (testez avec un autre utilisateur)
- [ ] Pas d'exposition de clés API côté client

---

## 🐛 Problèmes courants et solutions

### L'application ne démarre pas

```bash
# Vérifier Node.js
node --version  # Doit être 20+

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreur "Module not found"

```bash
# Réinstaller les dépendances
npm install
```

### Erreur Supabase

- Vérifier que l'URL et la clé sont correctes
- Vérifier que les migrations sont exécutées
- Vérifier les policies RLS dans Supabase

### Erreur OpenAI

- Vérifier que la clé API est valide
- Vérifier que vous avez des crédits
- Vérifier que les IDs des assistants sont corrects
- Vérifier les logs dans la console du navigateur

### Les données ne s'affichent pas

- Vérifier dans Supabase que les données sont bien créées
- Vérifier les policies RLS
- Vérifier les logs dans la console du navigateur (F12)

---

## 📝 Rapport de test

Après avoir testé, notez :

1. **Fonctionnalités qui fonctionnent** ✅
2. **Fonctionnalités qui ne fonctionnent pas** ❌
3. **Bugs rencontrés** 🐛
4. **Améliorations suggérées** 💡

---

## 🎯 Tests avancés (optionnel)

### Test de performance

1. **Ouvrir les DevTools (F12)**
2. **Onglet Network**
3. **Recharger la page**
4. **Vérifier les temps de chargement**
   - ✅ Les ressources doivent charger rapidement
   - ✅ Les images doivent être optimisées

### Test d'accessibilité

1. **Navigation au clavier**
   - ✅ Tab pour naviguer
   - ✅ Entrée pour activer
   - ✅ Échap pour fermer

2. **Lecteurs d'écran**
   - ✅ Les labels doivent être présents
   - ✅ Les ARIA attributes doivent être corrects

---

**Bon test ! 🚀**

