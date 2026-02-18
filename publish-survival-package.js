require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');

const BLOG_API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nadoo-blog.vercel.app';
const CRON_SECRET = process.env.CRON_SECRET;

async function publishSurvivalPackage() {
    try {
        console.log('🚀 Publishing "AI Survival Package" post...');

        const title = "Nadoo AI 생존 패키지: 1인 기업을 위한 완벽한 자동화 솔루션";
        const content = `
    <div style="font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; font-size: 16px; box-sizing: border-box; color: #3c4043;">
      
      <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; font-style: italic; margin-bottom: 25px; font-size: 15px;">
        <p style="margin-bottom: 0;"><strong>핵심 요약:</strong> 1인 기업과 부동산 중개사를 위한 올인원 AI 자동화 솔루션입니다. 블로그 포스팅부터 고객 관리까지, 귀하의 비즈니스를 24시간 깨어있는 시스템으로 바꿔드립니다.</p>
      </div>

      <h2 style="font-size: 22px; color: white; background: linear-gradient(to right, #1a73e8, #004d99); margin: 30px 0 15px; border-radius: 10px; padding: 10px 25px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2); font-weight: bold; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        AI 생존 패키지란?
      </h2>

      <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.6; color: #3c4043;">
        "남들은 AI로 앞서가는데, 언제까지 수동으로 작업하시겠습니까?"<br><br>
        Nadoo AI 생존 패키지는 단순한 툴이 아닙니다. 복잡한 기술 없이도 즉시 현업에 적용 가능한 <strong>실전형 자동화 시스템</strong>입니다. 매일 반복되는 단순 업무에서 해방되어, 진짜 가치 있는 일에 집중하세요.
      </p>

      <div style="background-color: #f8f9fa; border-left: 4px solid #1a73e8; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <strong>🎁 패키지 포함 내역</strong>
      </div>

      <h3 style="font-size: 19px; color: #1a73e8; margin: 25px 0 15px; border-bottom: 2px solid #e8f0fe; padding-bottom: 8px;">1. 자동 블로그 포스팅 봇</h3>
      <p style="margin-bottom: 20px; font-size: 16px;">매일 아침 9시 30분, 최신 부동산 뉴스를 분석하여 전문가 수준의 블로그 글을 자동으로 작성하고 발행합니다. (현재 보고 계신 이 블로그도 100% 자동화로 운영됩니다.)</p>

      <h3 style="font-size: 19px; color: #1a73e8; margin: 25px 0 15px; border-bottom: 2px solid #e8f0fe; padding-bottom: 8px;">2. 맞춤형 썸네일 생성기</h3>
      <p style="margin-bottom: 20px; font-size: 16px;">글 내용에 딱 맞는 고퀄리티 3D 스타일 썸네일을 AI가 즉석에서 그려줍니다. 저작권 걱정 없이 나만의 브랜딩을 완성하세요.</p>

      <h3 style="font-size: 19px; color: #1a73e8; margin: 25px 0 15px; border-bottom: 2px solid #e8f0fe; padding-bottom: 8px;">3. 고객 상담 신청 자동화</h3>
      <p style="margin-bottom: 20px; font-size: 16px;">블로그를 보고 들어온 잠재 고객의 DB를 자동으로 수집하고 정리해드립니다. (Supabase 연동)</p>

      <div style="background-color: #fce8e6; border-left: 4px solid #d93025; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        ⚠️ <strong>한정 수량 안내</strong><br>
        최적의 퀄리티 유지를 위해 매월 <strong>5팀</strong>만 선착순으로 제작해드리고 있습니다. 지금 바로 문의하세요.
      </div>

      <p style="color: #5f6368; font-size: 14px;">#AI자동화 #부동산마케팅 #1인기업 #업무효율 #블로그자동화 #NadooAI</p>
    </div>
    `;

        // High quality thumbnail for the package itself
        const thumbnail_url = "https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070&auto=format&fit=crop";

        const response = await fetch(`${BLOG_API_URL}/api/cron/create-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CRON_SECRET}`
            },
            body: JSON.stringify({
                title,
                content,
                thumbnail_url,
                published: true
            })
        });

        const result = await response.json();

        if (response.ok) {
            console.log('🎉 Successfully published "Survival Package" post!');
            console.log(`🔗 Link: ${BLOG_API_URL}/blog/${result.post?.slug || ''}`);
        } else {
            console.error('❌ Failed to publish:', result);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

publishSurvivalPackage();
