// Script pour créer un utilisateur de test dans Supabase
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Création d\'un utilisateur de test\n');

// Vérifier la configuration
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'https://placeholder.supabase.co' ||
    supabaseAnonKey === 'placeholder-key' ||
    supabaseAnonKey.includes('REMPLACEZ')) {
  console.log('❌ Supabase n\'est pas configuré!\n');
  console.log('📝 Vous devez d\'abord:');
  console.log('   1. Configurer votre clé Supabase dans .env.local');
  console.log('   2. Redémarrer le serveur');
  console.log('   3. Puis exécuter ce script à nouveau\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Informations de l'utilisateur de test
const testUser = {
  email: 'test@insideai.com',
  password: 'Test123456!',
  fullName: 'Utilisateur Test'
};

async function createTestUser() {
  try {
    console.log('📝 Création de l\'utilisateur de test...\n');
    
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          full_name: testUser.fullName,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('ℹ️  L\'utilisateur existe déjà!\n');
        console.log('📋 Identifiants de connexion:');
        console.log(`   Email: ${testUser.email}`);
        console.log(`   Mot de passe: ${testUser.password}\n`);
        console.log('✅ Vous pouvez vous connecter avec ces identifiants\n');
      } else {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
      }
    } else {
      console.log('✅ Utilisateur de test créé avec succès!\n');
      console.log('📋 Identifiants de connexion:');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Mot de passe: ${testUser.password}\n`);
      console.log('✅ Vous pouvez maintenant vous connecter à l\'application\n');
      console.log('🌐 Allez sur: http://localhost:3000/login\n');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
    process.exit(1);
  }
}

createTestUser();

