# Role-Based Access Control (RBAC) Setup Guide

This guide explains how to set up and use role-based access control in the application.

## Database Setup

### 1. Create the user_roles table

Run the SQL migration file in your Supabase SQL Editor:

```sql
-- Run: scripts/04-create-user-roles-table.sql
```

This creates:
- `user_roles` table with `user_id` (references `auth.users`) and `role` (text)
- Row Level Security (RLS) policies
- Indexes for performance

### 2. Set up automatic role assignment

Run the trigger SQL file:

```sql
-- Run: scripts/05-assign-default-role-trigger.sql
```

This creates a trigger that automatically assigns the default `'user'` role to new users when they sign up.

## Available Roles

- `user` - Default role for all new users
- `admin` - Administrative access
- `moderator` - Moderator access (optional)

You can add more roles as needed by updating the `UserRole` type in `lib/supabase/roles.ts`.

## Usage

### Server-Side (Server Components, API Routes)

```typescript
import { getUserRoleServer, isAdminServer, hasRoleServer } from "@/lib/supabase/roles"

// Get user role
const role = await getUserRoleServer()

// Check if user is admin
const isAdmin = await isAdminServer()

// Check for specific role
const isModerator = await hasRoleServer("moderator")
```

### Client-Side (Client Components)

```typescript
import { useUserRole } from "@/hooks/useUserRole"

function MyComponent() {
  const { role, loading, isAdmin, hasRole, hasAnyRole } = useUserRole()

  if (loading) return <div>Loading...</div>

  if (isAdmin) {
    return <div>Admin Panel</div>
  }

  return <div>Regular User</div>
}
```

### API Route Protection

```typescript
import { isAdminServer } from "@/lib/supabase/roles"

export async function GET(request: NextRequest) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const isAdmin = await isAdminServer(user.id)
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Admin-only logic here
}
```

## Assigning Roles

### Manual Assignment (via Supabase Dashboard)

1. Go to Supabase Dashboard → SQL Editor
2. Run:

```sql
-- Assign admin role to a user
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin', updated_at = NOW();
```

### Programmatic Assignment (Admin Only)

Use the admin API route:

```typescript
// PUT /api/admin/roles
{
  "userId": "user-uuid",
  "role": "admin"
}
```

## Row Level Security (RLS)

The `user_roles` table has RLS enabled with the following policies:

1. **Users can view their own role** - Users can read their own role
2. **Users can view all roles** - Users can check roles of other users (for permission checks)

To restrict role visibility further, modify the RLS policies in `04-create-user-roles-table.sql`.

## Security Notes

- Always verify authentication before checking roles
- Use server-side role checks for sensitive operations
- Client-side role checks are for UI only, not security
- The trigger automatically assigns `'user'` role on signup
- Only admins should be able to modify roles (enforced via API routes)

## Example: Protecting a Page

```typescript
// app/admin/page.tsx
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isAdminServer } from "@/lib/supabase/roles"

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const isAdmin = await isAdminServer(user.id)
  if (!isAdmin) {
    redirect("/dashboard")
  }

  return <div>Admin Content</div>
}
```

