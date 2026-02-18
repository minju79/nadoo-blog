
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration
const OBSIDIAN_PATH = String.raw`c:\Users\samsung\OneDrive\바탕 화면\옵시디언`;
const PUBLISH_TAG = '#publish'; // Only publish files with this tag
const VALID_EXTENSIONS = ['.md'];

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function publishFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        // Simple Frontmatter Parser (between ---)
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        let title = path.basename(filePath, '.md');
        let category = 'Thinking'; // Default category
        let slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\uAC00-\uD7A3-]/g, '');
        let cleanContent = content;
        let thumbnail_url = '';

        if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            cleanContent = content.replace(frontmatterMatch[0], '').trim();

            // Extract metadata from frontmatter
            const titleMatch = frontmatter.match(/title:\s*(.*)/);
            if (titleMatch) title = titleMatch[1].trim();

            const categoryMatch = frontmatter.match(/category:\s*(.*)/);
            if (categoryMatch) category = categoryMatch[1].trim();

            const slugMatch = frontmatter.match(/slug:\s*(.*)/);
            if (slugMatch) slug = slugMatch[1].trim();

            const imageMatch = frontmatter.match(/image:\s*(.*)/);
            if (imageMatch) thumbnail_url = imageMatch[1].trim();
        }

        // Check for #publish tag if strict mode
        // if (!content.includes(PUBLISH_TAG)) return;

        console.log(`📤 Publishing: ${title} (${slug})`);

        // Check if exists
        const { data: existing } = await supabase
            .from('posts')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existing) {
            // Update
            const { error } = await supabase
                .from('posts')
                .update({
                    title,
                    content: cleanContent, // TODO: Convert Markdown to HTML if needed, or render Markdown on frontend
                    category,
                    published: true,
                    updated_at: new Date().toISOString()
                })
                .eq('slug', slug);

            if (error) console.error(`❌ Update failed for ${title}:`, error.message);
            else console.log(`✅ Updated: ${title}`);

        } else {
            // Insert
            const { error } = await supabase
                .from('posts')
                .insert({
                    title,
                    slug,
                    content: cleanContent,
                    category,
                    published: true,
                    thumbnail_url
                });

            if (error) console.error(`❌ Insert failed for ${title}:`, error.message);
            else console.log(`🎉 Created: ${title}`);
        }

    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

async function scanDirectory(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (file.startsWith('.')) continue; // Skip hidden folders
            await scanDirectory(fullPath);
        } else if (stat.isFile() && VALID_EXTENSIONS.includes(path.extname(file))) {
            // Logic to determine if we should publish this file
            // For now, let's look for a specific folder or tag
            // Example: Only publish files in "03-Snippets" or "Published" folder
            if (fullPath.includes('03-Snippets') || fullPath.includes('Published')) {
                await publishFile(fullPath);
            }
        }
    }
}

console.log(`🚀 Starting Obsidian Sync from: ${OBSIDIAN_PATH}`);
scanDirectory(OBSIDIAN_PATH);
