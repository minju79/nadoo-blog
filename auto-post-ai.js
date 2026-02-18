const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const Parser = require('rss-parser');
const OpenAI = require('openai');

// AI News RSS (Keywords: AI, Artificial Intelligence, ChatGPT, LLM)
const RSS_URL = 'https://news.google.com/rss/search?q=AI+%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5+(ChatGPT+OR+LLM+OR+%EC%83%9D%EC%84%B1%ED%98%95)+when:1d&hl=ko&gl=KR&ceid=KR:ko';
const BLOG_API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nadoo-blog.vercel.app';
const CRON_SECRET = process.env.CRON_SECRET;

// 🛒 Coupang Partners / Ad Configuration
const COUPANG_AD_HTML = \`
<div style="margin: 40px 0; padding: 20px; border: 1px solid #e1e4e6; border-radius: 12px; background-color: #fafafa;">
    <p style="font-size: 14px; font-weight: bold; color: #555; margin-bottom: 15px; border-bottom: 2px solid #333; display: inline-block; padding-bottom: 5px;">🔥 에디터 추천 AI 장비</p>
    <a href="https://link.coupang.com/a/dNV9Gc" target="_blank" rel="noopener" style="display: flex; text-decoration: none; color: #333; align-items: center; gap: 20px;">
        <div style="flex-shrink: 0; width: 100px; height: 100px; border-radius: 8px; overflow: hidden; border: 1px solid #eee; background: white;">
            <img src="https://img1c.coupangcdn.com/image/affiliate/banner/937c1cc6669af1e26125a8cc0fe55dc3@2x.jpg" alt="Recommended Device" style="width: 100%; height: 100%; object-fit: contain;">
        </div>
        <div style="flex: 1;">
            <p style="font-size: 16px; font-weight: 600; line-height: 1.4; margin: 0 0 8px 0; color: #111; word-break: keep-all;">삼성전자 갤럭시북5 프로 360 (AI 작업 최적화)</p>
            <span style="font-size: 13px; color: #666;">강력한 성능으로 AI 코딩과 디자인 작업을 쾌적하게.</span>
            <div style="margin-top: 10px;">
               <span style="padding: 6px 12px; background-color: #e11d48; color: white; border-radius: 4px; font-size: 12px; font-weight: bold;">최저가 보기 ▶</span>
            </div>
        </div>
    </a>
    <p style="text-align: right; font-size: 11px; color: #aaa; margin-top: 10px;">이 링크를 통해 구매 시 쿠팡 파트너스 활동으로 일정 수수료를 지원받습니다.</p>
</div>
\`;

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

        // Clean Title
        let cleanTitle = newsItem.title;
        const lastDashIndex = cleanTitle.lastIndexOf(' - ');
        if (lastDashIndex !== -1) {
            cleanTitle = cleanTitle.substring(0, lastDashIndex);
        }

        console.log(`✅ Found news: ${ newsItem.title } `);

        console.log('🤖 Generating blog post with OpenAI...');
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `당신은 대한민국 1위 AI 비즈니스 컨설턴트이자 '나두AI'의 수석 에디터입니다.
          단순한 뉴스 요약이 아니라, 독자(비즈니스맨, 직장인)에게 "진짜 도움되는 인사이트"를 주는 고퀄리티 컬럼을 작성하세요.
          
          [필수 스타일 가이드 - 티스토리 파워블로거 스타일]
          글을 작성할 때 다음 HTML 구조와 인라인 스타일을 그대로 사용하세요.

          1. ** 전반적인 톤앤매너 **:
- 문체: "~습니다/합니다"의 정중하면서도 확신에 찬 전문가 어조.
          - 가독성: 문단은 짧게 끊고, 중요한 부분은 볼드체(<strong>) 처리.
          - 구성: 서론(흥미 유발) -> 본론(핵심 분석) -> 심화(구체적 적용법) -> 결론(요약 및 제언) -> FAQ.

    2. ** 전체 컨테이너 **:
    <div style="font-family: 'Pretendard', 'Noto Sans KR', sans-serif; line-height: 1.8; max-width: 800px; margin: 0 auto; font-size: 16px; color: #333;">

        <!-- 서론: 독자의 페인포인트 자극 -->
        <p style="font-size: 18px; margin-bottom: 30px; border-left: 4px solid #0052cc; padding-left: 15px; color: #555;">
            <strong>"AI가 중요한 건 알겠는데, 도대체 내 업무에 어떻게 써야 할까?"</strong><br>
                혹시 이런 고민을 하고 계신가요? 오늘 소개할 뉴스는 바로 그 질문에 대한 해답이 될 수 있습니다.
        </p>

        <!-- 챕터 1: 뉴스 핵심 요약 -->
        <h2 style="font-size: 24px; color: #111; margin: 40px 0 15px; font-weight: 700; border-bottom: 2px solid #0052cc; padding-bottom: 10px; display: inline-block;">
            1. 오늘의 AI 핵심 뉴스: 무엇이 달라졌나?
        </h2>
        <div style="background-color: #f0f7ff; padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #d0e3ff;">
            <p style="margin: 0; font-weight: 500; color: #0049b0;">(뉴스 기사의 핵심 내용을 육하원칙에 의거하여 명확하게 설명. 단순 번역투 금지.)</p>
        </div>

        <!-- 챕터 2: 심층 분석 -->
        <h2 style="font-size: 24px; color: #111; margin: 50px 0 15px; font-weight: 700; border-bottom: 2px solid #0052cc; padding-bottom: 10px; display: inline-block;">
            2. 왜 이 기술에 주목해야 할까요?
        </h2>
        <p style="margin-bottom: 15px; font-size: 17px; line-height: 1.8; color: #333;">
            (단순한 사실 전달을 넘어, 이것이 업계에 미칠 파장과 비즈니스적 기회를 분석. 예: 비용 절감, 생산성 10배 향상 등)
        </p>

        <!-- 챕터 3: 실전 적용 가이드 (가장 중요) -->
        <h2 style="font-size: 24px; color: #111; margin: 50px 0 15px; font-weight: 700; border-bottom: 2px solid #0052cc; padding-bottom: 10px; display: inline-block;">
            3. 지금 당장 어떻게 적용할 수 있을까요?
        </h2>
        <ul style="background-color: #fffbeb; padding: 30px; border-radius: 12px; margin: 20px 0; border: 1px solid #fcd34d; list-style-type: none;">
            <li style="margin-bottom: 15px;"><strong>✅ 1단계: (구체적인 행동 지침 1)</strong><br>- (설명)</li>
            <li style="margin-bottom: 15px;"><strong>✅ 2단계: (구체적인 행동 지침 2)</strong><br>- (설명)</li>
            <li style="margin: 0;"><strong>✅ 3단계: (구체적인 행동 지침 3)</strong><br>- (설명)</li>
        </ul>

        <!-- 나두AI 추천 (Coupang 등 수익화 영역 자연스럽게) -->
        <h2 style="font-size: 24px; color: #111; margin: 50px 0 15px; font-weight: 700; border-bottom: 2px solid #0052cc; padding-bottom: 10px; display: inline-block;">
            4. 업무 효율을 200% 높여줄 추천 도구
        </h2>
        <p style="margin-bottom: 20px;">AI 활용에는 장비빨도 중요합니다. 쾌적한 AI 작업 환경을 위해 에디터가 추천하는 기기입니다.</p>
        <!-- 여기에 쿠팡 배너가 들어갑니다 -->
        (COURANG_AD_PLACEHOLDER)

        <!-- 자주 묻는 질문 FAQ -->
        <h2 style="font-size: 24px; color: #111; margin: 50px 0 15px; font-weight: 700; border-bottom: 2px solid #0052cc; padding-bottom: 10px; display: inline-block;">
            ❓ 자주 묻는 질문 (FAQ)
        </h2>
        <div style="border-top: 1px solid #eee; padding-top: 20px;">
            <p><strong>Q1. 이 AI 기술은 무료인가요?</strong><br>A1. (답변)</p>
            <p style="margin-top: 15px;"><strong>Q2. 초보자도 쉽게 배울 수 있나요?</strong><br>A2. (답변)</p>
            <p style="margin-top: 15px;"><strong>Q3. 내 직무에도 도움이 될까요?</strong><br>A3. (답변)</p>
        </div>

        <!-- 결론 및 태그 -->
        <p style="color: #888; font-size: 14px; margin-top: 60px; text-align: center;">
            #인공지능 #AI트렌드 #비즈니스자동화 #생산성 #ChatGPT #나두AI
        </p>

        <div style="margin-top: 30px; text-align: center; font-size: 14px;">
            <a href="${newsItem.link}" target="_blank" style="text-decoration: none; color: #666; border-bottom: 1px solid #ccc;">📰 원문 기사 확인하기</a>
        </div>
    </div>`
                },
    {
        role: "user",
    content: `뉴스 제목: ${cleanTitle} \n뉴스 링크: ${newsItem.link} \n뉴스 내용: ${newsItem.contentSnippet || newsItem.content} \n\n위 뉴스를 바탕으로 위 스타일 가이드를 100% 준수하여, 전문적이고 깊이 있는 블로그 글을 작성해줘. "COURANG_AD_PLACEHOLDER" 부분은 텍스트로 남겨둬.`
                }
    ],
    model: "gpt-4o",
        });

    let aiContent = completion.choices[0].message.content;
    aiContent = aiContent.replace(/^```html\s* /, '').replace(/```\s*$/, '');

    let aiTitle = aiContent.match(/<h1>(.*?)<\/h1>/)?.[1] || cleanTitle;
        // AI가 제목을 h1으로 안 줄 수도 있으니, h2나 원본 제목 사용
        if (!aiTitle || aiTitle === cleanTitle) {
            aiTitle = cleanTitle;
         }

        // 🖼️ Image Generation
        console.log('🎨 Generating thumbnail with DALL-E 3...');
        let imageUrl = "";
        try {
            const imageResponse = await openai.images.generate({
            model: "dall-e-3",
        prompt: `A professional, abstract, and modern digital illustration representing "${cleanTitle}".
        Style: Minimalist 3D render, isometric, glassmorphism, soft gradients (blue, purple, gold).
        Focus on abstract shapes, data visualization, connectivity, and business growth.
        NO ROBOTS, NO HUMANS, NO TEXT. Clean and sophisticated corporate tech blog style.`,
        n: 1,
        size: "1024x1024",
            });
        imageUrl = imageResponse.data[0].url;
        console.log('✅ Image generated!');
        } catch (imgError) {
            console.error('⚠️ Image generation failed, using default:', imgError.message);
        imageUrl = "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1000&auto=format&fit=crop";
        }

        console.log('🚀 Publishing to Nadoo Blog...');

        // ➕ Append Ad Block to Content
        // ➕ Append Ad Block to Content (Replace Placeholder)
        const finalContent = aiContent.replace('(COURANG_AD_PLACEHOLDER)', COUPANG_AD_HTML);

        const response = await fetch(`${BLOG_API_URL} /api/cron / create - post`, {
            method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        'Authorization': `Bearer ${CRON_SECRET} `
            },
        body: JSON.stringify({
            title: `[AI 속보] ${aiTitle} `,
        content: finalContent,
        thumbnail_url: imageUrl,
        category: 'AI News',
        published: true
            })
        });

        const result = await response.json();

        if (response.ok) {
            console.log('🎉 Successfully published blog post!');
        console.log(`🔗 Link: ${BLOG_API_URL} /blog/${result.post?.slug || ''} `);
        } else {
            console.error('❌ Failed to publish:', result);
        }

    } catch (error) {
            console.error('❌ Error:', error);
    }
}

        generateAndPost();
