-- Add INSERT policy for user_roles table to allow trigger function to insert roles
-- This policy allows users to insert their own role (used by the trigger function)
-- Note: The trigger function uses SECURITY DEFINER which should bypass RLS,
-- but this policy provides an additional safety net and allows manual role assignment

-- Drop policy if it exists
DROP POLICY IF EXISTS "Users can insert their own role" ON user_roles;

-- Create the INSERT policy
CREATE POLICY "Users can insert their own role"
  ON user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Note: Service role policies typically don't need explicit policies as they bypass RLS
-- But if you're using the anon key with elevated privileges, you might need this
