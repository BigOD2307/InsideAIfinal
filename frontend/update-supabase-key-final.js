// Script pour mettre à jour la clé Supabase dans .env.local
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const newKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlZmJueWN4YWhleWx3eWNxaGV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzU0NjAsImV4cCI6MjA3OTIxMTQ2MH0.Tb_d0i5LsTMfU4WNEvm4aASbJrdmj83blXvAGupzE0I';

console.log('🔧 Mise à jour de la clé Supabase dans .env.local\n');

if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env.local introuvable!');
  console.log('📝 Créez-le d\'abord avec: node setup-env.js');
  process.exit(1);
}

// Lire le fichier
let content = fs.readFileSync(envPath, 'utf-8');

// Remplacer la clé
const patterns = [
  /NEXT_PUBLIC_SUPABASE_ANON_KEY=REMPLACEZ_PAR_VOTRE_CLE_ANON_SUPABASE/g,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/g,
];

let updated = false;
for (const pattern of patterns) {
  if (pattern.test(content)) {
    content = content.replace(pattern, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${newKey}`);
    updated = true;
    break;
  }
}

if (!updated) {
  // Si la ligne n'existe pas, l'ajouter
  if (!content.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
    content += `\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${newKey}\n`;
    updated = true;
  } else {
    console.log('⚠️  La clé Supabase existe déjà mais n\'a pas pu être mise à jour automatiquement');
    console.log('📝 Mettez à jour manuellement dans .env.local');
    process.exit(1);
  }
}

// Sauvegarder
try {
  fs.writeFileSync(envPath, content, 'utf-8');
  console.log('✅ Clé Supabase mise à jour avec succès!\n');
  console.log('📋 Prochaines étapes:');
  console.log('   1. ⚠️  IMPORTANT: Redémarrez le serveur Next.js');
  console.log('      - Arrêtez le serveur (Ctrl+C)');
  console.log('      - Relancez: npm run dev');
  console.log('   2. Testez l\'inscription sur: http://localhost:3000/register');
  console.log('   3. Ou créez un compte de test: node create-test-user.js\n');
} catch (error) {
  console.error('❌ Erreur lors de la sauvegarde:', error.message);
  process.exit(1);
}

