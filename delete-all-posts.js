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

async function main() {
    console.log('🔍 Fetching ALL posts...');

    // Fetch all posts (up to 1000)
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(1000);

    if (error) {
        console.error('❌ Error fetching posts:', error.message);
        process.exit(1);
    }

    if (!posts || posts.length === 0) {
        console.log('📭 No posts found. Your blog is clean!');
        process.exit(0);
    }

    console.log(`\nFound ${posts.length} posts.`);
    console.log('-----------------------------');
    posts.forEach((post, index) => {
        console.log(`${index + 1}. [${new Date(post.created_at).toLocaleDateString()}] ${post.title}`);
    });
    console.log('-----------------------------');

    // Confirmation
    rl.question(`\n⚠️  WARNING: Do you want to DELETE ALL ${posts.length} posts? \n   Type "DELETE ALL" to confirm: `, async (answer) => {
        if (answer !== 'DELETE ALL') {
            console.log('❌ Deletion cancelled.');
            rl.close();
            return;
        }

        console.log('\n🔥 Deleting posts...');

        // Delete in batches or one by one
        let deletedCount = 0;
        for (const post of posts) {
            const { error: deleteError } = await supabase
                .from('posts')
                .delete()
                .eq('id', post.id);

            if (deleteError) {
                console.error(`❌ Failed to delete "${post.title}":`, deleteError.message);
            } else {
                process.stdout.write('.'); // Progress indicator
                deletedCount++;
            }
        }

        console.log(`\n\n✨ Successfully deleted ${deletedCount} posts.`);
        console.log('Your blog is now a blank canvas for AI news!');
        rl.close();
    });
}

main();
