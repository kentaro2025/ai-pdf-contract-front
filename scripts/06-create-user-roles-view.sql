-- Create a view to get user roles with email addresses
-- This view joins auth.users with user_roles table
-- Note: This requires the auth.users table to be accessible
-- In Supabase, you may need to enable this via database functions

-- Create function to get user email (since auth.users is not directly accessible)
-- This function will be used by the view
CREATE OR REPLACE FUNCTION get_user_email(user_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  -- In Supabase, you can access auth.users via the auth schema
  -- This is a placeholder - actual implementation depends on your Supabase setup
  RETURN (
    SELECT email 
    FROM auth.users 
    WHERE id = user_uuid
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for user roles with emails
-- Note: This view may not work directly if auth.users is not accessible
-- Alternative: Create a materialized view or use a different approach
CREATE OR REPLACE VIEW user_roles_with_email AS
SELECT 
  ur.id,
  ur.user_id,
  ur.role,
  ur.created_at,
  ur.updated_at,
  COALESCE(
    (SELECT email FROM auth.users WHERE id = ur.user_id LIMIT 1),
    'user-' || SUBSTRING(ur.user_id::TEXT, 1, 8) || '@example.com'
  ) AS email
FROM user_roles ur;

-- Grant access to authenticated users
GRANT SELECT ON user_roles_with_email TO authenticated;

-- Alternative: If the above doesn't work, create a table that syncs with auth.users
-- This would require a trigger on auth.users to keep it in sync
-- For now, the admin dashboard will use the user_id and fetch emails via API if needed

