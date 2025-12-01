-- 1. Création du Bucket de stockage 'chat-uploads'
insert into storage.buckets (id, name, public)
values ('chat-uploads', 'chat-uploads', true)
on conflict (id) do nothing;

-- 2. Sécurité du Storage (Qui peut uploader ?)
-- Tout le monde peut voir (pour afficher les images dans le chat)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'chat-uploads' );

-- Seuls les connectés peuvent uploader
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check ( bucket_id = 'chat-uploads' and auth.role() = 'authenticated' );

-- 3. Mise à jour des tables pour supporter les fichiers
-- Pour la Communauté
alter table community_messages 
add column if not exists attachments jsonb default '[]'::jsonb;

-- Mettre à jour la vue communauté pour inclure les attachments
create or replace view community_messages_with_users as
select 
  m.id,
  m.channel_id,
  m.content,
  m.attachments, -- Nouvelle colonne
  m.created_at,
  m.user_id,
  u.raw_user_meta_data->>'full_name' as user_full_name,
  u.raw_user_meta_data->>'avatar_url' as user_avatar_url,
  u.raw_user_meta_data->>'job_title' as user_job_title
from community_messages m
join auth.users u on m.user_id = u.id;

-- Pour Ella (Chat Privé)
alter table messages 
add column if not exists attachments jsonb default '[]'::jsonb;

