# 🔐 Guide d'Implémentation - Système d'Authentification Tourbe

## 📋 Vue d'ensemble

Ce guide vous accompagne pour configurer et utiliser le système d'authentification complet de l'application Tourbe.

---

## ✅ Ce qui a été implémenté

### 🏗️ Infrastructure Backend
- ✅ Client Supabase configuré
- ✅ Types TypeScript générés pour la base de données
- ✅ Store Zustand avec persistence
- ✅ Hooks personnalisés pour l'auth, profil, quiz history et analytics

### 🔐 Authentification
- ✅ Inscription/connexion par email/password
- ✅ Connexion via Google OAuth
- ✅ Gestion sécurisée des sessions (JWT)
- ✅ Protection des routes (ProtectedRoute)
- ✅ Validation avec Zod

### 👥 Système de Rôles
- ✅ Rôle **user** (utilisateur standard)
- ✅ Rôle **admin** (administrateur avec dashboard)
- ✅ Row Level Security (RLS) dans Supabase

### 📄 Pages Créées
- ✅ **Page Profil** (`/profile`) : Informations personnelles + historique quiz
- ✅ **Dashboard Admin** (`/admin`) : Analytics et statistiques complètes
- ✅ **Modals d'auth** : Login/Signup intégrés

### 🎨 Composants
- ✅ Navigation avec dropdown utilisateur
- ✅ Formulaires de connexion/inscription
- ✅ Bouton Google OAuth
- ✅ Historique des quiz
- ✅ Statistiques du dashboard admin
- ✅ Graphiques (recharts) pour l'évolution temporelle

---

## 🚀 Installation et Configuration

### Étape 1 : Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte (gratuit)
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Name** : Tourbe (ou autre)
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : Choisissez la plus proche (Europe West par exemple)
5. Attendez que le projet soit créé (~2 minutes)

### Étape 2 : Récupérer les credentials

1. Dans votre projet Supabase, allez dans **Settings** > **API**
2. Notez ces informations :
   - **Project URL** : `https://xxx.supabase.co`
   - **anon/public key** : `eyJh...` (longue chaîne)

### Étape 3 : Créer le fichier .env

À la racine du projet, créez un fichier `.env` :

```env
VITE_SUPABASE_URL=https://votre-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key-ici
```

**Important** : Ne commitez JAMAIS ce fichier ! Il est déjà dans `.gitignore`.

### Étape 4 : Exécuter la migration SQL

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur **New query**
3. Copiez-collez tout le contenu du fichier `supabase_migration.sql`
4. Cliquez sur **Run** (ou F5)
5. Vérifiez qu'il n'y a pas d'erreurs

Cela va créer :
- Les 3 tables (`profiles`, `quiz_results`, `analytics_events`)
- Les triggers automatiques
- Les policies RLS
- Les index pour les performances

### Étape 5 : Configurer Google OAuth (optionnel)

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez un nouveau projet ou sélectionnez-en un existant
3. Activez l'API **Google+ API**
4. Allez dans **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Configurez :
   - **Application type** : Web application
   - **Authorized redirect URIs** : `https://votre-project-id.supabase.co/auth/v1/callback`
6. Récupérez le **Client ID**
7. Dans Supabase, allez dans **Authentication** > **Providers** > **Google**
8. Activez Google et collez le **Client ID** et **Client Secret**

### Étape 6 : Promouvoir votre compte en admin

Une fois que vous avez créé votre compte utilisateur dans l'app :

1. Allez dans Supabase **SQL Editor**
2. Exécutez :

```sql
SELECT promote_to_admin('votre-email@example.com');
```

3. Votre compte est maintenant admin ! Vous pouvez accéder au dashboard `/admin`

### Étape 7 : Tester l'application

```bash
pnpm dev
```

Testez :
1. ✅ S'inscrire avec email/password
2. ✅ Se connecter
3. ✅ Voir son profil (`/profile`)
4. ✅ Passer un quiz et sauvegarder les résultats
5. ✅ Accéder au dashboard admin (`/admin`) si vous êtes admin

---

## 📂 Structure des Fichiers Créés

```
src/
├── lib/
│   ├── supabase.ts              # Client Supabase
│   ├── auth.ts                  # Fonctions d'authentification
│   └── database.types.ts        # Types TypeScript générés
├── store/
│   └── useAuthStore.ts          # Store Zustand pour l'auth
├── hooks/
│   ├── useAuth.ts               # Hook pour l'authentification
│   ├── useProfile.ts            # Hook pour le profil
│   ├── useQuizHistory.ts        # Hook pour l'historique des quiz
│   └── useAdminAnalytics.ts     # Hook pour les analytics admin
├── components/
│   ├── Auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── GoogleAuthButton.tsx
│   │   ├── AuthModal.tsx
│   │   └── ProtectedRoute.tsx
│   ├── Profile/
│   │   ├── ProfileHeader.tsx
│   │   ├── ProfileEdit.tsx
│   │   └── QuizHistory.tsx
│   └── Admin/
│       ├── DashboardStats.tsx
│       ├── QuizAnalytics.tsx
│       ├── TopRecommendations.tsx
│       └── TimeSeriesChart.tsx
├── pages/
│   ├── Profile.tsx              # Page profil utilisateur
│   ├── AdminDashboard.tsx       # Dashboard admin
│   └── Results.tsx              # Modifié pour sauvegarder
└── App.tsx                      # Modifié pour initialiser l'auth
```

---

## 🎯 Fonctionnalités Disponibles

### Pour les utilisateurs normaux

#### Page Profil (`/profile`)
- Voir et modifier ses informations personnelles
- Consulter l'historique complet de ses quiz
- Voir les détails des recommandations passées
- Se déconnecter
- Supprimer son compte

#### Page Résultats (`/results`)
- Sauvegarder ses résultats de quiz
- Incitation à créer un compte si non connecté

#### Navigation
- Dropdown avec avatar en haut à droite
- Accès rapide au profil
- Déconnexion en un clic

### Pour les administrateurs

#### Dashboard Admin (`/admin`)

**Vue d'ensemble**
- Nombre total d'utilisateurs
- Nouveaux utilisateurs (aujourd'hui/semaine/mois)
- Total de quiz complétés
- Taux de complétion moyen
- Temps moyen de complétion

**Analytics Quiz**
- Répartition par niveau (Débutant/Intermédiaire/Connaisseur)
- Graphique en camembert interactif

**Top Recommandations**
- Top 10 whiskies les plus recommandés
- Pourcentage et nombre de recommandations
- Barre de progression visuelle

**Évolution temporelle**
- Graphique des 30 derniers jours
- Courbe des nouveaux utilisateurs
- Courbe des quiz complétés

---

## 🔒 Sécurité

### Row Level Security (RLS)

Toutes les tables sont protégées par RLS :

**Profiles**
- Les utilisateurs ne peuvent voir/modifier que leur propre profil
- Les admins peuvent voir tous les profils

**Quiz Results**
- Les utilisateurs ne voient que leurs propres résultats
- Les admins voient tous les résultats

**Analytics Events**
- Seuls les admins peuvent lire les analytics
- Tous peuvent créer des événements

### Authentification
- Mots de passe hashés avec bcrypt (via Supabase)
- Tokens JWT avec expiration automatique
- Refresh automatique des tokens
- Sessions sécurisées
- HTTPS obligatoire (via Supabase)

### Validation
- Validation des formulaires avec Zod
- Messages d'erreur clairs en français
- Protection contre les injections SQL (via Supabase)

---

## 🐛 Dépannage

### Erreur "Missing Supabase environment variables"

**Problème** : Le fichier `.env` n'est pas lu ou mal configuré

**Solution** :
1. Vérifiez que le fichier `.env` est à la racine du projet
2. Vérifiez que les variables commencent par `VITE_`
3. Redémarrez le serveur de développement (`pnpm dev`)

### Erreur "Failed to load whiskies data"

**Problème** : Problème avec la validation des données de whiskies

**Solution** : Vérifiez que `src/data/whiskies.json` est correctement formaté

### Impossible de se connecter après inscription

**Problème** : L'email de confirmation n'a pas été cliqué

**Solution** :
1. Allez dans Supabase **Authentication** > **Providers** > **Email**
2. Désactivez "Confirm email" pour le développement
3. Ou cliquez sur le lien dans l'email de confirmation

### Le dashboard admin ne s'affiche pas

**Problème** : Votre compte n'est pas admin

**Solution** :
1. Exécutez la fonction SQL : `SELECT promote_to_admin('votre-email@example.com');`
2. Déconnectez-vous et reconnectez-vous

### Les graphiques ne s'affichent pas

**Problème** : Recharts n'est pas correctement installé

**Solution** :
```bash
pnpm install recharts
```

---

## 📊 Base de Données

### Table: profiles

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | ID utilisateur (FK vers auth.users) |
| email | TEXT | Email de l'utilisateur |
| full_name | TEXT | Nom complet |
| role | TEXT | 'user' ou 'admin' |
| avatar_url | TEXT | URL de l'avatar (optionnel) |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

### Table: quiz_results

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | ID du résultat |
| user_id | UUID | ID de l'utilisateur |
| quiz_data | JSONB | Réponses du quiz |
| recommendations | JSONB | Top 3 whiskies recommandés |
| user_level | TEXT | 'BEGINNER', 'INTERMEDIATE', 'CONNOISSEUR' |
| completion_time | INTEGER | Temps en secondes |
| created_at | TIMESTAMP | Date de complétion |

### Table: analytics_events

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | ID de l'événement |
| user_id | UUID | ID de l'utilisateur (nullable) |
| event_type | TEXT | Type d'événement |
| event_data | JSONB | Données associées |
| created_at | TIMESTAMP | Date de l'événement |

---

## 🎨 Personnalisation

### Modifier les couleurs

Les couleurs suivent la charte graphique existante :
- Or : `gold-400` (#d4af37)
- Crème : `cream-100/300/400`
- Sombre : `dark-700/800/900`

### Ajouter des métriques au dashboard

Éditez `src/hooks/useAdminAnalytics.ts` pour ajouter de nouvelles métriques.

### Modifier les rôles

Actuellement : `user` et `admin`. Pour ajouter d'autres rôles :
1. Modifiez le CHECK constraint dans `supabase_migration.sql`
2. Mettez à jour `database.types.ts`
3. Ajoutez les policies RLS correspondantes

---

## 🚢 Déploiement

### Variables d'environnement en production

Ajoutez les variables suivantes sur votre plateforme de déploiement (Vercel, Netlify, etc.) :

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key
```

### Vérifications avant déploiement

- ✅ Les tables Supabase sont créées
- ✅ Les policies RLS sont activées
- ✅ Google OAuth est configuré (si utilisé)
- ✅ Un compte admin existe
- ✅ Les variables d'environnement sont définies
- ✅ Le build passe sans erreurs (`pnpm build`)

---

## 📝 Tests

### Tests manuels recommandés

1. **Inscription**
   - Email/password
   - Google OAuth
   - Validation des champs

2. **Connexion**
   - Email/password correct
   - Email/password incorrect
   - Google OAuth

3. **Profil**
   - Voir les informations
   - Modifier le nom
   - Voir l'historique

4. **Quiz**
   - Compléter un quiz
   - Sauvegarder les résultats
   - Vérifier dans l'historique

5. **Admin**
   - Accéder au dashboard
   - Vérifier les statistiques
   - Tester les graphiques

6. **Sécurité**
   - Accéder à `/admin` sans être admin (doit rediriger)
   - Accéder à `/profile` sans être connecté (doit rediriger)

---

## 🆘 Support

### Ressources
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Recharts](https://recharts.org/)
- [Documentation React Hook Form](https://react-hook-form.com/)
- [Documentation Zod](https://zod.dev/)

### Problèmes connus
- Les graphiques peuvent être lents avec beaucoup de données (>10k entries)
- L'email de confirmation peut prendre quelques minutes

---

## ✨ Prochaines améliorations possibles

- [ ] Récupération de mot de passe
- [ ] Modification de l'email
- [ ] Modification du mot de passe
- [ ] Upload d'avatar
- [ ] Pagination de l'historique des quiz
- [ ] Export des données utilisateur (RGPD)
- [ ] Mode sombre
- [ ] Notifications push
- [ ] Analytics en temps réel (WebSocket)
- [ ] Comparaison des résultats entre utilisateurs

---

**🎉 Félicitations ! Votre système d'authentification est prêt à l'emploi !**
