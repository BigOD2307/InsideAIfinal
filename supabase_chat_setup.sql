-- Table pour les conversations
create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  thread_id text not null, -- ID du thread OpenAI
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table pour les messages (miroir local pour affichage rapide)
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Policies de sécurité (RLS)
alter table conversations enable row level security;
alter table messages enable row level security;

create policy "Les utilisateurs peuvent voir leurs propres conversations"
  on conversations for select
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent créer leurs propres conversations"
  on conversations for insert
  with check (auth.uid() = user_id);

create policy "Les utilisateurs peuvent voir les messages de leurs conversations"
  on messages for select
  using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

create policy "Les utilisateurs peuvent insérer des messages dans leurs conversations"
  on messages for insert
  with check (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

