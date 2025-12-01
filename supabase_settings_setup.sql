-- Ajouter la colonne téléphone à la table users
alter table users 
add column if not exists phone text;

-- Ajouter une colonne bio si elle n'existe pas (sympa pour le profil)
alter table users 
add column if not exists bio text;

-- S'assurer que les utilisateurs peuvent modifier leur propre profil
create policy "Users can update their own profile"
  on users for update
  using ( auth.uid() = id );

