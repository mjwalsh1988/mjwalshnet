-- Supabase installs public.rls_auto_enable() in new projects as the event
-- trigger "ensure_rls", which turns row level security on for every new table.
-- It ships SECURITY DEFINER and executable by anon and authenticated, which the
-- security advisor flags. Event trigger functions cannot be called directly,
-- so the grant does nothing useful; revoking it clears the warning and leaves
-- the trigger working (it runs as the table owner, not the API roles).
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
