
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTypo() {
    console.log('🔍 Searching for the typo post...');

    // 1. Find the post with the typo
    // We search for "리뷰 없이" because the user said "리뷰 없이 만들기 앱"
    const { data: posts, error: searchError } = await supabase
        .from('posts')
        .select('*')
        .ilike('title', '%리뷰 없이%');

    if (searchError) {
        console.error('❌ Error searching:', searchError.message);
        return;
    }

    if (!posts || posts.length === 0) {
        console.log('✅ No posts found with that typo. Maybe it was already fixed?');
        return;
    }

    console.log(`🧐 Found ${posts.length} post(s) with the typo.`);

    // 2. Update the post(s)
    for (const post of posts) {
        console.log(`✏️ Fixing post: "${post.title}"`);

        const correctTitle = "[리뷰] 코딩 없이 앱 만들기? 노코드 3대장 (Zapier, Make, n8n) 완벽 비교";

        const { error: updateError } = await supabase
            .from('posts')
            .update({ title: correctTitle })
            .eq('id', post.id);

        if (updateError) {
            console.error(`❌ Failed to update post ${post.id}:`, updateError.message);
        } else {
            console.log(`✅ Successfully updated title to: "${correctTitle}"`);
        }
    }
}

fixTypo();
