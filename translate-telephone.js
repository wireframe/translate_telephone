const translate = require('@vitalets/google-translate-api');

async function translateTelephone(text, startLanguage = 'en') {
    let currentText = text;
    let currentLang = startLanguage;
    
    // Languages to cycle through
    const languages = ['fr', 'de', 'es', 'ja', 'ru', 'ko', 'it'];
    
    console.log(`\nOriginal text (${startLanguage}): ${text}`);
    
    // Translate through each language
    for (const lang of languages) {
        try {
            // Translate to next language
            const translation = await translate(currentText, { 
                from: currentLang, 
                to: lang 
            });
            
            currentText = translation.text;
            currentLang = lang;
            
            console.log(`Translated to ${lang}: ${currentText}`);
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.error(`Error translating to ${lang}:`, error.message);
            continue;
        }
    }
    
    // Translate back to original language
    try {
        const finalTranslation = await translate(currentText, {
            from: currentLang,
            to: startLanguage
        });
        
        console.log(`\nFinal translation (${startLanguage}): ${finalTranslation.text}`);
        return finalTranslation.text;
        
    } catch (error) {
        console.error(`Error translating back to ${startLanguage}:`, error.message);
        return null;
    }
}

// Command line interface
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Welcome to Translate Telephone!");
console.log("Enter a phrase and watch it transform as it's translated through multiple languages.");

function askForPhrase() {
    readline.question('\nEnter your phrase (or "q" to quit): ', async (text) => {
        if (text.toLowerCase() === 'q') {
            readline.close();
            return;
        }
        
        await translateTelephone(text);
        askForPhrase();
    });
}

askForPhrase(); 