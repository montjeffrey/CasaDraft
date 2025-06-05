const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Function to parse front matter from markdown file
function parseFrontMatter(content) {
    const parts = content.split('---');
    if (parts.length < 3) return null;
    
    try {
        const frontMatter = yaml.load(parts[1]);
        return frontMatter;
    } catch (e) {
        console.error('Error parsing front matter:', e);
        return null;
    }
}

// Function to read all menu items from markdown files
function readMenuItems() {
    const menuDir = path.join(__dirname, '..', '_data', 'menu');
    const files = fs.readdirSync(menuDir);
    
    const menuItems = files
        .filter(file => file.endsWith('.md'))
        .map(file => {
            const content = fs.readFileSync(path.join(menuDir, file), 'utf8');
            return parseFrontMatter(content);
        })
        .filter(item => item !== null);
    
    return menuItems;
}

// Generate menu.json
const menuItems = readMenuItems();
const outputPath = path.join(__dirname, '..', '_data', 'menu.json');
fs.writeFileSync(outputPath, JSON.stringify(menuItems, null, 2));

console.log('Menu JSON file generated successfully!'); 