
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deletePost() {
    console.log('🗑️ Searching for the "Reviews" post to delete...');

    // Search for the post with the typo or the corrected title containing "리뷰"
    // We will be broad to catch it. Use 'ilike' for case-insensitive matching.
    const { data: posts, error: searchError } = await supabase
        .from('posts')
        .select('*')
        .or('title.ilike.%리뷰 없이%,title.ilike.%[리뷰]%');

    if (searchError) {
        console.error('❌ Error searching:', searchError.message);
        return;
    }

    if (!posts || posts.length === 0) {
        console.log('✅ No posts found. It might have been already deleted.');
        return;
    }

    console.log(`🧐 Found ${posts.length} post(s) to delete.`);

    for (const post of posts) {
        console.log(`❌ Deleting post: "${post.title}"`);

        const { error: deleteError } = await supabase
            .from('posts')
            .delete()
            .eq('id', post.id);

        if (deleteError) {
            console.error(`❌ Failed to delete post ${post.id}:`, deleteError.message);
        } else {
            console.log(`✅ Successfully deleted post: "${post.title}"`);
        }
    }
}

deletePost();
