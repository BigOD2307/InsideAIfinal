# ⚡ Test Rapide - Inside AI

Guide de test rapide en 5 minutes.

## 🚀 Démarrage rapide

### 1. Lancer l'application

```bash
cd frontend
npm run dev
```

Ouvrez : **http://localhost:3000**

### 2. Vérifier la configuration

Assurez-vous d'avoir `frontend/.env.local` avec vos clés Supabase et OpenAI.

## ✅ Tests essentiels (5 minutes)

### Test 1 : Authentification (1 min)

1. Aller sur `/register`
2. Créer un compte :
   - Email : `test@example.com`
   - Mot de passe : `password123`
3. Se connecter sur `/login`
4. ✅ Vérifier : Redirection vers `/chat`

### Test 2 : Chat IA (2 min)

1. Aller sur `/chat`
2. Cliquer sur une suggestion ou taper : "Comment utiliser l'IA ?"
3. Envoyer le message
4. ✅ Vérifier : Réponse de l'IA après quelques secondes

### Test 3 : Veille IA (1 min)

1. Aller sur `/veille`
2. Cliquer sur "Générer un rapport"
3. Attendre 10-30 secondes
4. ✅ Vérifier : Rapport affiché avec titre et contenu

### Test 4 : Communauté (1 min)

1. Aller sur `/communaute`
2. Taper un message : "Bonjour la communauté !"
3. Cliquer sur "Publier"
4. ✅ Vérifier : Message affiché avec votre nom

## 🐛 Si ça ne marche pas

### Erreur au démarrage
```bash
npm install
npm run dev
```

### Erreur "Unauthorized"
- Vérifiez `.env.local` avec vos clés Supabase

### Erreur OpenAI
- Vérifiez votre clé API OpenAI
- Vérifiez que vous avez des crédits

### Pas de données
- Vérifiez que les migrations SQL sont exécutées dans Supabase
- Vérifiez les tables dans Supabase Table Editor

## 📋 Checklist rapide

- [ ] Application démarre (`npm run dev`)
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Chat répond
- [ ] Veille génère un rapport
- [ ] Communauté publie un message

**Tout fonctionne ? 🎉 Vous êtes prêt !**

Pour des tests plus détaillés, consultez `GUIDE_TEST.md`

