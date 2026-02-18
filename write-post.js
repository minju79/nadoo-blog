require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Error: Missing keys in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
    console.log('\n📝 === Write a New Blog Post ===');

    try {
        const title = await question('1. Enter Title: ');
        if (!title) throw new Error('Title is required');

        console.log('\n2. Enter Content (You can use HTML tags like <p>, <b>, etc.)');
        console.log('   (Press ENTER twice to finish)');

        let content = '';
        let emptyLines = 0;

        // Simple multi-line input
        for await (const line of rl) {
            if (line.trim() === '') {
                emptyLines++;
                if (emptyLines >= 2) break; // Exit on double enter
            } else {
                if (emptyLines > 0) content += '\n'.repeat(emptyLines);
                emptyLines = 0;
                content += line + '\n';
            }
        }

        // Add default HTML styling wrapper if not present
        if (!content.includes('<div style')) {
            content = `
<div style="font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; font-size: 16px; color: #3c4043;">
    <p style="margin-bottom: 20px;">${content.replace(/\n/g, '<br/>')}</p>
</div>`;
        }

        const excerpt = await question('\n3. Enter Excerpt (Short summary): ');

        const useImage = await question('\n4. Do you want to generate an AI image for this post? (y/n): ');
        let thumbnail_url = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop';

        if (useImage.toLowerCase() === 'y') {
            console.log('   (Skipping AI generation for simple manual tool - using default real estate image for now)');
            // In a full version we could call OpenAI here, but let's keep it simple for now or use the provided API.
        } else {
            const customUrl = await question('   Enter Image URL (or press Enter for default): ');
            if (customUrl) thumbnail_url = customUrl;
        }

        console.log('\n🚀 Publishing your post...');

        // Slug generation
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\u3131-\uD79D]+/g, '-') // Support Korean characters
            .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);

        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    title,
                    content,
                    excerpt: excerpt || content.substring(0, 100) + '...',
                    slug,
                    thumbnail_url,
                    published: true,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('❌ Failed to publish:', error.message);
        } else {
            console.log('✅ Post published successfully!');
            console.log(`🔗 URL: ${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`);
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        rl.close();
        process.exit(0); // Force exit to break the multi-line loop
    }
}

main();
