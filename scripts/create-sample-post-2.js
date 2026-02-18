
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTechReviewSample() {
    console.log('💎 Creating Tech Review Sample: No-code Tools Comparison...');

    const title = "[리뷰] 코딩 없이 앱 만들기? 노코드 3대장 (Zapier, Make, n8n) 완벽 비교";
    const slug = "no-code-tools-comparison-2026";
    const category = "Tech Reviews";
    const thumbnail_url = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"; // Dashboard/Tech image

    // Tistory Tech Review Style Content
    const content = `
        <div style="font-family: 'Pretendard', 'Noto Sans KR', sans-serif; line-height: 1.8; max-width: 800px; margin: 0 auto; font-size: 16px; color: #333;">

            <!-- 서론 -->
            <p style="font-size: 18px; margin-bottom: 30px; border-left: 4px solid #10b981; padding-left: 15px; color: #555;">
                <strong>"개발자 채용할 돈은 없고, 아이디어는 넘친다면?"</strong><br>
                정답은 <strong>노코드(No-code)</strong>입니다. <br>
                하지만 도구가 너무 많죠? 오늘 딱 정해드립니다. 내 상황에 맞는 도구는 무엇일까요?
            </p>

            <!-- 챕터 1: 비교 표 (Review Table) -->
            <h2 style="font-size: 24px; color: #111; margin: 40px 0 15px; font-weight: 700; border-bottom: 2px solid #10b981; padding-bottom: 10px; display: inline-block;">
                1. 한눈에 보는 3대장 비교 (2026 ver.)
            </h2>
            <div style="overflow-x: auto; margin-bottom: 30px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                    <thead>
                        <tr style="background-color: #f0fdf4; border-bottom: 2px solid #10b981;">
                            <th style="padding: 12px; text-align: left;">특징</th>
                            <th style="padding: 12px; text-align: left;">Zapier (제피어)</th>
                            <th style="padding: 12px; text-align: left;">Make (메이크)</th>
                            <th style="padding: 12px; text-align: left;">n8n (엔에잇엔)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 12px; font-weight: bold;">난이도</td>
                            <td style="padding: 12px;">⭐⭐ (매우 쉬움)</td>
                            <td style="padding: 12px;">⭐⭐⭐ (보통)</td>
                            <td style="padding: 12px;">⭐⭐⭐⭐ (약간 어려움)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 12px; font-weight: bold;">가격</td>
                            <td style="padding: 12px;">비쌈 💸</td>
                            <td style="padding: 12px;">합리적 👍</td>
                            <td style="padding: 12px;">무료 가능 (Self-host)</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 12px; font-weight: bold;">추천 대상</td>
                            <td style="padding: 12px;">완전 초보자, 마케터</td>
                            <td style="padding: 12px;">복잡한 로직이 필요한 기획자</td>
                            <td style="padding: 12px;">개발 지식이 있는 창업가</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 챕터 2: 상세 분석 -->
            <h2 style="font-size: 24px; color: #111; margin: 50px 0 15px; font-weight: 700; border-bottom: 2px solid #10b981; padding-bottom: 10px; display: inline-block;">
                2. 상세 분석: 나에게 맞는 툴은?
            </h2>
            
            <h3 style="font-size: 20px; font-weight: bold; margin-top: 30px; color: #059669;">🅰 Zapier: "그냥 연결만 되면 돼!"</h3>
            <p style="margin-bottom: 15px;">
                가장 유명한 툴입니다. 5,000개 이상의 앱과 연동됩니다.<br>
                단점은 비쌉니다. 데이터 1건 처리에 30~50원 꼴입니다. 하지만 UI가 가장 직관적이라 <strong>초보자에게는 무조건 추천</strong>합니다.
            </p>

            <h3 style="font-size: 20px; font-weight: bold; margin-top: 30px; color: #7c3aed;">🅱 Make (구 Integromat): "복잡한 건 질색이지만, 기능은 많아야 해"</h3>
            <p style="margin-bottom: 15px;">
                Zapier보다 훨씬 시각적입니다. 동그라미(노드)를 이어서 마인드맵처럼 로직을 짭니다.<br>
                <strong>가성비가 Zapier 대비 5배 이상 좋습니다.</strong> 나두AI도 주로 Make를 사용해 고객사 시스템을 구축합니다.
            </p>

            <h3 style="font-size: 20px; font-weight: bold; margin-top: 30px; color: #ea580c;">🆎 n8n: "내 데이터는 소중해 + 개발 지식 좀 있어"</h3>
            <p style="margin-bottom: 15px;">
                최근 가장 핫한 툴입니다. 내 서버에 직접 설치하면 <strong>사용료가 0원</strong>입니다.<br>
                보안이 중요한 기업이나, 대용량 데이터를 처리해야 한다면 n8n이 정답입니다. AI 에이전트 구축(LangChain) 기능도 가장 강력합니다.
            </p>

            <!-- 나두AI 추천 (Coupang 등 수익화 영역 자연스럽게) -->
            <h2 style="font-size: 24px; color: #111; margin: 50px 0 15px; font-weight: 700; border-bottom: 2px solid #10b981; padding-bottom: 10px; display: inline-block;">
                3. 업무 효율을 극대화하는 추천 장비
            </h2>
            <p style="margin-bottom: 20px;">복잡한 노코드 워크플로우를 설계하려면 화면이 넓고 입력이 편해야 합니다. 생산성 끝판왕 마우스를 소개합니다.</p>
            
            <!-- 쿠팡 배너 (IT 기기) -->
            <div style="margin: 40px 0; padding: 20px; border: 1px solid #e1e4e6; border-radius: 12px; background-color: #fafafa;">
                <p style="font-size: 14px; font-weight: bold; color: #555; margin-bottom: 15px; border-bottom: 2px solid #333; display: inline-block; padding-bottom: 5px;">🔥 에디터 추천: 노코드 전문가의 마우스</p>
                <a href="https://link.coupang.com/a/bXyZ12" target="_blank" rel="noopener" style="display: flex; text-decoration: none; color: #333; align-items: center; gap: 20px;">
                    <div style="flex-shrink: 0; width: 100px; height: 100px; border-radius: 8px; overflow: hidden; border: 1px solid #eee; background: white;">
                        <img src="https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2022/05/30/17/8/f0524458-1588-42f8-9585-618d070624e7.jpg" alt="Logitech MX Master 3S" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div style="flex: 1;">
                        <p style="font-size: 16px; font-weight: 600; line-height: 1.4; margin: 0 0 8px 0; color: #111; word-break: keep-all;">로지텍 MX Master 3S 무선 마우스 (생산성 끝판왕)</p>
                        <span style="font-size: 13px; color: #666;">가로 스크롤 휠로 광활한 워크플로우 화면을 자유자재로.</span>
                        <div style="margin-top: 10px;">
                        <span style="padding: 6px 12px; background-color: #e11d48; color: white; border-radius: 4px; font-size: 12px; font-weight: bold;">최저가 보기 ▶</span>
                        </div>
                    </div>
                </a>
                <p style="text-align: right; font-size: 11px; color: #aaa; margin-top: 10px;">이 링크를 통해 구매 시 쿠팡 파트너스 활동으로 일정 수수료를 지원받습니다.</p>
            </div>

            <!-- 결론 및 태그 -->
            <div style="background-color: #ecfdf5; border-left: 5px solid #10b981; padding: 20px; margin-top: 40px; border-radius: 4px;">
                <strong style="display:block; margin-bottom:10px; color:#047857;">💡 나두AI의 결론</strong>
                복잡한 거 싫다 -> <strong>Zapier</strong><br>
                가성비와 기능 다 잡고 싶다 -> <strong>Make</strong> (추천 👑)
            </div>

            <p style="color: #888; font-size: 14px; margin-top: 60px; text-align: center;">
                #노코드 #Zapier #Make #n8n #업무자동화 #나두AI #TechReview
            </p>
        </div>
    `;

    const { error } = await supabase
        .from('posts')
        .insert({
            title,
            slug,
            content,
            excerpt: "개발자 없이 나만의 앱을 만드는 방법. 노코드 툴(Zapier, Make, n8n)의 장단점을 완벽하게 비교해드립니다.",
            thumbnail_url,
            category,
            published: true
        });

    if (error) {
        console.error('❌ Error creating post:', error.message);
    } else {
        console.log('🎉 Tech Review Sample post created!');
        console.log(`🔗 Checking: ${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`);
    }
}

createTechReviewSample();
