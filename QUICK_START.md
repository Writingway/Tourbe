# 🚀 Quick Start - Authentification Tourbe

## ✅ Étapes à suivre maintenant

### 1. Créer le fichier .env

Créez un fichier `.env` à la racine avec vos credentials Supabase :

```env
VITE_SUPABASE_URL=https://votre-id.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key
```

### 2. Exécuter la migration SQL

1. Ouvrez Supabase Dashboard
2. Allez dans **SQL Editor**
3. Copiez-collez le contenu de `supabase_migration.sql`
4. Cliquez sur **Run**

### 3. Lancer l'application

```bash
pnpm dev
```

### 4. Tester

1. Créez un compte sur http://localhost:5173
2. Connectez-vous
3. Passez un quiz et sauvegardez les résultats
4. Allez sur `/profile` pour voir votre profil

### 5. Devenir admin

Dans Supabase **SQL Editor**, exécutez :

```sql
SELECT promote_to_admin('votre-email@example.com');
```

Puis déconnectez-vous et reconnectez-vous. Vous pouvez maintenant accéder à `/admin` !

---

## 📁 Fichiers importants

- `.env.example` - Template pour vos credentials
- `supabase_migration.sql` - Script SQL à exécuter dans Supabase
- `AUTH_IMPLEMENTATION_GUIDE.md` - Guide complet et détaillé
- `AUTHENTICATION_PLAN.md` - Plan technique de l'implémentation

---

## 🎯 Routes disponibles

- `/` - Accueil
- `/quiz` - Quiz
- `/results` - Résultats (avec sauvegarde)
- `/browse` - Explorer les whiskies
- `/profile` - Profil utilisateur (**protégé**)
- `/admin` - Dashboard admin (**protégé - admin uniquement**)

---

## 🆘 En cas de problème

1. Vérifiez que le fichier `.env` existe et contient les bonnes credentials
2. Vérifiez que la migration SQL a bien été exécutée (tables créées dans Supabase)
3. Redémarrez le serveur de développement
4. Consultez `AUTH_IMPLEMENTATION_GUIDE.md` pour plus de détails

---

**Tout est prêt ! 🎉**
