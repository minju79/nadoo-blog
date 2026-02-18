
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteOldPosts() {
    console.log('🗑️ Deleting old "Yonhap News" posts...');

    // 1. Find posts to delete (containing '연합뉴스')
    const { data: posts, error: fetchError } = await supabase
        .from('posts')
        .select('id, title')
        .ilike('title', '%연합뉴스%');

    if (fetchError) {
        console.error('❌ Error fetching posts:', fetchError.message);
        return;
    }

    if (!posts || posts.length === 0) {
        console.log('✅ No old posts found.');
        return;
    }

    console.log(`🔍 Found ${posts.length} posts to delete.`);

    // 2. Delete them
    const idsToDelete = posts.map(p => p.id);
    const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .in('id', idsToDelete);

    if (deleteError) {
        console.error('❌ Error deleting posts:', deleteError.message);
    } else {
        console.log('🎉 Successfully deleted old posts!');
        posts.forEach(p => console.log(` - Deleted: ${p.title}`));
    }
}

deleteOldPosts();
