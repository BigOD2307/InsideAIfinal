// Script de diagnostic pour les variables d'environnement
const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnostic des variables d\'environnement\n');

const envPath = path.join(__dirname, '.env.local');

// Vérifier si le fichier existe
if (!fs.existsSync(envPath)) {
  console.log('❌ Le fichier .env.local n\'existe pas!');
  console.log('📝 Créez-le avec: node setup-env.js\n');
  process.exit(1);
}

console.log('✅ Fichier .env.local trouvé\n');

// Lire le fichier
const envContent = fs.readFileSync(envPath, 'utf-8');

// Extraire les variables
const supabaseUrlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const supabaseKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);

console.log('📋 Variables trouvées:\n');

if (supabaseUrlMatch) {
  const url = supabaseUrlMatch[1].trim();
  console.log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${url.substring(0, 50)}...`);
  
  if (url.includes('placeholder') || url === '') {
    console.log('   ⚠️  URL est un placeholder ou vide');
  }
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL: Non trouvé');
}

if (supabaseKeyMatch) {
  const key = supabaseKeyMatch[1].trim();
  const keyPreview = key.length > 50 ? key.substring(0, 50) + '...' : key;
  console.log(`✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${keyPreview}`);
  
  if (key.includes('REMPLACEZ') || key.includes('placeholder') || key === '') {
    console.log('   ❌ Clé est un placeholder ou vide');
    console.log('   📝 Vous devez remplacer cette valeur par votre vraie clé Supabase');
  } else if (key.startsWith('eyJ')) {
    console.log('   ✅ Clé semble valide (commence par eyJ)');
  } else {
    console.log('   ⚠️  Clé ne semble pas avoir le format standard');
  }
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY: Non trouvé');
}

console.log('\n' + '='.repeat(60) + '\n');

// Vérifications supplémentaires
console.log('🔧 Vérifications:\n');

// Vérifier les espaces
if (supabaseKeyMatch && supabaseKeyMatch[1].includes(' ')) {
  console.log('⚠️  ATTENTION: La clé contient des espaces');
  console.log('   Supprimez les espaces autour du =');
}

// Vérifier les guillemets
if (supabaseKeyMatch && (supabaseKeyMatch[1].startsWith('"') || supabaseKeyMatch[1].startsWith("'"))) {
  console.log('⚠️  ATTENTION: La clé est entre guillemets');
  console.log('   Supprimez les guillemets');
}

// Vérifier la longueur
if (supabaseKeyMatch && supabaseKeyMatch[1].trim().length < 100) {
  console.log('⚠️  ATTENTION: La clé semble trop courte');
  console.log('   Les clés Supabase font généralement 200+ caractères');
}

console.log('\n💡 Solution:');
console.log('   1. Allez sur https://supabase.com/dashboard');
console.log('   2. Settings > API');
console.log('   3. Copiez la clé "anon public"');
console.log('   4. Remplacez-la dans .env.local');
console.log('   5. Redémarrez le serveur (Ctrl+C puis npm run dev)\n');

