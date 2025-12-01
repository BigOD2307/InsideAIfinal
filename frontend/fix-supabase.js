// Script pour mettre à jour la clé Supabase dans .env.local
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env.local');

console.log('🔧 Mise à jour de la clé Supabase\n');

// Vérifier si le fichier existe
if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env.local introuvable!');
  console.log('📝 Exécutez d\'abord: node setup-env.js');
  process.exit(1);
}

// Lire le fichier actuel
let envContent = fs.readFileSync(envPath, 'utf-8');

// Vérifier si la clé est déjà configurée
if (!envContent.includes('REMPLACEZ_PAR_VOTRE_CLE_ANON_SUPABASE')) {
  console.log('✅ La clé Supabase semble déjà configurée dans .env.local');
  console.log('\n⚠️  Si l\'application ne fonctionne toujours pas:');
  console.log('   1. Vérifiez que vous avez redémarré le serveur (Ctrl+C puis npm run dev)');
  console.log('   2. Vérifiez que les migrations SQL sont exécutées dans Supabase');
  console.log('   3. Ouvrez la console du navigateur (F12) pour voir les erreurs');
  process.exit(0);
}

console.log('📝 Entrez votre clé Supabase Anon Key:');
console.log('   (Vous pouvez la trouver dans Supabase > Settings > API > anon public)');
console.log('   (La clé commence généralement par: eyJ...)\n');

rl.question('Clé Supabase Anon Key: ', (key) => {
  if (!key || key.trim().length === 0) {
    console.log('❌ Clé vide. Opération annulée.');
    rl.close();
    process.exit(1);
  }

  // Nettoyer la clé (enlever les espaces)
  const cleanKey = key.trim();

  // Vérifier le format basique
  if (!cleanKey.startsWith('eyJ') && !cleanKey.startsWith('ey')) {
    console.log('⚠️  Attention: La clé ne semble pas avoir le bon format.');
    console.log('   Les clés Supabase commencent généralement par "eyJ..."');
    console.log('   Continuez quand même? (o/n)');
    
    rl.question('', (answer) => {
      if (answer.toLowerCase() !== 'o' && answer.toLowerCase() !== 'oui' && answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('❌ Opération annulée.');
        rl.close();
        process.exit(1);
      }
      updateKey(cleanKey);
    });
  } else {
    updateKey(cleanKey);
  }
});

function updateKey(key) {
  // Remplacer la clé dans le fichier
  const updatedContent = envContent.replace(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=REMPLACEZ_PAR_VOTRE_CLE_ANON_SUPABASE',
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${key}`
  );

  // Sauvegarder
  try {
    fs.writeFileSync(envPath, updatedContent);
    console.log('\n✅ Clé Supabase mise à jour avec succès!\n');
    console.log('📋 Prochaines étapes:');
    console.log('   1. ⚠️  IMPORTANT: Redémarrez le serveur Next.js');
    console.log('      - Arrêtez le serveur (Ctrl+C)');
    console.log('      - Relancez: npm run dev');
    console.log('   2. Vérifiez que les migrations SQL sont exécutées dans Supabase');
    console.log('   3. Testez l\'inscription à nouveau\n');
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error.message);
    rl.close();
    process.exit(1);
  }

  rl.close();
}

