// Script pour vérifier et afficher les variables d'environnement
const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification complète des variables d\'environnement\n');
console.log('='.repeat(60) + '\n');

// Vérifier .env.local
const envLocalPath = path.join(__dirname, '.env.local');
const envPath = path.join(__dirname, '.env');

console.log('📁 Fichiers trouvés:\n');

if (fs.existsSync(envLocalPath)) {
  console.log('✅ .env.local existe');
  const content = fs.readFileSync(envLocalPath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
  console.log(`   ${lines.length} lignes de configuration\n`);
} else {
  console.log('❌ .env.local n\'existe pas\n');
}

if (fs.existsSync(envPath)) {
  console.log('✅ .env existe');
  const content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
  console.log(`   ${lines.length} lignes de configuration\n`);
} else {
  console.log('ℹ️  .env n\'existe pas (normal, on utilise .env.local)\n');
}

console.log('='.repeat(60) + '\n');
console.log('📋 Variables dans .env.local:\n');

if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf-8');
  
  // Extraire les variables Supabase
  const supabaseUrlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.+)/);
  const supabaseKeyMatch = content.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.+)/);
  
  if (supabaseUrlMatch) {
    const url = supabaseUrlMatch[1].trim().replace(/^["']|["']$/g, '');
    console.log('✅ NEXT_PUBLIC_SUPABASE_URL:');
    console.log(`   ${url}`);
    if (url.includes('placeholder') || url === '') {
      console.log('   ⚠️  URL est un placeholder ou vide');
    } else {
      console.log('   ✅ URL valide');
    }
  } else {
    console.log('❌ NEXT_PUBLIC_SUPABASE_URL: Non trouvé');
  }
  
  console.log('');
  
  if (supabaseKeyMatch) {
    const key = supabaseKeyMatch[1].trim().replace(/^["']|["']$/g, '');
    const preview = key.length > 60 ? key.substring(0, 60) + '...' : key;
    console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY:');
    console.log(`   ${preview}`);
    console.log(`   Longueur: ${key.length} caractères`);
    
    if (key.includes('REMPLACEZ') || key.includes('placeholder') || key === '') {
      console.log('   ❌ Clé est un placeholder ou vide');
      console.log('   📝 Vous devez remplacer cette valeur par votre vraie clé');
    } else if (key.startsWith('eyJ')) {
      console.log('   ✅ Clé semble valide (commence par eyJ)');
      if (key.length < 100) {
        console.log('   ⚠️  Clé semble trop courte (devrait être 200+ caractères)');
      } else {
        console.log('   ✅ Longueur correcte');
      }
    } else {
      console.log('   ⚠️  Format non standard (devrait commencer par eyJ)');
    }
  } else {
    console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY: Non trouvé');
  }
} else {
  console.log('❌ Fichier .env.local introuvable');
  console.log('📝 Créez-le avec: node setup-env.js');
}

console.log('\n' + '='.repeat(60) + '\n');
console.log('💡 Note:');
console.log('   - Le fichier doit s\'appeler .env.local (pas .env)');
console.log('   - Il doit être dans le dossier frontend/');
console.log('   - Après modification, redémarrez le serveur (Ctrl+C puis npm run dev)');
console.log('   - Visitez http://localhost:3000/test-env pour voir ce que Next.js charge\n');

