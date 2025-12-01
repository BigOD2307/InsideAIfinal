-- Table pour les messages de la communauté (Chat temps réel)
create table if not exists community_messages (
  id uuid default gen_random_uuid() primary key,
  channel_id text not null, -- 'general', 'annonces', 'outils', 'support'
  user_id uuid references auth.users not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activer le Realtime sur cette table (CRUCIAL pour le chat instantané)
alter publication supabase_realtime add table community_messages;

-- Sécurité (RLS)
alter table community_messages enable row level security;

-- Tout le monde peut lire les messages
create policy "Tout le monde peut lire les messages publics"
  on community_messages for select
  using (true);

-- Seuls les utilisateurs connectés peuvent poster
create policy "Les utilisateurs authentifiés peuvent poster"
  on community_messages for insert
  with check (auth.role() = 'authenticated');

-- Vue pour récupérer les infos utilisateur facilement avec les messages
create or replace view community_messages_with_users as
select 
  m.id,
  m.channel_id,
  m.content,
  m.created_at,
  m.user_id,
  u.raw_user_meta_data->>'full_name' as user_full_name,
  u.raw_user_meta_data->>'avatar_url' as user_avatar_url,
  u.raw_user_meta_data->>'job_title' as user_job_title
from community_messages m
join auth.users u on m.user_id = u.id;

