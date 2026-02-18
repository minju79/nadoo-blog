require('dotenv').config({ path: '.env.local' });
const Parser = require('rss-parser');
const OpenAI = require('openai');

const RSS_URL = 'https://news.google.com/rss/search?q=%EB%B6%80%EB%8F%99%EC%82%B0+(%EC%84%B8%EA%B8%88+OR+%EC%A0%95%EC%B1%85+OR+%EC%A0%84%EB%A7%9D+OR+%EC%9E%AC%EA%B1%B4%EC%B6%95)+when:1d&hl=ko&gl=KR&ceid=KR:ko';
const BLOG_API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nadoo-blog.vercel.app';
const CRON_SECRET = process.env.CRON_SECRET;

if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY is not defined in .env.local');
    process.exit(1);
}

if (!CRON_SECRET) {
    console.error('❌ Error: CRON_SECRET is not defined in .env.local');
    process.exit(1);
}

const parser = new Parser();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateAndPost() {
    try {
        console.log('📰 Fetching real estate news...');
        const feed = await parser.parseURL(RSS_URL);

        if (!feed.items || feed.items.length === 0) {
            console.log('⚠️ No news found.');
            return;
        }

        // Pick top news item
        const newsItem = feed.items[0];
        console.log(`✅ Found news: ${newsItem.title}`);

        console.log('🤖 Generating blog post with OpenAI...');
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `당신은 대한민국 최고의 부동산 전문 블로거입니다. 
          주어진 뉴스 기사를 바탕으로 가독성 좋은 HTML 포스팅을 작성하세요.
          
          [스타일 가이드 - 반드시 준수할 것]
          글을 작성할 때 다음 HTML 구조와 인라인 스타일을 그대로 사용하세요.

          1. **전체 컨테이너**:
             <div style="font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; font-size: 16px; box-sizing: border-box; color: #3c4043;">

          2. **요약 박스**: (글 시작 부분에 뉴스 핵심 요약 3줄)
             <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; font-style: italic; margin-bottom: 25px; font-size: 15px;">
               <p style="margin-bottom: 0;">(여기에 핵심 요약 내용 작성)</p>
             </div>

          3. **소제목 스타일**: (Gradient 효과 적용)
             <h2 style="font-size: 22px; color: white; background: linear-gradient(to right, #1a73e8, #004d99); margin: 30px 0 15px; border-radius: 10px; padding: 10px 25px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2); font-weight: bold; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
               (소제목 내용)
             </h2>

          4. **본문 텍스트**:
             <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.6; color: #3c4043;">
               (본문 내용)
             </p>

          5. **강조 박스**: (중요한 내용이나 팁)
             <div style="background-color: #f8f9fa; border-left: 4px solid #1a73e8; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
               (강조할 내용)
             </div>

          6. **자주 묻는 질문 (FAQ)**: (글 마지막에 관련 질문 3개 추가)
             <div style="margin-bottom: 15px;">
               <h3 style="font-size: 18px; color: #3c4043; margin-bottom: 5px;">Q: (질문)</h3>
               <p style="margin-bottom: 20px; font-size: 16px;">A: (답변)</p>
             </div>

          7. **해시태그**: (글 맨 마지막에 관련 태그 10개)
             <p style="color: #5f6368; font-size: 14px;">#부동산 #뉴스 #(관련태그)...</p>
             </div> (전체 컨테이너 닫기)

          [작성 규칙]
          - 뉴스 내용을 바탕으로 풍부하고 전문적인 인사이트를 제공하세요.
          - 문체는 "습니다/합니다"의 정중하고 신뢰감 있는 어조를 사용하세요.
          - 모든 내용은 HTML 태그로 감싸져야 합니다. (Markdown 사용 금지)`
                },
                {
                    role: "user",
                    content: `뉴스 제목: ${newsItem.title}\n뉴스 링크: ${newsItem.link}\n뉴스 내용: ${newsItem.contentSnippet || newsItem.content}\n\n위 뉴스를 바탕으로 위 스타일 가이드에 맞춰 완벽한 블로그 글을 작성해줘.`
                }
            ],
            model: "gpt-4o",
        });

        let aiContent = completion.choices[0].message.content;

        // Remove markdown code blocks if present
        aiContent = aiContent.replace(/^```html\s*/, '').replace(/```\s*$/, '');

        const aiTitle = aiContent.match(/<h2>(.*?)<\/h2>/)?.[1] || newsItem.title; // Extract title from h2 if possible

        // 3. Image Generation (DALL-E 3)
        console.log('🎨 Generating thumbnail with DALL-E 3...');
        let imageUrl = "";
        try {
            const imageResponse = await openai.images.generate({
                model: "dall-e-3",
                prompt: `A professional, modern, and high-quality digital illustration for a real estate blog post titled "${newsItem.title}". The style should be clean, isometric 3D, or high-end vector art. Blue and white color scheme. No text.`,
                n: 1,
                size: "1024x1024",
            });
            imageUrl = imageResponse.data[0].url;
            console.log('✅ Image generated!');
        } catch (imgError) {
            console.error('⚠️ Image generation failed, using default:', imgError.message);
            // Fallback or leave empty
            imageUrl = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"; // Real estate fallback
        }

        console.log('🚀 Publishing to Nadoo Blog...');

        // We send to the Next.js API route we created earlier
        const response = await fetch(`${BLOG_API_URL}/api/cron/create-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CRON_SECRET}`
            },
            body: JSON.stringify({
                title: aiTitle,
                content: aiContent.replace(/<h2>.*?<\/h2>/, ''), // Remove title from content body if it was extracted
                thumbnail_url: imageUrl,
                published: true
            })
        });

        const result = await response.json();

        if (response.ok) {
            console.log('🎉 Successfully published blog post!');
            console.log(`🔗 Link: ${BLOG_API_URL}/blog/${result.post?.slug || ''}`);
        } else {
            console.error('❌ Failed to publish:', result);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

generateAndPost();
