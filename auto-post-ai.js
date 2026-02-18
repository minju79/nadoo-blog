const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const Parser = require('rss-parser');
const OpenAI = require('openai');

// AI News RSS (Keywords: AI, Artificial Intelligence, ChatGPT, LLM)
const RSS_URL = 'https://news.google.com/rss/search?q=AI+%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5+(ChatGPT+OR+LLM+OR+%EC%83%9D%EC%84%B1%ED%98%95)+when:1d&hl=ko&gl=KR&ceid=KR:ko';
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
        console.log('📰 Fetching AI news...');
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
                    content: `당신은 대한민국 최고의 AI 트렌드 분석가이자 '나두AI'의 에디터입니다.
          주어진 AI 뉴스 기사를 바탕으로 일반인도 이해하기 쉬운 블로그 포스팅을 작성하세요.
          
          [스타일 가이드 - 반드시 준수할 것]
          글을 작성할 때 다음 HTML 구조와 인라인 스타일을 그대로 사용하세요.

          1. **전체 컨테이너**:
             <div style="font-family: 'Pretendard', 'Noto Sans KR', sans-serif; line-height: 1.7; max-width: 800px; margin: 0 auto; font-size: 16px; color: #333;">

          2. **요약 박스** (핵심 3줄 요약):
             <div style="background-color: #f0f7ff; padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #d0e3ff;">
               <strong style="display:block; margin-bottom:10px; color:#0052cc;">⚡ 바쁘신 분들을 위한 3줄 요약</strong>
               <ul style="margin: 0; padding-left: 20px; color: #444;">(요약 내용 리스트)</ul>
             </div>

          3. **소제목 스타일**:
             <h2 style="font-size: 24px; color: #111; margin: 40px 0 15px; font-weight: 700; border-bottom: 2px solid #0052cc; padding-bottom: 10px; display: inline-block;">
               (소제목 내용)
             </h2>

          4. **본문 텍스트**:
             <p style="margin-bottom: 15px; font-size: 17px; line-height: 1.7; color: #333;">
               (본문 내용)
             </p>

          5. **인사이트 박스** (나두AI의 시선):
             <div style="background-color: #fff8e1; border-left: 5px solid #ffc107; padding: 20px; margin: 30px 0; border-radius: 4px;">
               <strong style="display:block; margin-bottom:10px; color:#b08800;">💡 나두AI의 인사이트</strong>
               (뉴스에 대한 분석과 앞으로의 전망, 또는 돈이 되는 기회에 대한 설명)
             </div>

          6. **해시태그**:
             <p style="color: #888; font-size: 14px; margin-top: 50px;">#인공지능 #AI뉴스 #나두AI #ChatGPT #(관련키워드)</p>
             </div>

          [작성 규칙]
          - 전문 용어는 쉽게 풀어서 설명하세요.
          - 긍정적이고 미래 지향적인 어조를 유지하세요.
          - 이 기술이 우리 삶이나 비즈니스에 어떤 영향을 미치는지 꼭 언급하세요.`
                },
                {
                    role: "user",
                    content: `뉴스 제목: ${newsItem.title}\n뉴스 링크: ${newsItem.link}\n뉴스 내용: ${newsItem.contentSnippet || newsItem.content}\n\n위 뉴스를 바탕으로 위 스타일 가이드에 맞춰 완벽한 AI 블로그 글을 작성해줘.`
                }
            ],
            model: "gpt-4o",
        });

        let aiContent = completion.choices[0].message.content;

        // Remove markdown code blocks if present
        aiContent = aiContent.replace(/^```html\s*/, '').replace(/```\s*$/, '');

        const aiTitle = aiContent.match(/<h2>(.*?)<\/h2>/)?.[1] || newsItem.title;

        // 3. Image Generation (DALL-E 3)
        console.log('🎨 Generating thumbnail with DALL-E 3...');
        let imageUrl = "";
        try {
            const imageResponse = await openai.images.generate({
                model: "dall-e-3",
                prompt: `A futuristic, high-tech, minimal digital illustration representing "${newsItem.title}". 
                Style: 3D render, isometric, glassmorphism, glowing blue and purple neon accents, clean white background. 
                Focus on AI, technology, and innovation. No text.`,
                n: 1,
                size: "1024x1024",
            });
            imageUrl = imageResponse.data[0].url;
            console.log('✅ Image generated!');
        } catch (imgError) {
            console.error('⚠️ Image generation failed, using default:', imgError.message);
            imageUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop"; // AI Fallback image
        }

        console.log('🚀 Publishing to Nadoo Blog...');

        const response = await fetch(`${BLOG_API_URL}/api/cron/create-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CRON_SECRET}`
            },
            body: JSON.stringify({
                title: `[AI 속보] ${aiTitle}`, // Add prefix
                content: aiContent.replace(/<h2>.*?<\/h2>/, ''),
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
