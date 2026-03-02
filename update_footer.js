const fs = require('fs');
const path = require('path');

const dir = 'c:\\Site Avocat';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // 1) Remove old text from footer-bottom
    content = content.replace(/Mentions légales\s*:\s*Éditeur du site\s*:\s*Cabinet Cressent\.\s*Hébergement\s*:\s*Netlify\./g, '');
    content = content.replace(/<a href="mentions-legales\.html" style="color: #[0-9a-fA-F]+; text-decoration: none;">Mentions légales<\/a>/g, '');
    
    // 2) Add the button in the first column under Cabinet Cressent
    const searchRegex = /Avocat au Barreau de Versailles\. Une défense rigoureuse et humaine pour tous vos litiges\.\s*<\/p>/g;
    
    const replacement = `Avocat au Barreau de Versailles. Une défense rigoureuse et humaine pour tous vos litiges.
                    </p>
                    <div style="margin-top: 20px;">
                        <a href="mentions-legales.html" class="btn btn-outline btn-sm" style="color: white; border-color: rgba(255,255,255,0.4); padding: 8px 16px; font-size: 0.85rem; border-radius: 4px; display: inline-block;">Mentions légales</a>
                    </div>`;

    if (!content.includes('Mentions légales</a>\n                    </div>') && !content.includes('Mentions légales</a>\r\n                    </div>')) {
        content = content.replace(searchRegex, replacement);
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
});
console.log('Update complete.');
