
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { url, accessCode } = await req.json();

        // 1. Security Check
        if (accessCode !== 'nadoo3379') {
            return NextResponse.json({ error: 'Unauthorized: Incorrect Access Code' }, { status: 401 });
        }

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // 2. Scrape Content
        console.log(`🕷️ Scraping: ${url}`);
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove noise
        $('script, style, nav, footer, header, aside').remove();

        // Get main content
        const title = $('title').text().trim() || $('h1').first().text().trim();
        const mainContent = $('article').text().trim() || $('main').text().trim() || $('body').text().trim();

        // Limit content length to avoid token limits
        const cleanedContent = mainContent.replace(/\s+/g, ' ').slice(0, 10000);

        // 3. Generate Draft with OpenAI
        console.log('🤖 Generating Draft...');
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `당신은 '나두AI' 블로그의 전문 에디터입니다.
          사용자가 제공한 웹페이지 내용을 바탕으로, 우리 블로그 스타일에 맞는 고품질 포스팅을 작성하세요.
          
          [스타일 가이드]
          - 독자 타겟: 비즈니스맨, 1인 창업가.
          - 톤앤매너: 전문적이지만 읽기 쉽게. (~습니다 체)
          - 구조:
            1. 흥미 유발 서론
            2. 핵심 요약 (박스 스타일)
            3. 본문 (소제목 h2 사용)
            4. 결론 및 제언
            5. FAQ
          - HTML 태그를 사용하여 작성하세요 (div, p, h2, ul, li, strong 등).
          - 인라인 스타일을 적절히 사용하여 디자인을 입히세요 (기존 블로그 스타일 유지).
          - 제목은 <h1> 태그로 감싸지 말고 별도로 추출할 수 있게 맨 첫 줄에 "TITLE: " 접두사를 붙여주세요.
          - 썸네일 생성을 위한 프롬프트도 맨 마지막에 "IMAGE_PROMPT: " 접두사를 붙여주세요.
          `
                },
                {
                    role: "user",
                    content: `Source Title: ${title}\n\nSource Content:\n${cleanedContent}\n\n위 내용을 바탕으로 블로그 글을 작성해줘.`
                }
            ],
        });

        const generatedText = completion.choices[0].message.content || "";

        // Parse the response
        let finalTitle = title;
        let finalContent = generatedText;
        let imagePrompt = "";

        // Extract Title
        if (generatedText.includes("TITLE: ")) {
            const parts = generatedText.split("TITLE: ");
            if (parts[1]) {
                const lines = parts[1].split('\n');
                finalTitle = lines[0].trim();
                finalContent = generatedText.replace(`TITLE: ${finalTitle}`, '').trim();
            }
        }

        // Extract Image Prompt
        if (finalContent.includes("IMAGE_PROMPT: ")) {
            const parts = finalContent.split("IMAGE_PROMPT: ");
            finalContent = parts[0].trim();
            imagePrompt = parts[1].trim();
        }

        // Clean up code blocks if any
        finalContent = finalContent.replace(/^```html/, '').replace(/```$/, '');

        // 4. Generate Thumbnail (Optional)
        let thumbnail_url = "";
        if (imagePrompt) {
            try {
                const imageResponse = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: `A professional, abstract, and modern digital illustration representing "${imagePrompt || finalTitle}".
                Style: Minimalist 3D render, isometric, glassmorphism, soft gradients (blue, purple, gold).
                Focus on abstract shapes, data visualization, connectivity, and business growth.
                NO ROBOTS, NO HUMANS, NO TEXT. Clean and sophisticated corporate tech blog style.`,
                    n: 1,
                    size: "1024x1024",
                });
                thumbnail_url = imageResponse.data[0].url || "";
            } catch (e) {
                console.error("Image generation failed:", e);
            }
        }

        return NextResponse.json({
            title: finalTitle,
            content: finalContent,
            thumbnail_url: thumbnail_url,
            slug: finalTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w\uAC00-\uD7A3-]/g, ''),
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
