
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const matter = require('gray-matter'); // We might need to install gray-matter or just parse manually
require('dotenv').config({ path: '.env.local' });

// Install gray-matter if not present: npm install gray-matter
// But to avoid dependency hell, let's use a simple regex parser if user doesn't want to install more.
// For now, I'll assume simple parsing or ask user to install gray-matter. 
// Let's us simple parsing to be robust.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 📂 Configuration: Folder to scan for markdown files
// Default: Look for a folder named "publish_queue" in the project root
const PUBLISH_DIR = path.join(__dirname, '..', 'publish_queue');

async function publishObsidianNotes() {
    console.log(`📂 Scanning for markdown files in: ${PUBLISH_DIR}`);

    if (!fs.existsSync(PUBLISH_DIR)) {
        console.log(`⚠️ Folder not found. Creating it now...`);
        fs.mkdirSync(PUBLISH_DIR);
        console.log(`✅ Folder created! Put your Obsidian .md files here to publish.`);
        return;
    }

    const files = fs.readdirSync(PUBLISH_DIR).filter(file => file.endsWith('.md'));

    if (files.length === 0) {
        console.log('📭 No markdown files found to publish.');
        return;
    }

    console.log(`🚀 Found ${files.length} files. Starting publish process...`);

    for (const file of files) {
        const filePath = path.join(PUBLISH_DIR, file);
        const contentRaw = fs.readFileSync(filePath, 'utf8');

        // Simple Frontmatter Parser
        const parts = contentRaw.split(/^---$/gm);
        let content = contentRaw;
        let title = file.replace('.md', '');
        let slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w\uAC00-\uD7A3-]/g, '');
        let category = "Thinking"; // Default category
        let excerpt = "";

        if (parts.length >= 3) {
            // Has frontmatter
            const frontmatter = parts[1];
            content = parts.slice(2).join('---').trim();

            // Extract metadata via Regex
            const titleMatch = frontmatter.match(/title:\s*(.+)/);
            if (titleMatch) title = titleMatch[1].trim().replace(/^['"]|['"]$/g, '');

            const slugMatch = frontmatter.match(/slug:\s*(.+)/);
            if (slugMatch) slug = slugMatch[1].trim();

            const categoryMatch = frontmatter.match(/category:\s*(.+)/);
            if (categoryMatch) category = categoryMatch[1].trim();

            const excerptMatch = frontmatter.match(/excerpt:\s*(.+)/);
            if (excerptMatch) excerpt = excerptMatch[1].trim();
        }

        // Convert Obsidian Image Links ![[image.png]] to standard MD or remove?
        // For now, simple cleanup.
        content = content.replace(/!\[\[(.*?)\]\]/g, '(Image: $1)');

        console.log(`Processing: ${title}...`);

        // Check for duplicate
        const { data: existing } = await supabase
            .from('posts')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existing) {
            console.log(`⚠️ Post already exists: ${title} (Skipping structure check)`);
        }

        const { error } = await supabase
            .from('posts')
            .upsert({
                title,
                slug,
                content: `<div class="markdown-body">${content.replace(/\n/g, '<br>')}</div>`, // Simple HTML conversion
                excerpt: excerpt || content.substring(0, 150) + "...",
                category,
                published: true,
                thumbnail_url: "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1000&auto=format&fit=crop" // Default Obsidian-like abstract image
            }, { onConflict: 'slug' });

        if (error) {
            console.error(`❌ Failed to publish ${title}:`, error.message);
        } else {
            console.log(`✅ Published: ${title}`);
            // Move processed file? Or leave it?
            // fs.renameSync(filePath, path.join(PUBLISH_DIR, 'processed', file)); // Optional
        }
    }
}

publishObsidianNotes();
