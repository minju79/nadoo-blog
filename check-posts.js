const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const { createClient } = require('@supabase/supabase-js');

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Error: Missing keys in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkPosts() {
    console.log('🔍 Checking Supabase for recent posts...');

    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('❌ Error fetching posts:', error.message);
        return;
    }

    if (!posts || posts.length === 0) {
        console.log('📭 No posts found in the database.');
    } else {
        console.log(`✅ Found ${posts.length} posts:`);
        posts.forEach(p => {
            console.log(`\n- Title: ${p.title}`);
            console.log(`  Slug: ${p.slug}`);
            console.log(`  Created: ${p.created_at}`);
            console.log(`  Published: ${p.published}`);
        });
    }
}

checkPosts();
