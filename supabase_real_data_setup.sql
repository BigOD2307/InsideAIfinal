-- Table pour les news de la veille
create table if not exists veille_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  summary text not null,
  category text not null, -- 'Major', 'Google', 'Retail', etc.
  source_url text,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insérer quelques données initiales pour ne pas avoir un dashboard vide au lancement
insert into veille_items (title, summary, category, published_at) values 
('OpenAI lance GPT-4o', 'Le nouveau modèle omnicanal promet une latence réduite et des capacités vocales impressionnantes.', 'Major', now()),
('Google intègre Gemini 1.5 Pro', 'Mise à jour majeure pour la suite Workspace avec une fenêtre contextuelle de 1M tokens.', 'Google', now() - interval '1 day'),
('Mistral AI lève 600M€', 'La startup française valorisée à 6 milliards d''euros continue sa course contre les géants US.', 'Business', now() - interval '2 days');

-- RLS
alter table veille_items enable row level security;
create policy "Public read access" on veille_items for select using (true);

