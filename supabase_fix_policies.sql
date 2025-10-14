-- =====================================================
-- FIX: Supprimer la récursion infinie dans les policies
-- =====================================================

-- PROFILES: Supprimer les anciennes policies
DROP POLICY IF EXISTS "Profiles are viewable by owner" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by admins" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON profiles;

-- Créer des policies simplifiées SANS récursion
-- Policy 1: Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy 3: Autoriser l'insertion (pour le trigger)
CREATE POLICY "profiles_insert_any"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- QUIZ_RESULTS: Simplifier aussi
-- =====================================================

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "Users can view own quiz results" ON quiz_results;
DROP POLICY IF EXISTS "Admins can view all quiz results" ON quiz_results;
DROP POLICY IF EXISTS "Users can insert own quiz results" ON quiz_results;

-- Créer des policies simplifiées
CREATE POLICY "quiz_results_select_own"
  ON quiz_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "quiz_results_insert_own"
  ON quiz_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- ANALYTICS_EVENTS: Simplifier
-- =====================================================

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "Admins can view analytics" ON analytics_events;
DROP POLICY IF EXISTS "Anyone can insert analytics" ON analytics_events;

-- Créer des policies simplifiées
CREATE POLICY "analytics_select_any"
  ON analytics_events FOR SELECT
  USING (true);  -- Temporairement permissif pour debug

CREATE POLICY "analytics_insert_any"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- VÉRIFICATION
-- =====================================================

SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('profiles', 'quiz_results', 'analytics_events')
ORDER BY tablename, policyname;
