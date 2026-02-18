
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createHighQualitySample() {
    console.log('💎 Creating High-Quality "Masterpiece" sample post...');

    const title = "2026년 업무 자동화, '이것' 모르면 결국 도태됩니다 (충격 분석)";
    const slug = "2026-ai-automation-master-guide";
    const category = "AI News";
    const thumbnail_url = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop";

    // New "Tistory Power Blogger" Style Content
    const content = `
        <div style="font-family: 'Pretendard', 'Noto Sans KR', sans-serif; line-height: 1.8; max-width: 800px; margin: 0 auto; font-size: 16px; color: #333;">

            <!-- 서론: 독자의 페인포인트 자극 -->
            <p style="font-size: 18px; margin-bottom: 30px; border-left: 4px solid #0052cc; padding-left: 15px; color: #555;">
                <strong>"남들은 AI로 1시간 만에 퇴근한다는데, 왜 나만 야근일까?"</strong><br>
                혹시 이런 자괴감에 빠져 계신가요? <br>
                단언컨대, 그건 여러분의 능력이 부족해서가 아닙니다. 단지 <strong>'2026년형 자동화 루틴'</strong>을 몰랐기 때문입니다.
            </p>

            <!-- 챕터 1: 뉴스 핵심 요약 -->
            <h2 style="font-size: 24px; color: #111; margin: 40px 0 15px; font-weight: 700; border-bottom: 2px solid #0052cc; padding-bottom: 10px; display: inline-block;">
                1. 2026년, 무엇이 달라졌나? (핵심 요약)
            </h2>
            <div style="background-color: #f0f7ff; padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #d0e3ff;">
                <p style="margin: 0; font-weight: 500; color: #0049b0;">
                    ✅ <strong>단순 반복 업무의 종말:</strong> 엑셀 정리, 이메일 답장 등은 이제 인간의 영역이 아닙니다.<br>
                    ✅ <strong>AI 에이전트의 시대:</strong> 시키지 않아도 알아서 일을 찾아서 하는 '능동형 AI'가 보급되었습니다.<br>
                    ✅ <strong>1인 기업의 부상:</strong> AI 직원 10명을 둔 1인 사장님이 대기업 팀장보다 더 많은 성과를 냅니다.
                </p>
            </div>

            <!-- 챕터 2: 심층 분석 -->
            <h2 style="font-size: 24px; color: #111; margin: 50px 0 15px; font-weight: 700; border-bottom: 2px solid #0052cc; padding-bottom: 10px; display: inline-block;">
                2. 왜 지금 당장 시작해야 할까요?
            </h2>
            <p style="margin-bottom: 15px; font-size: 17px; line-height: 1.8; color: #333;">
                지금은 <strong>'과도기'</strong>입니다. 누군가는 AI를 두려워하며 거부하고, 누군가는 AI 위에 올라타서 질주합니다.<br>
                중요한 건, <strong>지금 시작하는 사람이 이 거대한 격차의 승자</strong>가 된다는 점입니다. <br><br>
                실제로 제 고객 중 한 분은 AI 도입 후 <strong>월 고정비용을 300만 원 절감</strong>하고, <strong>매출은 2배</strong>로 늘렸습니다. 마법이 아닙니다. 기술입니다.
            </p>

            <!-- 챕터 3: 실전 적용 가이드 (가장 중요) -->
            <h2 style="font-size: 24px; color: #111; margin: 50px 0 15px; font-weight: 700; border-bottom: 2px solid #0052cc; padding-bottom: 10px; display: inline-block;">
                3. 오늘 당장 따라 할 수 있는 3단계 루틴
            </h2>
            <ul style="background-color: #fffbeb; padding: 30px; border-radius: 12px; margin: 20px 0; border: 1px solid #fcd34d; list-style-type: none;">
                <li style="margin-bottom: 20px;">
                    <strong>✅ 1단계: 반복 업무 리스트업</strong><br>
                    - 하루 일과 중 '내가 생각하지 않고 손으로만 하는 일'을 적어보세요. (예: 송장 입력, 뉴스 스크랩)
                </li>
                <li style="margin-bottom: 20px;">
                    <strong>✅ 2단계: 나두AI 무료 상담 신청</strong><br>
                    - 혼자 고민하지 마세요. 전문가에게 "이거 자동화되나요?"라고 물어보는 게 가장 빠릅니다.
                </li>
                <li style="margin: 0;">
                    <strong>✅ 3단계: 딱 하나만 자동화하기</strong><br>
                    - 거창할 필요 없습니다. 이메일 자동 분류부터 시작해보세요. 작은 성공이 큰 혁신을 만듭니다.
                </li>
            </ul>

            <!-- 나두AI 추천 (Coupang 등 수익화 영역 자연스럽게) -->
            <h2 style="font-size: 24px; color: #111; margin: 50px 0 15px; font-weight: 700; border-bottom: 2px solid #0052cc; padding-bottom: 10px; display: inline-block;">
                4. 업무 효율을 200% 높여줄 추천 도구
            </h2>
            <p style="margin-bottom: 20px;">AI 활용에는 장비빨도 중요합니다. 쾌적한 AI 작업 환경을 위해 에디터가 추천하는 기기입니다.</p>
            
            <!-- 깔끔해진 쿠팡 배너 -->
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

            <!-- 자주 묻는 질문 FAQ -->
            <h2 style="font-size: 24px; color: #111; margin: 50px 0 15px; font-weight: 700; border-bottom: 2px solid #0052cc; padding-bottom: 10px; display: inline-block;">
                ❓ 자주 묻는 질문 (FAQ)
            </h2>
            <div style="border-top: 1px solid #eee; padding-top: 20px;">
                <p><strong>Q1. AI 자동화 구축 비용은 비싼가요?</strong><br>A1. 아닙니다. 월 구독형(SaaS) 도구를 활용하면 커피 한 잔 값으로도 시작할 수 있습니다.</p>
                <p style="margin-top: 15px;"><strong>Q2. 코딩을 못해도 할 수 있나요?</strong><br>A2. 네, 노코드(No-code) 툴인 Zapier나 Make를 사용하면 마우스 클릭만으로 가능합니다.</p>
                <p style="margin-top: 15px;"><strong>Q3. 나두AI에 의뢰하면 얼마나 걸리나요?</strong><br>A3. 간단한 봇은 3일, 복잡한 시스템은 2주 내외로 구축해 드립니다.</p>
            </div>

            <!-- 결론 및 태그 -->
            <p style="color: #888; font-size: 14px; margin-top: 60px; text-align: center;">
                #인공지능 #AI트렌드 #비즈니스자동화 #생산성 #ChatGPT #나두AI
            </p>
        </div>
    `;

    const { error } = await supabase
        .from('posts')
        .insert({
            title,
            slug,
            content,
            excerpt: "남들은 AI로 1시간 만에 퇴근한다는데... 2026년형 업무 자동화 루틴을 완벽하게 공개합니다.",
            thumbnail_url,
            category,
            published: true
        });

    if (error) {
        console.error('❌ Error creating post:', error.message);
    } else {
        console.log('🎉 High-Quality Sample post created!');
        console.log(`🔗 Checking: ${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`);
    }
}

createHighQualitySample();
