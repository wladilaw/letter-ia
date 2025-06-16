const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../../letter-generator');
const targetDir = path.join(__dirname, '../public/letter-generator');

// Créer le dossier de destination s'il n'existe pas
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Copier tous les fichiers HTML
fs.readdirSync(sourceDir).forEach(file => {
    if (file.endsWith('.html')) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copié: ${file}`);
    }
});

// Copier le fichier de configuration
const configSource = path.join(sourceDir, 'config.js');
const configTarget = path.join(targetDir, 'config.js');
if (fs.existsSync(configSource)) {
    fs.copyFileSync(configSource, configTarget);
    console.log('Copié: config.js');
}

console.log('Copie des fichiers HTML terminée !'); 