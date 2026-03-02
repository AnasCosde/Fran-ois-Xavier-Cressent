const fs = require('fs');
const path = require('path');

const dir = 'c:\\Site Avocat';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const fullPath = path.join(dir, file);
    const content = fs.readFileSync(fullPath, 'utf8');

    try {
        // Reverse the Latin1-to-UTF8 mojibake
        const fixedContent = Buffer.from(content, 'latin1').toString('utf8');

        // Let's do a safety check: if the fixed content has "" (replacement character),
        // it means the file wasn't strictly doubly-encoded, or it had mixed encoding.
        if (fixedContent.includes('')) {
            console.log(`Warning: ${file} might have mixed encoding or couldn't be fully recovered.`);
        }

        fs.writeFileSync(fullPath, fixedContent, 'utf8');
        console.log(`Fixed ${file}`);
    } catch (e) {
        console.error(`Error fixing ${file}:, e`);
    }
});
