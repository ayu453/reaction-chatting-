-- Afterglow messaging foundation
-- Applied to Supabase project smreuzsuxmgwaihvttpq.
-- Public browser access uses only the publishable key; RLS protects every table.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text not null default 'Afterglow user',
  created_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,24}$'),
  constraint profiles_display_name_length check (char_length(display_name) between 1 and 40)
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
  requested_username text;
  requested_name text;
begin
  requested_username := lower(regexp_replace(coalesce(new.raw_user_meta_data ->> 'username', ''), '[^a-z0-9_]', '', 'g'));
  if char_length(requested_username) < 3 then
    requested_username := 'user_' || left(new.id::text, 8);
  end if;
  if exists (select 1 from public.profiles p where p.username = requested_username) then
    requested_username := left(requested_username, 15) || '_' || left(new.id::text, 8);
  end if;
  requested_name := left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), 'Afterglow user'), 40);
  insert into public.profiles (id, username, display_name)
  values (new.id, requested_username, requested_name)
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;
drop trigger if exists on_auth_user_created_afterglow on auth.users;
create trigger on_auth_user_created_afterglow after insert on auth.users
for each row execute function public.handle_new_user();

create table public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint friend_requests_not_self check (sender_id <> receiver_id)
);
create unique index friend_requests_one_per_pair
on public.friend_requests (least(sender_id, receiver_id), greatest(sender_id, receiver_id));
create index friend_requests_receiver_status_created on public.friend_requests (receiver_id, status, created_at desc);
create index friend_requests_sender_status_created on public.friend_requests (sender_id, status, created_at desc);

create or replace function public.protect_friend_request_update()
returns trigger language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.sender_id <> old.sender_id or new.receiver_id <> old.receiver_id then
    raise exception 'Friend request participants cannot be changed';
  end if;
  if old.status <> 'pending' or new.status not in ('accepted', 'rejected') then
    raise exception 'Only pending requests can be accepted or rejected';
  end if;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.protect_friend_request_update() from public, anon, authenticated;
create trigger protect_friend_request_update before update on public.friend_requests
for each row execute function public.protect_friend_request_update();

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  constraint messages_not_self check (sender_id <> recipient_id)
);
create index messages_conversation_created on public.messages (sender_id, recipient_id, created_at desc);
create index messages_recipient_conversation_created on public.messages (recipient_id, sender_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.friend_requests enable row level security;
alter table public.messages enable row level security;

create policy "Signed-in users can discover profiles" on public.profiles
for select to authenticated using (true);
create policy "Users can update their own profile" on public.profiles
for update to authenticated using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Participants can view friend requests" on public.friend_requests
for select to authenticated using ((select auth.uid()) = sender_id or (select auth.uid()) = receiver_id);
create policy "Users can send friend requests" on public.friend_requests
for insert to authenticated with check ((select auth.uid()) = sender_id and status = 'pending' and sender_id <> receiver_id);
create policy "Receivers can respond to friend requests" on public.friend_requests
for update to authenticated using ((select auth.uid()) = receiver_id)
with check ((select auth.uid()) = receiver_id);
create policy "Senders can cancel pending requests" on public.friend_requests
for delete to authenticated using ((select auth.uid()) = sender_id and status = 'pending');

create policy "Chat participants can read messages" on public.messages
for select to authenticated using ((select auth.uid()) = sender_id or (select auth.uid()) = recipient_id);
create policy "Only friends can send messages" on public.messages
for insert to authenticated with check (
  (select auth.uid()) = sender_id
  and exists (
    select 1 from public.friend_requests fr
    where fr.status = 'accepted'
      and ((fr.sender_id = sender_id and fr.receiver_id = recipient_id)
        or (fr.sender_id = recipient_id and fr.receiver_id = sender_id))
  )
);

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.friend_requests to authenticated;
grant select, insert on public.messages to authenticated;
alter publication supabase_realtime add table public.messages;
