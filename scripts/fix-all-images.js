
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 🤖 Curated High-Quality AI & Robot Images (Verified URLs)
const SAFE_IMAGES = [
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", // Cool AI Brain/Chip (Blue/Purple)
    "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1000&auto=format&fit=crop", // Friendly Humanoid Robot Hand
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop", // Cute White Robot Face (Wall-E vibe)
    "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1000&auto=format&fit=crop", // VR/AR Abstract (Futuristic)
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop", // ChatGPT / AI Abstract Art
    "https://images.unsplash.com/photo-1589254065878-42c9da9e2f58?q=80&w=1000&auto=format&fit=crop", // Small Cute Robot on Desk
    "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1000&auto=format&fit=crop"  // Tech Dashboard / Analytics
];

async function fixAllImages() {
    console.log('🎨 Starting Global Image Cleanup...');

    // 1. Get all posts
    const { data: posts, error: searchError } = await supabase
        .from('posts')
        .select('*');

    if (searchError) {
        console.error('❌ Error fetching posts:', searchError.message);
        return;
    }

    console.log(`🧐 Found ${posts.length} posts. Checking images...`);

    // 2. Update each post with a random safe image
    for (const post of posts) {
        // Pick a random image from the safe list
        const randomImage = SAFE_IMAGES[Math.floor(Math.random() * SAFE_IMAGES.length)];

        console.log(`🖼️ Updating image for: "${post.title}"`);

        const { error: updateError } = await supabase
            .from('posts')
            .update({ thumbnail_url: randomImage })
            .eq('id', post.id);

        if (updateError) {
            console.error(`❌ Failed to update post ${post.id}:`, updateError.message);
        } else {
            console.log(`✅ Changed to safe image!`);
        }
    }

    console.log('✨ All images have been sanitized!');
}

fixAllImages();
