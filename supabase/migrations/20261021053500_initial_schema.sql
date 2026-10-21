-- mjwalsh.net initial schema
-- Matches docs/mjwalsh-net-build-plan.md section 8.3.
-- Every table has row level security on. The anon role can read exactly one
-- thing: the public metrics view. Everything else is written and read by
-- server routes using the secret key, which bypasses RLS.

-- Shared trigger: keep updated_at honest.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- One row per live figure shown on the site (section 6.6).
create table public.site_metrics (
  key text primary key,
  value numeric not null,
  label text not null,
  source text not null,
  as_of timestamptz not null,
  updated_at timestamptz not null default now()
);

comment on table public.site_metrics is
  'One row per live number on mjwalsh.net. Upserted by the scheduled metrics job; read at build time through site_metrics_public.';

create trigger site_metrics_set_updated_at
  before update on public.site_metrics
  for each row execute function public.set_updated_at();

alter table public.site_metrics enable row level security;

-- Anyone may read the public columns. updated_at stays private.
create policy "site_metrics are publicly readable"
  on public.site_metrics
  for select
  to anon, authenticated
  using (true);

revoke all on table public.site_metrics from anon, authenticated;
grant select (key, value, label, source, as_of) on table public.site_metrics to anon, authenticated;

-- The stable public contract. security_invoker so the grants above apply.
create view public.site_metrics_public
  with (security_invoker = true)
as
  select key, value, label, source, as_of
  from public.site_metrics;

comment on view public.site_metrics_public is
  'Public read view of site_metrics. The site builds against this, never the table.';

grant select on public.site_metrics_public to anon, authenticated;

-- Contact form submissions, as a backup to the email sent through Resend.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  message text not null check (char_length(message) between 1 and 10000),
  ip_hash text,
  user_agent text,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'spam'))
);

comment on table public.contact_messages is
  'Contact form backup. Insert only from the server route after validation and rate limiting. No public access.';

create index contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index contact_messages_ip_hash_created_at_idx on public.contact_messages (ip_hash, created_at desc);

alter table public.contact_messages enable row level security;
revoke all on table public.contact_messages from anon, authenticated;

-- Optional view counts per post. Off by default on the site.
create table public.post_views (
  slug text primary key,
  count bigint not null default 0,
  updated_at timestamptz not null default now()
);

comment on table public.post_views is
  'View counter per post slug. Incremented only through increment_post_view().';

create trigger post_views_set_updated_at
  before update on public.post_views
  for each row execute function public.set_updated_at();

alter table public.post_views enable row level security;
revoke all on table public.post_views from anon, authenticated;

-- Atomic increment, callable only by the service role from a server route.
create or replace function public.increment_post_view(p_slug text)
returns bigint
language sql
security definer
set search_path = ''
as $$
  insert into public.post_views (slug, count)
  values (p_slug, 1)
  on conflict (slug) do update
    set count = public.post_views.count + 1
  returning count;
$$;

revoke all on function public.increment_post_view(text) from public, anon, authenticated;
grant execute on function public.increment_post_view(text) to service_role;

-- Newsletter sign-ups, mirrored locally so Buttondown is not the only copy.
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) between 3 and 320),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'unsubscribed'))
);

comment on table public.subscribers is
  'Newsletter sign-up mirror. Written by the subscribe route; no public access.';

create trigger subscribers_set_updated_at
  before update on public.subscribers
  for each row execute function public.set_updated_at();

alter table public.subscribers enable row level security;
revoke all on table public.subscribers from anon, authenticated;
