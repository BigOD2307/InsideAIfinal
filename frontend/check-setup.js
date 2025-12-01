// Script de vérification de la configuration
const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration...\n');

const envPath = path.join(__dirname, '.env.local');
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'OPENAI_API_KEY',
  'OPENAI_ASSISTANT_CHAT_ID',
];

// Vérifier si .env.local existe
if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env.local manquant\n');
  console.log('📝 Créez un fichier .env.local avec :\n');
  console.log('NEXT_PUBLIC_SUPABASE_URL=votre_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle');
  console.log('OPENAI_API_KEY=sk-...');
  console.log('OPENAI_ASSISTANT_CHAT_ID=asst_...');
  console.log('OPENAI_ASSISTANT_VEILLE_ID=asst_...');
  console.log('OPENAI_ASSISTANT_COMMUNAUTE_ID=asst_...');
  console.log('NEXT_PUBLIC_APP_URL=http://localhost:3000\n');
  process.exit(1);
}

// Charger les variables
require('dotenv').config({ path: envPath });

let allGood = true;

// Vérifier chaque variable
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.log(`❌ ${varName} manquant`);
    allGood = false;
  } else {
    console.log(`✅ ${varName} configuré`);
  }
});

// Vérifier les IDs des assistants optionnels
const optionalVars = [
  'OPENAI_ASSISTANT_VEILLE_ID',
  'OPENAI_ASSISTANT_COMMUNAUTE_ID',
];

optionalVars.forEach(varName => {
  if (!process.env[varName]) {
    console.log(`⚠️  ${varName} manquant (optionnel)`);
  } else {
    console.log(`✅ ${varName} configuré`);
  }
});

if (allGood) {
  console.log('\n✅ Configuration complète ! Vous pouvez lancer l\'app avec : npm run dev');
} else {
  console.log('\n❌ Configuration incomplète. Vérifiez votre fichier .env.local');
  process.exit(1);
}

