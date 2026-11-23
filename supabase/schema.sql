create table public.inquiries (
 id uuid primary key default gen_random_uuid(),
 kind text not null check (kind in ('care','job')),
 name text not null check (char_length(name) between 1 and 30),
 phone text not null check (phone ~ '^0[0-9]{8,10}$'),
 area text not null check (char_length(area) between 1 and 50),
 condition text not null check (char_length(condition) between 1 and 50),
 consent_at timestamptz not null default now(),
 status text not null default 'new' check (status in ('new','contacted','closed')),
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default (now()+interval '90 days'),
 source_hash text not null
);
alter table public.inquiries enable row level security;
revoke all on public.inquiries from anon, authenticated;
grant all on public.inquiries to service_role;
create index inquiries_created_idx on public.inquiries(created_at desc);
create index inquiries_source_idx on public.inquiries(source_hash,created_at);
create index inquiries_expiry_idx on public.inquiries(expires_at);
create function public.submit_care_inquiry(payload jsonb, source_hash text)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare inquiry_id uuid;
begin
 perform pg_advisory_xact_lock(hashtextextended(source_hash,0));
 if (select count(*) from public.inquiries i where i.source_hash=submit_care_inquiry.source_hash and i.created_at>now()-interval '1 hour')>=5 then
 raise exception 'RATE_LIMIT';
 end if;
 insert into public.inquiries(kind,name,phone,area,condition,source_hash)
 values(payload->>'kind',payload->>'name',payload->>'phone',payload->>'area',payload->>'condition',source_hash) returning id into inquiry_id;
 return inquiry_id;
end $$;
revoke all on function public.submit_care_inquiry(jsonb,text) from public,anon,authenticated;
grant execute on function public.submit_care_inquiry(jsonb,text) to service_role;
create extension if not exists pg_cron;
select cron.schedule('hawaii-inquiry-retention','15 18 * * *',$job$delete from public.inquiries where expires_at < now();$job$);