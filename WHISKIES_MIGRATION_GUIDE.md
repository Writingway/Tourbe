# 🥃 Guide de Migration - Whiskies vers Supabase

## 📋 Vue d'ensemble

Ce guide vous accompagne pour migrer les 492 whiskies du fichier JSON vers la base de données Supabase.

---

## ✅ Ce qui a été implémenté

### 🗄️ Base de données
- ✅ Table `whiskies` avec 16 colonnes
- ✅ Index optimisés pour les recherches rapides
- ✅ Row Level Security (RLS) : lecture publique, écriture admin only
- ✅ Fonctions de recherche et filtrage avancées
- ✅ Triggers pour `updated_at` automatique

### 🔧 Code de l'application
- ✅ Hook `useWhiskies` pour charger les whiskies depuis Supabase
- ✅ Hook `useWhisky` pour charger un whisky individuel
- ✅ Hook `useWhiskiesCount` pour compter les résultats filtrés
- ✅ Context `WhiskiesContext` pour l'état global
- ✅ Mise à jour de App.tsx (WhiskiesProvider)
- ✅ Mise à jour de QuizShell.tsx (utilise le context)
- ✅ Mise à jour de Browse.tsx (utilise le context)
- ✅ Types TypeScript complets pour la table

### 📜 Scripts
- ✅ Script d'import `scripts/import-whiskies.ts`
- ✅ Migration SQL `supabase_whiskies_migration.sql`

---

## 🚀 Étapes de Migration

### Étape 1 : Créer la table dans Supabase

1. Connectez-vous à votre [Dashboard Supabase](https://supabase.com/dashboard)
2. Sélectionnez votre projet **Tourbe**
3. Allez dans **SQL Editor**
4. Cliquez sur **New query**
5. Copiez-collez le contenu de `supabase_whiskies_migration.sql`
6. Cliquez sur **Run** (ou F5)

**Vérifiez que tout s'est bien passé :**
- Aucune erreur dans la console
- La table `whiskies` apparaît dans **Database** > **Tables**

### Étape 2 : Importer les 492 whiskies

1. Assurez-vous que votre fichier `.env` contient les credentials Supabase :
   ```env
   VITE_SUPABASE_URL=https://votre-id.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-anon-key
   ```

2. Lancez le script d'import :
   ```bash
   pnpm tsx scripts/import-whiskies.ts
   ```

3. Le script va :
   - Charger les 492 whiskies depuis `src/data/whiskies.json`
   - Les transformer au format base de données
   - Les insérer par batches de 100
   - Afficher un rapport de progression

**Résultat attendu :**
```
🥃 Starting whisky import...
📊 Total whiskies to import: 492

🗑️  Clearing existing whiskies...
✅ Existing whiskies cleared

📦 Inserting whiskies in batches...

📤 Batch 1/5 (100 whiskies)
✅ Batch 1 completed (100 whiskies)

📤 Batch 2/5 (100 whiskies)
✅ Batch 2 completed (100 whiskies)

...

============================================================
📊 IMPORT SUMMARY
============================================================
✅ Successfully imported: 492 whiskies
📈 Success rate: 100.0%

🗄️  Total whiskies in database: 492

🎉 Import completed!
✨ All done!
```

### Étape 3 : Vérifier l'import

1. Dans Supabase, allez dans **Database** > **Tables** > **whiskies**
2. Cliquez sur **View data**
3. Vérifiez que les 492 whiskies sont bien présents
4. Testez quelques requêtes :
   ```sql
   -- Compter les whiskies
   SELECT COUNT(*) FROM whiskies;

   -- Voir les whiskies écossais
   SELECT name, distillery, region FROM whiskies WHERE region LIKE 'SCOTLAND%' LIMIT 10;

   -- Chercher par nom
   SELECT name, distillery FROM whiskies WHERE name ILIKE '%laphroaig%';
   ```

### Étape 4 : Tester l'application

1. Lancez l'application :
   ```bash
   pnpm dev
   ```

2. Testez les fonctionnalités :

**Page d'accueil (`/`)**
- ✅ L'application se charge correctement
- ✅ Un spinner s'affiche pendant le chargement des whiskies

**Page Quiz (`/quiz`)**
- ✅ Le quiz se charge
- ✅ Les questions s'affichent
- ✅ À la fin, les recommandations sont calculées avec les whiskies de Supabase

**Page Parcourir (`/browse`)**
- ✅ La liste des 492 whiskies s'affiche
- ✅ Les filtres fonctionnent (région, prix, style, distillerie, ABV)
- ✅ La barre de recherche fonctionne
- ✅ Le compteur de résultats est correct

**Page Résultats (`/results`)**
- ✅ Les recommandations s'affichent après le quiz
- ✅ Les 3 whiskies recommandés sont corrects

### Étape 5 : (Optionnel) Supprimer l'ancien fichier JSON

**⚠️ ATTENTION : Ne faites cette étape QUE si tout fonctionne parfaitement !**

Une fois que vous avez confirmé que tout fonctionne :

1. Vous pouvez garder `src/data/whiskies.json` comme backup
2. Ou le supprimer si vous êtes sûr :
   ```bash
   rm src/data/whiskies.json
   ```

3. Le fichier n'est plus importé nulle part dans le code, donc il n'a plus d'utilité.

---

## 📊 Schéma de la Table Whiskies

```sql
CREATE TABLE whiskies (
  id TEXT PRIMARY KEY,                    -- Identifiant unique (slug)
  name TEXT NOT NULL,                     -- Nom du whisky
  region TEXT NOT NULL,                   -- Région (SCOTLAND_ISLAY, etc.)
  distillery TEXT NOT NULL,               -- Nom de la distillerie
  abv DECIMAL(4,1) NOT NULL,              -- Degré d'alcool (35-75%)
  price_band TEXT NOT NULL,               -- Gamme de prix
  style TEXT[] NOT NULL,                  -- Tags de style (array)
  intensity TEXT NOT NULL,                -- Intensité (LIGHT/MEDIUM/BOLD)
  mouthfeel TEXT[] NOT NULL,              -- Sensation en bouche (array)
  finish JSONB NOT NULL,                  -- Finish (length + notes)
  experimental BOOLEAN NOT NULL,          -- Édition limitée ?
  tasting_note_short TEXT NOT NULL,       -- Note de dégustation
  image TEXT NOT NULL,                    -- URL de l'image
  distillery_location JSONB NOT NULL,     -- Coordonnées GPS (lat, lng)
  created_at TIMESTAMP WITH TIME ZONE,    -- Date de création
  updated_at TIMESTAMP WITH TIME ZONE     -- Date de mise à jour
);
```

### Index créés

- `idx_whiskies_name` : Recherche full-text sur le nom
- `idx_whiskies_region` : Filtrage par région
- `idx_whiskies_price_band` : Filtrage par prix
- `idx_whiskies_abv` : Filtrage par ABV
- `idx_whiskies_style` : Filtrage par style (GIN index)
- `idx_whiskies_intensity` : Filtrage par intensité
- `idx_whiskies_experimental` : Filtrage par édition limitée
- `idx_whiskies_region_price` : Filtrage combiné région + prix

---

## 🔍 Utilisation des Hooks

### Hook `useWhiskies` - Charger tous les whiskies

```tsx
import { useWhiskies } from '../hooks/useWhiskies';

function MyComponent() {
  const { whiskies, isLoading, error, count } = useWhiskies();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  return (
    <div>
      <p>{count} whiskies trouvés</p>
      {whiskies.map(whisky => (
        <div key={whisky.id}>{whisky.name}</div>
      ))}
    </div>
  );
}
```

### Hook `useWhiskies` avec filtres

```tsx
import { useWhiskies } from '../hooks/useWhiskies';

function FilteredWhiskies() {
  const { whiskies, isLoading } = useWhiskies({
    filters: {
      regions: ['SCOTLAND_ISLAY', 'SCOTLAND_SPEYSIDE'],
      priceBands: ['40_70', '70_120'],
      abvMin: 43,
      abvMax: 50,
      styles: ['PEATY', 'SMOKY'],
      search: 'laphroaig'
    },
    limit: 50
  });

  // ...
}
```

### Hook `useWhisky` - Charger un seul whisky

```tsx
import { useWhisky } from '../hooks/useWhiskies';

function WhiskyDetail({ whiskyId }: { whiskyId: string }) {
  const { whisky, isLoading, error } = useWhisky(whiskyId);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;
  if (!whisky) return <div>Whisky non trouvé</div>;

  return (
    <div>
      <h1>{whisky.name}</h1>
      <p>{whisky.distillery}</p>
      <p>{whisky.abv}% ABV</p>
    </div>
  );
}
```

### Hook `useWhiskiesCount` - Compter les résultats

```tsx
import { useWhiskiesCount } from '../hooks/useWhiskies';

function WhiskyCounter() {
  const { count, isLoading } = useWhiskiesCount({
    regions: ['SCOTLAND_ISLAY'],
    priceBands: ['UNDER_40']
  });

  if (isLoading) return <div>...</div>;

  return <div>{count} whiskies correspondent à vos critères</div>;
}
```

### Context `WhiskiesContext` - Accès global

```tsx
import { useWhiskiesContext } from '../contexts/WhiskiesContext';

function AnyComponent() {
  const { whiskies, isLoading, error, refresh, count } = useWhiskiesContext();

  // Les whiskies sont chargés au niveau de l'App
  // Disponibles partout sans refetch
}
```

---

## 🎯 Fonctionnalités Avancées

### Recherche full-text

La table `whiskies` supporte la recherche full-text sur les champs `name`, `distillery` et `tasting_note_short`.

```typescript
const { whiskies } = useWhiskies({
  filters: {
    search: 'tourbé fruité' // Recherche dans tous les champs
  }
});
```

### Filtrage avancé

Combinez plusieurs filtres :

```typescript
const { whiskies } = useWhiskies({
  filters: {
    regions: ['SCOTLAND_ISLAY'],        // Région
    priceBands: ['40_70'],               // Prix
    abvMin: 43,                          // ABV min
    abvMax: 50,                          // ABV max
    styles: ['PEATY', 'SMOKY'],          // Styles
    intensities: ['BOLD'],               // Intensité
    experimental: true,                  // Éditions limitées uniquement
    search: 'laphroaig'                  // Recherche textuelle
  },
  limit: 20                              // Limiter les résultats
});
```

### Pagination (future amélioration)

Le hook supporte déjà `limit` et peut facilement être étendu avec `offset` :

```typescript
const { whiskies } = useWhiskies({
  limit: 20,
  // offset: page * 20  // À implémenter si besoin
});
```

---

## 🔒 Sécurité

### Row Level Security (RLS)

**Lecture (SELECT) :**
- ✅ Tout le monde peut lire les whiskies (données publiques)

**Écriture (INSERT/UPDATE/DELETE) :**
- ⛔ Seuls les admins peuvent modifier les whiskies
- ⛔ Les utilisateurs normaux ne peuvent pas ajouter/modifier/supprimer

### Vérifier les policies

Dans Supabase, allez dans **Authentication** > **Policies** > Table `whiskies`.

Vous devriez voir :
- `Anyone can view whiskies` (SELECT)
- `Admins can insert whiskies` (INSERT)
- `Admins can update whiskies` (UPDATE)
- `Admins can delete whiskies` (DELETE)

---

## 🐛 Dépannage

### Problème : Le script d'import échoue

**Symptôme :** Erreurs lors de l'exécution de `pnpm tsx scripts/import-whiskies.ts`

**Solutions :**
1. Vérifiez que le fichier `.env` existe et contient les bonnes credentials
2. Vérifiez que la table `whiskies` a bien été créée dans Supabase
3. Vérifiez que vous avez accès à internet
4. Essayez de réduire la taille des batches (ligne 87 du script : `const batchSize = 50;`)

### Problème : Les whiskies ne s'affichent pas dans l'app

**Symptôme :** L'application se charge mais aucun whisky ne s'affiche

**Solutions :**
1. Ouvrez la console du navigateur (F12)
2. Vérifiez s'il y a des erreurs
3. Allez dans l'onglet **Network** et regardez les requêtes à Supabase
4. Vérifiez que les whiskies sont bien dans la table (voir Étape 3)
5. Vérifiez que le WhiskiesProvider est bien dans App.tsx

### Problème : Erreur "Cannot read property 'whiskies' of undefined"

**Symptôme :** Erreur lors de l'utilisation de `useWhiskiesContext()`

**Solution :** Assurez-vous que le composant est bien à l'intérieur du `WhiskiesProvider` dans App.tsx.

### Problème : Les filtres ne fonctionnent pas

**Symptôme :** Les filtres sur la page Browse ne retournent aucun résultat

**Solutions :**
1. Vérifiez que les index ont bien été créés (voir dans Supabase > Database > Indexes)
2. Vérifiez les valeurs des filtres (doivent correspondre exactement aux valeurs en base)
3. Testez directement dans Supabase SQL Editor avec une requête simple

---

## 📈 Performances

### Temps de chargement attendus

- **Chargement initial** : ~500ms pour 492 whiskies
- **Recherche** : <100ms grâce aux index
- **Filtrage** : <200ms même avec plusieurs filtres

### Optimisations

- Les whiskies sont chargés une seule fois au démarrage de l'app
- Le contexte permet de partager les données sans refetch
- Les index PostgreSQL assurent des recherches rapides
- Les batches d'import évitent les timeouts

---

## 🎉 Avantages de cette Migration

### Avant (JSON)
- ❌ Fichier statique de 16k lignes
- ❌ Chargé à chaque build
- ❌ Pas de recherche optimisée
- ❌ Pas de filtrage côté serveur
- ❌ Impossible d'ajouter/modifier des whiskies sans redéployer

### Après (Supabase)
- ✅ Base de données dynamique
- ✅ Recherche full-text optimisée
- ✅ Filtres avancés côté serveur
- ✅ Index pour des performances maximales
- ✅ Ajout/modification de whiskies sans redéployer
- ✅ Possibilité d'ajouter un panneau admin pour gérer les whiskies
- ✅ Scalable (peut supporter des millions de whiskies)

---

## 🚀 Prochaines Améliorations Possibles

- [ ] Panneau admin pour ajouter/modifier/supprimer des whiskies
- [ ] Upload d'images vers Supabase Storage
- [ ] Pagination sur la page Browse
- [ ] Cache côté client avec React Query
- [ ] Recherche avec suggestions (autocomplete)
- [ ] Filtres sauvegardés par utilisateur
- [ ] Notes et reviews des utilisateurs
- [ ] Système de favoris

---

**🎉 Félicitations ! Votre migration est terminée ! Les 492 whiskies sont maintenant dans Supabase ! 🥃**
