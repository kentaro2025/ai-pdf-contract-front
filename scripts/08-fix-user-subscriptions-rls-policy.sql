-- Fix: Add INSERT policy for user_subscriptions table
-- This allows users to create their own subscriptions

-- Drop existing INSERT policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can insert their own subscription" ON user_subscriptions;

-- Create policy: Users can insert their own subscription
CREATE POLICY "Users can insert their own subscription"
  ON user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
