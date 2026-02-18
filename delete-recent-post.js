require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role for deletion usually, or user auth

if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    console.error('   Please ensure you have these variables set for admin access.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    console.log('🔍 Fetching recent posts...');

    // 1. List recent posts
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, created_at, slug')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('❌ Error fetching posts:', error.message);
        process.exit(1);
    }

    if (!posts || posts.length === 0) {
        console.log('📭 No posts found.');
        process.exit(0);
    }

    console.log('\n===== Recent Blog Posts =====');
    posts.forEach((post, index) => {
        console.log(`${index + 1}. [${new Date(post.created_at).toLocaleDateString()}] ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   ID: ${post.id}`);
        console.log('-----------------------------');
    });

    // 2. Ask user which one(s) to delete
    rl.question('\n🗑️  Enter the number(s) of the post to DELETE (e.g. 1, 3 or 1-5 or all) \n   (or "q" to quit): ', async (answer) => {
        if (answer.toLowerCase() === 'q') {
            console.log('Bye!');
            rl.close();
            return;
        }

        let selectedIndices = [];

        if (answer.toLowerCase() === 'all') {
            selectedIndices = posts.map((_, i) => i);
        } else {
            // Handle ranges (1-3) and commas (1, 3)
            const parts = answer.split(',').map(s => s.trim());

            parts.forEach(part => {
                if (part.includes('-')) {
                    const [start, end] = part.split('-').map(num => parseInt(num));
                    if (!isNaN(start) && !isNaN(end)) {
                        for (let i = start; i <= end; i++) {
                            selectedIndices.push(i - 1);
                        }
                    }
                } else {
                    const index = parseInt(part) - 1;
                    if (!isNaN(index)) {
                        selectedIndices.push(index);
                    }
                }
            });
        }

        // Filter valid indices
        selectedIndices = [...new Set(selectedIndices)].filter(i => i >= 0 && i < posts.length).sort((a, b) => a - b);

        if (selectedIndices.length === 0) {
            console.log('❌ Invalid selection.');
            rl.close();
            return;
        }

        const targetPosts = selectedIndices.map(i => posts[i]);

        console.log('\n⚠️  You are about to delete the following posts:');
        targetPosts.forEach(p => console.log(`   - ${p.title}`));

        rl.question(`\n⚠️  Are you sure you want to delete these ${targetPosts.length} posts? (y/n): `, async (confirm) => {
            if (confirm.toLowerCase() === 'y') {
                process.stdout.write('Deleting... ');

                for (const post of targetPosts) {
                    const { error: deleteError } = await supabase
                        .from('posts')
                        .delete()
                        .eq('id', post.id);

                    if (deleteError) {
                        console.error(`\n❌ Failed to delete "${post.title}":`, deleteError.message);
                    } else {
                        process.stdout.write('✅ ');
                    }
                }
                console.log('\n✨ All operations completed.');
            } else {
                console.log('❌ Deletion cancelled.');
            }
            rl.close();
        });
    });
}

main();
