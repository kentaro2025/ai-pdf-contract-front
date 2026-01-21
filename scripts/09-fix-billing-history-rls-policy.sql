-- Fix: Add INSERT policy for billing_history table
-- This allows users to create their own billing history entries

-- Drop existing INSERT policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can insert their own billing history" ON billing_history;

-- Create policy: Users can insert their own billing history
CREATE POLICY "Users can insert their own billing history"
  ON billing_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
