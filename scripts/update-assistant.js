const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../frontend/.env.local' }); // Ajustez le chemin selon où vous lancez le script

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = 'asst_d0dP7bYg4s6AqmUWopE4UQba'; // Votre ID

if (!OPENAI_API_KEY) {
    console.error('❌ ERREUR: OPENAI_API_KEY manquante dans le fichier .env.local');
    process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function updateAssistant() {
    try {
        console.log(`🔄 Connexion à OpenAI pour mettre à jour l'assistant ${ASSISTANT_ID}...`);

        // Lire le prompt
        const promptPath = path.join(__dirname, '../COACH_ELLA_SYSTEM_PROMPT.md');
        const instructions = fs.readFileSync(promptPath, 'utf8');

        console.log('📖 Fichier de prompt lu avec succès.');

        // Mettre à jour l'assistant
        const myAssistant = await openai.beta.assistants.update(
            ASSISTANT_ID,
            {
                instructions: instructions,
                name: "Coach Ella (InsideAI)",
                model: "gpt-4-turbo-preview", // Ou gpt-4o si dispo sur votre compte
                tools: [{ type: "code_interpreter" }, { type: "file_search" }] // On active les outils utiles
            }
        );

        console.log('✅ Assistant mis à jour avec succès !');
        console.log(`👉 Nom: ${myAssistant.name}`);
        console.log(`👉 Modèle: ${myAssistant.model}`);
        console.log(`👉 Instructions (extrait): ${myAssistant.instructions.substring(0, 100)}...`);

    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour :', error);
    }
}

updateAssistant();

