// Script de vérification de la configuration
const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration...\n');

const envPath = path.join(__dirname, '.env.local');

// Vérifier si .env.local existe
if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env.local manquant!\n');
  console.log('📝 Créez le fichier avec: node setup-env.js\n');
  process.exit(1);
}

// Lire le fichier
const envContent = fs.readFileSync(envPath, 'utf-8');

// Vérifier les variables
const checks = {
  supabaseUrl: envContent.includes('NEXT_PUBLIC_SUPABASE_URL=https://eefbnycxaheylwycqhez.supabase.co'),
  supabaseKey: envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=') && 
               !envContent.includes('REMPLACEZ_PAR_VOTRE_CLE_ANON_SUPABASE') &&
               !envContent.includes('placeholder'),
  openaiKey: envContent.includes('OPENAI_API_KEY=sk-'),
  chatAssistant: envContent.includes('OPENAI_ASSISTANT_CHAT_ID=asst_'),
};

console.log('📋 Résultats de la vérification:\n');

let allGood = true;

if (checks.supabaseUrl) {
  console.log('✅ Supabase URL configurée');
} else {
  console.log('❌ Supabase URL manquante ou incorrecte');
  allGood = false;
}

if (checks.supabaseKey) {
  console.log('✅ Supabase Anon Key configurée');
} else {
  console.log('❌ Supabase Anon Key manquante ou placeholder');
  console.log('   👉 Consultez GET_SUPABASE_KEY.md pour obtenir votre clé');
  allGood = false;
}

if (checks.openaiKey) {
  console.log('✅ OpenAI API Key configurée');
} else {
  console.log('❌ OpenAI API Key manquante');
  allGood = false;
}

if (checks.chatAssistant) {
  console.log('✅ Assistant Chat ID configuré');
} else {
  console.log('⚠️  Assistant Chat ID manquant (optionnel)');
}

console.log('\n' + '='.repeat(50) + '\n');

if (allGood) {
  console.log('✅ Configuration complète!');
  console.log('\n📝 Prochaines étapes:');
  console.log('   1. Vérifiez que les migrations SQL sont exécutées dans Supabase');
  console.log('   2. Vérifiez que la confirmation d\'email est désactivée (développement)');
  console.log('   3. Redémarrez le serveur: npm run dev');
  console.log('\n🐛 Si l\'inscription ne fonctionne toujours pas:');
  console.log('   - Ouvrez la console du navigateur (F12)');
  console.log('   - Regardez les erreurs dans l\'onglet Console');
  console.log('   - Consultez TROUBLESHOOTING.md');
} else {
  console.log('❌ Configuration incomplète');
  console.log('\n📝 Actions requises:');
  if (!checks.supabaseKey) {
    console.log('   1. Obtenez votre clé Supabase (voir GET_SUPABASE_KEY.md)');
    console.log('   2. Mettez à jour .env.local avec la clé');
  }
  console.log('   3. Redémarrez le serveur après modification');
}

