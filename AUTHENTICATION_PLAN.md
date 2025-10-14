# 🔐 Plan d'Implémentation - Système d'Authentification

## 📋 Vue d'ensemble

Intégration complète d'un système d'authentification avec gestion des utilisateurs, rôles, et analytics pour l'application Tourbe.

---

## 🏗️ Architecture Technique

### Backend choisi : **Supabase**

**Justification :**
- ✅ Authentification intégrée (email/password + OAuth)
- ✅ Base de données PostgreSQL
- ✅ Row Level Security (RLS) natif
- ✅ Real-time subscriptions
- ✅ API REST et GraphQL
- ✅ Gratuit jusqu'à 50k utilisateurs
- ✅ Excellent support TypeScript
- ✅ Hébergement et sécurité gérés

**Alternative considérée :** Firebase (écarté car moins flexible pour les requêtes complexes)

---

## 📊 Schéma de Base de Données

### Table `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table `quiz_results`
```sql
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_data JSONB NOT NULL, -- Stocke les réponses du quiz
  recommendations JSONB NOT NULL, -- Les 3 whiskies recommandés
  user_level TEXT CHECK (user_level IN ('BEGINNER', 'INTERMEDIATE', 'CONNOISSEUR')),
  completion_time INTEGER, -- Temps en secondes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_created_at ON quiz_results(created_at);
```

### Table `analytics_events`
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'quiz_started', 'quiz_completed', 'page_view', etc.
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
```

### Row Level Security (RLS)

```sql
-- Profiles : users can read their own profile, admins can read all
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Quiz Results : users can see their own results
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz results"
  ON quiz_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz results"
  ON quiz_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Analytics : admins only
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all analytics"
  ON analytics_events FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
```

---

## 🗂️ Structure des Fichiers

```
src/
├── lib/
│   ├── supabase.ts              # Client Supabase
│   ├── auth.ts                  # Fonctions d'authentification
│   ├── database.types.ts        # Types générés depuis Supabase
│   └── analytics.ts             # Fonctions d'analytics (existant, à étendre)
├── store/
│   ├── useAuthStore.ts          # Store Zustand pour l'auth
│   └── useQuizStore.ts          # Existant, à modifier pour sauvegarder en DB
├── hooks/
│   ├── useAuth.ts               # Hook custom pour l'authentification
│   ├── useProfile.ts            # Hook pour le profil utilisateur
│   └── useQuizHistory.ts        # Hook pour l'historique des quiz
├── components/
│   ├── Auth/
│   │   ├── LoginForm.tsx        # Formulaire de connexion
│   │   ├── SignupForm.tsx       # Formulaire d'inscription
│   │   ├── GoogleAuthButton.tsx # Bouton Google OAuth
│   │   ├── AuthModal.tsx        # Modal d'authentification
│   │   └── ProtectedRoute.tsx   # HOC pour routes protégées
│   ├── Profile/
│   │   ├── ProfileHeader.tsx    # En-tête du profil
│   │   ├── ProfileEdit.tsx      # Édition du profil
│   │   └── QuizHistory.tsx      # Historique des quiz
│   └── Admin/
│       ├── DashboardStats.tsx   # Statistiques principales
│       ├── UsersList.tsx        # Liste des utilisateurs
│       ├── QuizAnalytics.tsx    # Analytics des quiz
│       └── TopRecommendations.tsx # Top whiskies recommandés
├── pages/
│   ├── Login.tsx                # Page de connexion
│   ├── Signup.tsx               # Page d'inscription
│   ├── Profile.tsx              # Page profil utilisateur
│   └── AdminDashboard.tsx       # Dashboard admin
└── middleware/
    └── requireAuth.ts           # Middleware pour vérifier l'auth
```

---

## 🔐 Flux d'Authentification

### Inscription (Email/Password)

1. Utilisateur remplit le formulaire (email, password, nom)
2. Validation côté client (Zod)
3. Appel Supabase `auth.signUp()`
4. Supabase envoie email de confirmation
5. Création automatique du profil via trigger DB
6. Redirection vers page d'attente de confirmation

### Connexion (Email/Password)

1. Utilisateur entre email + password
2. Appel Supabase `auth.signInWithPassword()`
3. Récupération du profil utilisateur
4. Stockage de la session dans le store Zustand
5. Redirection vers page d'accueil ou dernière page visitée

### Authentification Google OAuth

1. Click sur "Se connecter avec Google"
2. Appel Supabase `auth.signInWithOAuth({ provider: 'google' })`
3. Redirection vers Google
4. Callback avec token
5. Création auto du profil si première connexion
6. Redirection vers l'application

### Gestion de Session

- Token JWT stocké dans `localStorage` par Supabase
- Refresh automatique du token
- Vérification de session au chargement de l'app
- Déconnexion : appel `auth.signOut()` + clear du store

---

## 👥 Système de Rôles

### Rôles disponibles

- **user** : Utilisateur normal (défaut)
- **admin** : Administrateur

### Permissions

| Action | User | Admin |
|--------|------|-------|
| Voir son profil | ✅ | ✅ |
| Modifier son profil | ✅ | ✅ |
| Voir son historique quiz | ✅ | ✅ |
| Passer des quiz | ✅ | ✅ |
| Voir dashboard analytics | ❌ | ✅ |
| Voir tous les utilisateurs | ❌ | ✅ |
| Modifier rôles | ❌ | ✅ |

### Implémentation

```typescript
// Hook useAuth
export function useAuth() {
  const { user, profile } = useAuthStore();

  const isAdmin = profile?.role === 'admin';
  const isAuthenticated = !!user;

  return { user, profile, isAdmin, isAuthenticated };
}

// Component ProtectedRoute
<ProtectedRoute requireAdmin>
  <AdminDashboard />
</ProtectedRoute>
```

---

## 📊 Dashboard Administrateur

### Métriques affichées

1. **Vue d'ensemble**
   - Nombre total d'utilisateurs
   - Nouveaux utilisateurs (aujourd'hui/semaine/mois)
   - Total de quiz complétés
   - Taux de complétion moyen

2. **Analytics Quiz**
   - Quiz lancés vs complétés (graphique)
   - Temps moyen de complétion
   - Répartition par niveau (Beginner/Intermediate/Connoisseur)
   - Questions les plus abandonnées

3. **Top Recommandations**
   - Top 10 whiskies les plus recommandés
   - Répartition par région
   - Répartition par gamme de prix

4. **Évolution temporelle**
   - Graphique des inscriptions (7/30 jours)
   - Graphique des quiz complétés (7/30 jours)
   - Heures de pic d'activité

### Composants React

```typescript
// DashboardStats.tsx
interface Stats {
  totalUsers: number;
  newUsersToday: number;
  totalQuizzes: number;
  avgCompletionTime: number;
}

// QuizAnalytics.tsx
interface QuizMetrics {
  completionRate: number;
  avgTimeSeconds: number;
  levelDistribution: Record<UserLevel, number>;
}

// TopRecommendations.tsx
interface WhiskyRecommendation {
  whiskyId: string;
  whiskyName: string;
  count: number;
  percentage: number;
}
```

---

## 👤 Page Profil Utilisateur

### Sections

1. **Informations personnelles**
   - Nom complet
   - Email (non modifiable si OAuth)
   - Avatar
   - Date d'inscription
   - Bouton "Modifier"

2. **Historique des quiz**
   - Liste des quiz passés avec date
   - Top 3 recommandations par quiz
   - Bouton "Voir détails"
   - Bouton "Refaire le quiz"

3. **Actions**
   - Bouton "Nouveau quiz"
   - Bouton "Se déconnecter"
   - Bouton "Supprimer mon compte" (avec confirmation)

### Composants

```typescript
// ProfileHeader.tsx
interface ProfileHeaderProps {
  profile: Profile;
  onEdit: () => void;
}

// QuizHistory.tsx
interface QuizHistoryProps {
  results: QuizResult[];
  onRetake: (quizId: string) => void;
}

// ProfileEdit.tsx
interface ProfileEditProps {
  profile: Profile;
  onSave: (data: ProfileUpdate) => Promise<void>;
  onCancel: () => void;
}
```

---

## 🎨 Intégration UI/UX

### Design System (respect de l'existant)

- Couleurs : gold-400, cream-100/300/400, dark-700/800
- Typographie : Playfair Display (serif) + Inter (sans)
- Composants : Utiliser les composants existants (Card, Button, Badge)
- Background : textured-bg
- Animations : Framer Motion pour les transitions

### Formulaires

- Validation en temps réel avec Zod
- Messages d'erreur clairs en français
- Loading states avec spinners
- Success states avec animations

### Navigation

```
/ (Home)
├── /login
├── /signup
├── /profile (protected)
├── /admin (protected, admin only)
├── /quiz (existant)
├── /browse (existant)
└── /results (existant, à modifier pour sauvegarder)
```

---

## 🔧 Installation et Configuration

### 1. Installer Supabase

```bash
pnpm add @supabase/supabase-js
pnpm add -D @supabase/auth-helpers-react
```

### 2. Variables d'environnement

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_GOOGLE_CLIENT_ID=xxx
```

### 3. Configuration Supabase

- Créer un projet Supabase
- Configurer Google OAuth dans Authentication > Providers
- Créer les tables avec les migrations SQL
- Activer RLS et les policies

---

## 📝 Modifications du Code Existant

### 1. Store Quiz (useQuizStore.ts)

**Ajouter :**
- Fonction `saveQuizResult()` pour sauvegarder en DB
- Fonction `loadQuizHistory()` pour charger l'historique

### 2. Page Results (Results.tsx)

**Ajouter :**
- Bouton "Sauvegarder mes résultats" (si connecté)
- Message "Connectez-vous pour sauvegarder" (si non connecté)

### 3. Navigation (Navigation.tsx)

**Ajouter :**
- Bouton "Connexion" (si non connecté)
- Avatar + dropdown menu (si connecté)
  - Mon profil
  - Tableau de bord (si admin)
  - Déconnexion

---

## 🚀 Plan d'Implémentation

### Phase 1 : Infrastructure (Jour 1)
- [ ] Créer projet Supabase
- [ ] Configurer OAuth Google
- [ ] Créer tables et policies RLS
- [ ] Installer dépendances
- [ ] Créer client Supabase

### Phase 2 : Authentification (Jour 2)
- [ ] Store auth (useAuthStore)
- [ ] Hooks auth (useAuth, useProfile)
- [ ] Composants formulaires (Login, Signup)
- [ ] Composant GoogleAuthButton
- [ ] Modal AuthModal
- [ ] ProtectedRoute HOC

### Phase 3 : Profil Utilisateur (Jour 3)
- [ ] Page Profile
- [ ] Composants profil (Header, Edit)
- [ ] Historique quiz (QuizHistory)
- [ ] Intégration sauvegarde quiz

### Phase 4 : Dashboard Admin (Jour 4)
- [ ] Page AdminDashboard
- [ ] Composants stats (DashboardStats)
- [ ] Analytics quiz (QuizAnalytics)
- [ ] Top recommendations
- [ ] Graphiques avec recharts

### Phase 5 : Intégration & Tests (Jour 5)
- [ ] Modifier Navigation
- [ ] Modifier Results pour sauvegarder
- [ ] Tests e2e
- [ ] Documentation
- [ ] Déploiement

---

## 📦 Dépendances Additionnelles

```bash
pnpm add @supabase/supabase-js
pnpm add recharts  # Pour les graphiques admin
pnpm add react-hook-form  # Pour les formulaires
pnpm add @hookform/resolvers  # Pour validation Zod
```

---

## 🔒 Sécurité

### Checklist

- ✅ Passwords hashés par Supabase (bcrypt)
- ✅ Tokens JWT avec expiration
- ✅ HTTPS only
- ✅ Row Level Security (RLS) activé
- ✅ Validation des inputs (Zod)
- ✅ Protection CSRF via Supabase
- ✅ Rate limiting via Supabase
- ✅ Email confirmation obligatoire
- ✅ OAuth 2.0 pour Google

### Bonnes pratiques

1. Ne jamais exposer les clés privées
2. Valider toutes les entrées utilisateur
3. Utiliser RLS pour toutes les tables sensibles
4. Logger les actions admin
5. Implémenter un système de backup

---

## 📈 Métriques de Succès

- [ ] 100% des utilisateurs peuvent s'inscrire
- [ ] 100% des quiz peuvent être sauvegardés
- [ ] Dashboard admin se charge en < 2s
- [ ] Historique utilisateur se charge en < 1s
- [ ] 0 erreur de sécurité
- [ ] Tests e2e passent à 100%

---

**Prêt à commencer l'implémentation ?**
