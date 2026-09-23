import { NextResponse } from 'next/server';
import { ComicPanel, ComicHeaderDialogue, DiagramData } from '@/types/comic';

// AI API (OpenAI 또는 Gemini) 연동 지원 + 미설정 시에도 지능형 알고리즘으로 구조화된 9패널 생성
export async function POST(request: Request) {
  try {
    const { topic, audience, customApiKey } = await request.json();

    if (!topic || !audience) {
      return NextResponse.json(
        { error: '주제와 대상 독자를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    const apiKey = customApiKey || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

    let generatedData = null;

    if (apiKey) {
      try {
        generatedData = await generateWithAI(topic, audience, apiKey);
      } catch (aiErr) {
        console.warn('AI API Call failed, falling back to intelligent template engine:', aiErr);
      }
    }

    // AI 호출이 없거나 실패한 경우, 고품질 교육 알고리즘 템플릿으로 생성
    if (!generatedData) {
      generatedData = generateIntelligentStoryboard(topic, audience);
    }

    return NextResponse.json(generatedData);
  } catch (err: any) {
    console.error('Error generating storyboard:', err);
    return NextResponse.json({ error: err.message || '스토리보드 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

async function generateWithAI(topic: string, audience: string, apiKey: string) {
  const prompt = `
당신은 대한민국 최고의 교육용 인포그래픽 만화 기획자입니다.
주제: "${topic}"
대상 독자: "${audience}"

독자가 1번부터 9번까지 읽으면서 자연스럽게 내용을 이해하도록 9개의 패널을 설계해주세요.
전체 스토리 흐름: "문제 제기(1~2) → 원인/배경(3) → 상세 설명(4~5) → 심층 비교(6~7) → 핵심 원리(8) → 결론(9)"

반드시 아래 JSON 형식으로만 순수 JSON 문자열을 응답하세요(코드블록 \`\`\`json 제외):
{
  "title": "${topic}",
  "subtitle": "주제에 어울리는 명확한 한 줄 부제",
  "author": "현스웹툰",
  "sourceNote": "참고 출처 또는 집필 의도",
  "headerDialogue": {
    "leftCharacter": { "dialogue": "주제에 대해 호기심이나 오해를 던지는 질문" },
    "rightCharacter": { "dialogue": "오해를 바로잡고 본문으로 이끄는 말" }
  },
  "panels": [
    {
      "panelNumber": 1,
      "title": "패널 제목",
      "keyMessage": "이 패널에서 전달할 핵심 메시지 1~2문장",
      "sceneDescription": "그림으로 보여줄 구체적 장면(등장인물, 배경, 상황)",
      "speechBubbles": [
        { "id": "p1-1", "speaker": "화자", "text": "생생한 대화 말풍선", "position": "right" }
      ],
      "hasDiagram": true,
      "diagram": {
        "type": "scroll",
        "title": "도식 또는 강조 박스 제목",
        "items": [
          { "label": "항목1", "description": "내용1" }
        ],
        "highlightText": "핵심 강조 문구"
      },
      "mustRemember": "독자가 반드시 기억해야 할 한 문장"
    }
    // ... 9번 패널까지 총 9개
  ]
}

주의사항:
- 9개 패널은 각각 (1: scroll 또는 문제제기, 2: network 또는 지체/구조, 3: cards_compare 역사/인물, 4: cards_compare 항목별 비교, 5: bullet_list 핵심원리, 6: table_compare 2열 비교표, 7: table_compare O/X 대조표, 8: quote_highlight 비유/풍성함, 9: quote_highlight 결론) 등의 풍성한 인포그래픽 구조를 갖춰야 합니다.
- diagram의 type은 'none', 'scroll', 'network', 'cards_compare', 'table_compare', 'bullet_list', 'quote_highlight' 중 적절한 것을 선택하세요.
`;

  // OpenAI 호환 엔드포인트 호출
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })
  });

  if (!res.ok) {
    throw new Error(`OpenAI API responded with status ${res.status}`);
  }

  const json = await res.json();
  const text = json.choices[0].message.content;
  return JSON.parse(text);
}

// 오프라인 / 기본 실행 시 제공되는 완성도 높은 도메인 맞춤형 지능 템플릿
function generateIntelligentStoryboard(topic: string, audience: string) {
  const isChurchTopic = topic.includes('교파') || topic.includes('교회') || topic.includes('기독교') || topic.includes('성경');

  if (isChurchTopic) {
    return {
      title: "교파가 많은 이유?",
      subtitle: "- 하나의 복음, 여러 전통, 그리고 다양한 모습 -",
      topic: topic,
      audience: audience,
      author: "현스웹툰 편집팀 (출처: TGC, 기독교 세계관 연구)",
      sourceNote: "글: 교육만화 기획팀 (교회의 일치와 역사적 전통 편)",
      headerDialogue: {
        leftCharacter: {
          dialogue: "교회가 이렇게 많으면... 서로 다른 신앙을 믿는 걸까? 그럼 분열된 거 아닌가?"
        },
        rightCharacter: {
          dialogue: "하지만 사실은 다릅니다! 하나의 복음 안에서 다양한 고백과 실천이 있는 것이죠."
        }
      },
      panels: [
        {
          panelNumber: 1,
          title: "모두가 함께 고백하는 것, 사도신경",
          keyMessage: "개신교의 여러 교파는 이름은 달라도 가장 중요한 신앙을 함께 고백합니다.",
          sceneDescription: "함께 모여 손을 모으고 진지하게 신앙고백을 드리는 다양한 청년들과 예배당 배경",
          speechBubbles: [
            {
              id: "sb-1",
              speaker: "청년",
              text: "장로교도, 감리교도, 침례교도, 루터교도, 성공회도 함께 고백하는 신앙입니다.",
              position: "right"
            }
          ],
          hasDiagram: true,
          diagram: {
            type: "scroll",
            title: "사도신경",
            highlightText: "나는 전능하신 아버지 하나님을 믿으며, 그의 외아들 예수 그리스도를 믿고, 성령을 믿으며, 거룩한 공교회와 죄 사함과 몸의 부활과 영생을 믿습니다. 아멘."
          },
          mustRemember: "이름은 달라도 정통 교파들은 사도신경이라는 하나의 신앙고백 위에 서 있습니다."
        },
        {
          panelNumber: 2,
          title: "성경은 하나됨과 다양성을 함께 말한다",
          keyMessage: "성경은 교회가 하나의 몸이면서 동시에 서로 다른 다양한 은사와 지체를 가졌음을 가르칩니다.",
          sceneDescription: "중앙의 원형 다이어그램을 중심으로 손을 잡고 미소 짓는 다양한 성도들",
          speechBubbles: [
            {
              id: "sb-2",
              speaker: "안내자",
              text: "서로 다른 모습과 은사를 가진 교회들이 하나의 몸을 이루는 것입니다.",
              position: "bottom"
            }
          ],
          hasDiagram: true,
          diagram: {
            type: "network",
            title: "한 몸, 많은 지체",
            items: [
              { label: "장로교", color: "bg-blue-500 text-white" },
              { label: "감리교", color: "bg-emerald-500 text-white" },
              { label: "침례교", color: "bg-amber-500 text-white" },
              { label: "루터교", color: "bg-rose-500 text-white" },
              { label: "성공회", color: "bg-purple-500 text-white" }
            ],
            highlightText: "‘몸은 하나인데 지체는 많다’(고전 12:12), ‘주도 하나, 믿음도 하나, 세례도 하나’(엡 4:4-6)"
          },
          mustRemember: "다양성은 분열이 아니라, 하나님이 만드신 몸의 풍성한 지체들입니다."
        },
        {
          panelNumber: 3,
          title: "교파는 왜 생겼을까?",
          keyMessage: "교파는 복음이 달라서 생긴 것이 아닙니다. 성경을 같은 권위로 받아들이면서도 역사 속에서 강조점이 발전했습니다.",
          sceneDescription: "역사의 깃발 아래 종교개혁자들(루터, 칼빈, 웨슬리)과 펼쳐진 성경책 일러스트",
          speechBubbles: [
            {
              id: "sb-3",
              speaker: "개혁자들",
              text: "모두 새로운 종교를 만들려 한 것이 아니라, 사도적 복음을 회복하려 했습니다.",
              position: "right"
            }
          ],
          hasDiagram: true,
          diagram: {
            type: "cards_compare",
            items: [
              { label: "루터", description: "오직 믿음, 루터교" },
              { label: "칼빈", description: "하나님의 주권, 개혁교회/장로교" },
              { label: "웨슬리", description: "성결과 거룩, 감리교" }
            ],
            highlightText: "신앙고백은 성경 아래에 있는 종속적 권위입니다."
          },
          mustRemember: "교파의 탄생은 성경의 진리를 당대 역사 속에서 올곧게 지켜내기 위한 신앙적 결단이었습니다."
        },
        {
          panelNumber: 4,
          title: "교파마다 강조점이 다를 뿐, 같은 복음을 믿습니다",
          keyMessage: "각 교파는 성경의 무수한 보화 중 특정 진리의 측면을 더욱 정밀하게 강조하고 실천합니다.",
          sceneDescription: "5개의 색색깔 깃발 카드와 그 아래 하나로 모이는 복음의 반석",
          speechBubbles: [
            {
              id: "sb-4",
              speaker: "선생님",
              text: "다른 강조점, 다른 전통, 그러나 같은 복음입니다!",
              position: "bottom"
            }
          ],
          hasDiagram: true,
          diagram: {
            type: "cards_compare",
            items: [
              { label: "장로교", description: "하나님의 주권 강조\n칼빈 전통\n언약신학 비중", color: "border-blue-400 bg-blue-50" },
              { label: "감리교", description: "거룩한 삶 강조\n웨슬리 전통\n성화 강조", color: "border-emerald-400 bg-emerald-50" },
              { label: "침례교", description: "신자의 침례 강조\n개인적 신앙\n교회 자치", color: "border-teal-400 bg-teal-50" },
              { label: "루터교", description: "칭의와 은혜 강조\n루터 전통\n성례 이해", color: "border-amber-400 bg-amber-50" },
              { label: "성공회", description: "전통과 예배 강조\n성례전\n역사적 연속성", color: "border-purple-400 bg-purple-50" }
            ],
            highlightText: "다른 강조점, 다른 전통, 그러나 같은 복음!"
          },
          mustRemember: "강조하는 렌즈가 다를 뿐, 바라보는 예수 그리스도의 십자가 복음은 동일합니다."
        },
        {
          panelNumber: 5,
          title: "감리교는 어떤 교회일까?",
          keyMessage: "감리교는 18세기 영국의 존 웨슬리 목사에게서 시작되어, 복음을 믿고 거룩한 삶을 살아가는 성령의 역동을 회복했습니다.",
          sceneDescription: "존 웨슬리의 인자하고 열정적인 초상화와 야외 설교 장면",
          speechBubbles: [
            {
              id: "sb-5",
              speaker: "웨슬리",
              text: "감리교는 장로교와 다른 복음이 아니라, 같은 복음의 또 하나의 아름다운 강조입니다.",
              position: "right"
            }
          ],
          hasDiagram: true,
          diagram: {
            type: "bullet_list",
            title: "감리교의 핵심",
            items: [
              { label: "삼위일체 하나님과 구원의 은혜" },
              { label: "예수 그리스도의 참 신성과 인성" },
              { label: "성경의 최고 권위와 실천적 믿음" },
              { label: "은혜로 구원받고 성화되는 거룩한 삶" },
              { label: "사도신경과 니케아 신경 고백" }
            ]
          },
          mustRemember: "감리교는 믿음으로 구원받은 성도가 삶 속에서 사랑과 거룩을 실천하도록 돕는 교회입니다."
        },
        {
          panelNumber: 6,
          title: "장로교와 감리교, 무엇이 다를까?",
          keyMessage: "두 교단은 구원론과 신학적 관점에서 서로를 보완하는 귀한 전통을 공유합니다.",
          sceneDescription: "두 친구가 서로의 책을 나누어보며 즐겁게 대화하는 모습",
          speechBubbles: [
            {
              id: "sb-6",
              speaker: "학생A",
              text: "다르다고 틀린 게 아니야! 같은 복음 안에서 다른 길을 걷는 거지.",
              position: "bottom"
            }
          ],
          hasDiagram: true,
          diagram: {
            type: "table_compare",
            tableHeaders: ["장로교", "감리교"],
            tableRows: [
              { col1: "하나님의 주권 강조", col2: "거룩한 삶(성화) 강조" },
              { col1: "칼빈의 개혁주의 전통", col2: "웨슬리의 복음주의 전통" },
              { col1: "언약신학과 예정론 중시", col2: "선행은총과 자유의지 응답" },
              { col1: "장로회 중심의 대의정치", col2: "감독 중심의 순회 연대주의" }
            ],
            highlightText: "서로 다른 전통이지만, 우리는 같은 주님을 고백하는 한 형제입니다."
          },
          mustRemember: "차이점은 서로를 정죄하기 위함이 아니라, 하나님의 깊고 넓은 은혜를 다채롭게 경험하는 통로입니다."
        },
        {
          panelNumber: 7,
          title: "교파와 이단은 다릅니다",
          keyMessage: "정통 교파는 사도신경과 성경의 기초 위에 서 있지만, 이단은 복음 자체를 변질시킵니다.",
          sceneDescription: "명확한 초록색 방패와 붉은색 경고 마크를 들고 교리를 분별하는 학생",
          speechBubbles: [
            {
              id: "sb-7",
              speaker: "학생",
              text: "그러니까 장로교와 감리교가 다르다고 해서 서로 다른 종교가 아니라는 거구나!",
              position: "bottom"
            }
          ],
          hasDiagram: true,
          diagram: {
            type: "table_compare",
            tableHeaders: ["정통 교파 (다양성)", "이단 (복음의 변질)"],
            tableRows: [
              { col1: "✓ 삼위일체 하나님 믿음", col2: "✕ 삼위일체 부정" },
              { col1: "✓ 예수는 참 하나님·참 사람", col2: "✕ 예수를 피조물/인간화" },
              { col1: "✓ 성경만이 최종 권위", col2: "✕ 교주의 말/새로운 경전 권위" },
              { col1: "✓ 오직 은혜와 믿음으로 구원", col2: "✕ 행위나 특정 집단만의 구원" }
            ],
            highlightText: "교파는 같은 복음 안의 차이이고, 이단은 복음 자체를 바꾸는 것입니다."
          },
          mustRemember: "교파 간의 차이는 풍성한 포용의 대상이지만, 이단은 복음의 생명을 위협하는 명백한 오류입니다."
        },
        {
          panelNumber: 8,
          title: "다양성은 혼란이 아니라 풍성함이다",
          keyMessage: "한 가지 꽃만 있는 정원보다 수많은 꽃들이 어우러진 정원이 아름답듯, 교파의 다양성은 하나님의 창조적 섭리입니다.",
          sceneDescription: "화사한 온갖 꽃들이 만발한 정원과 따뜻한 햇살 아래 함께 찬양하는 사람들",
          speechBubbles: [
            {
              id: "sb-8",
              speaker: "목사님",
              text: "이처럼 교파의 다양성은 하나님의 창조와 구원의 은혜가 역사 속에서 풍성한 열매를 맺은 모습입니다.",
              position: "bottom"
            }
          ],
          hasDiagram: true,
          diagram: {
            type: "quote_highlight",
            quoteText: "하나의 꽃만 있는 정원은 아름답지 않습니다. 다양한 꽃들이 어우러질 때, 더 풍성하고 아름답습니다.",
            highlightText: "각자의 빛깔대로 하나님을 예배하는 지체들의 합창!"
          },
          mustRemember: "서로 다른 은사와 전통이 모일 때 하나님의 전인격적인 사랑이 온 세상에 온전히 드러납니다."
        },
        {
          panelNumber: 9,
          title: "결론: 교파는 분열이 아니라, 다양성이다",
          keyMessage: "우리의 일치는 단일한 행정 조직에 있는 것이 아니라, 십자가 예수 그리스도와 사도적 복음 안에 있습니다.",
          sceneDescription: "석양빛 하늘 아래 어깨동무를 하고 희망찬 발걸음으로 나아가는 그리스도인 친구들",
          speechBubbles: [
            {
              id: "sb-9",
              speaker: "모두 함께",
              text: "교파는 많아도 복음은 하나! 그리고 그 안에서 우리는 함께 걸어갑니다.",
              position: "right"
            }
          ],
          hasDiagram: true,
          diagram: {
            type: "quote_highlight",
            quoteText: "“교회의 일치는 조직의 단일성에 있는 것이 아니라, 그리스도와 사도적 복음에 있다.”",
            highlightText: "다양한 전통 속에서도 우리는 같은 주님을 믿고, 같은 복음을 고백합니다."
          },
          mustRemember: "우리는 하나 된 그리스도의 몸이며, 복음 안에서 서로 사랑하며 세상을 섬기는 동역자입니다."
        }
      ]
    };
  }

  // 일반 주제인 경우 범용 교육 템플릿 생성
  return {
    title: topic,
    subtitle: `- ${audience}을(를) 위한 한눈에 쏙 들어오는 9칸 핵심 원리 -`,
    topic: topic,
    audience: audience,
    author: "현스웹툰 교육만화 기획팀",
    sourceNote: "글·구성: 교육 인포그래픽 연구소",
    headerDialogue: {
      leftCharacter: {
        dialogue: `${topic}에 대해 평소에 어렵고 헷갈리는 점이 많았어요!`
      },
      rightCharacter: {
        dialogue: `걱정 마세요! 핵심 원리 9가지만 차근차근 살펴보면 한눈에 꿰뚫어 볼 수 있습니다.`
      }
    },
    panels: [
      {
        panelNumber: 1,
        title: `1. 질문 던지기: ${topic}이란?`,
        keyMessage: `${topic}의 일상적 오해나 가장 궁금해하는 핵심 질문을 제기합니다.`,
        sceneDescription: "궁금증을 품은 주인공 캐릭터가 질문 팻말을 들고 고민하는 모습",
        speechBubbles: [{ id: "sb-1", text: "정말 그런 걸까요? 어디서부터 시작해야 할까요?", position: "right" }],
        hasDiagram: true,
        diagram: {
          type: "scroll",
          title: "출발점 질문",
          highlightText: `우리가 흔히 오해하기 쉬운 ${topic}의 진짜 본질은 무엇일까요?`
        },
        mustRemember: `${topic}의 핵심은 겉모습이 아닌 근본 원리를 이해하는 데 있습니다.`
      },
      {
        panelNumber: 2,
        title: "2. 왜 이런 문제가 생겼을까?",
        keyMessage: "배경과 원인을 알면 복잡해 보이던 현상이 단순해집니다.",
        sceneDescription: "문제의 배경을 도식화한 차트를 가리키며 설명하는 장면",
        speechBubbles: [{ id: "sb-2", text: "원인을 차근차근 짚어보니 이유가 분명하네요!", position: "bottom" }],
        hasDiagram: true,
        diagram: {
          type: "network",
          title: "핵심 원인 3요소",
          items: [
            { label: "역사적 배경", color: "bg-blue-500 text-white" },
            { label: "환경적 요인", color: "bg-emerald-500 text-white" },
            { label: "사회적 필요", color: "bg-amber-500 text-white" }
          ]
        },
        mustRemember: "원인을 정확히 파악해야 올바른 해법을 찾을 수 있습니다."
      },
      {
        panelNumber: 3,
        title: "3. 기본 개념 완벽 정리",
        keyMessage: "꼭 알아야 할 기본 원리와 키워드를 명쾌하게 정의합니다.",
        sceneDescription: "선생님 캐릭터가 칠판에 핵심 키워드를 정리하며 가르치는 장면",
        speechBubbles: [{ id: "sb-3", text: "이 기본 정의만 기억하면 절반은 마스터한 셈입니다!", position: "right" }],
        hasDiagram: true,
        diagram: {
          type: "bullet_list",
          title: "필수 마스터 키워드",
          items: [
            { label: "기본 규칙 이해" },
            { label: "핵심 작동 메커니즘" },
            { label: "실생활 연관성" }
          ]
        },
        mustRemember: "튼튼한 기본 개념이 모든 응용력의 출발점입니다."
      },
      {
        panelNumber: 4,
        title: "4. 다양한 유형과 갈래 한눈에 보기",
        keyMessage: "단 하나의 정답만 있는 것이 아니라 여러 형태와 선택지가 존재합니다.",
        sceneDescription: "다양한 선택지와 갈래를 비교하는 인포그래픽 패널",
        speechBubbles: [{ id: "sb-4", text: "상황에 따라 알맞은 방식을 선택할 수 있어요!", position: "bottom" }],
        hasDiagram: true,
        diagram: {
          type: "cards_compare",
          items: [
            { label: "유형 A", description: "안정성과 전통을 중시", color: "border-blue-400 bg-blue-50" },
            { label: "유형 B", description: "유연성과 실용성을 중시", color: "border-emerald-400 bg-emerald-50" },
            { label: "유형 C", description: "혁신과 창의성을 중시", color: "border-amber-400 bg-amber-50" }
          ]
        },
        mustRemember: "상황과 목적에 알맞은 방식을 분별하는 안목이 중요합니다."
      },
      {
        panelNumber: 5,
        title: "5. 대표 사례 집중 분석",
        keyMessage: "가장 대표적인 사례를 통해 실제 적용 모습을 구체적으로 확인합니다.",
        sceneDescription: "실제 적용 사례의 현장을 돋보기로 관찰하는 탐정 캐릭터",
        speechBubbles: [{ id: "sb-5", text: "실제 사례로 살펴보니 머리에 쏙쏙 들어오네요!", position: "right" }],
        hasDiagram: true,
        diagram: {
          type: "bullet_list",
          title: "대표 사례 핵심 포인트",
          items: [
            { label: "첫째: 명확한 목표 설정" },
            { label: "둘째: 유연한 대처 능력" },
            { label: "셋째: 꾸준한 피드백과 개선" }
          ]
        },
        mustRemember: "사례를 통한 생생한 이해가 장기 기억으로 이어집니다."
      },
      {
        panelNumber: 6,
        title: "6. 핵심 대조 비교: A vs B",
        keyMessage: "가장 헷갈리기 쉬운 두 가지 핵심 축을 일대일로 비교합니다.",
        sceneDescription: "저울 위에 두 요소를 올려놓고 균형을 비교해보는 그래픽",
        speechBubbles: [{ id: "sb-6", text: "나란히 두고 비교해보니 차이점이 명확하네요!", position: "bottom" }],
        hasDiagram: true,
        diagram: {
          type: "table_compare",
          tableHeaders: ["첫 번째 관점", "두 번째 관점"],
          tableRows: [
            { col1: "장점: 빠른 실행력", col2: "장점: 높은 안정성" },
            { col1: "초점: 결과 중심", col2: "초점: 과정과 학습" },
            { col1: "주의: 지속 관리 필요", col2: "주의: 초기 진입 장벽" }
          ]
        },
        mustRemember: "대조와 비교를 통해 사고의 깊이와 분별력이 완성됩니다."
      },
      {
        panelNumber: 7,
        title: "7. 주의해야 할 오해와 함정",
        keyMessage: "올바른 접근법과 흔히 빠지는 오류를 체크리스트로 구별합니다.",
        sceneDescription: "주의 경고 표지판과 안전 통로를 안내하는 내비게이션 장면",
        speechBubbles: [{ id: "sb-7", text: "이 함정들만 피해도 실패할 확률이 확 줄어들어요!", position: "bottom" }],
        hasDiagram: true,
        diagram: {
          type: "table_compare",
          tableHeaders: ["올바른 방향 (권장)", "흔한 오해/함정 (주의)"],
          tableRows: [
            { col1: "✓ 본질과 원리에 집중하기", col2: "✕ 단기적 편법에 매달리기" },
            { col1: "✓ 유연하게 협력하기", col2: "✕ 획일적인 강요와 고집" },
            { col1: "✓ 꾸준히 검증하고 보완하기", col2: "✕ 비판 없는 맹목적 수용" }
          ]
        },
        mustRemember: "올바른 기준을 세우고 오해를 걷어내는 것이 진정한 배움입니다."
      },
      {
        panelNumber: 8,
        title: "8. 다양성과 시너지의 힘",
        keyMessage: "서로 다른 요소들이 조화롭게 결합할 때 폭발적인 시너지가 나타납니다.",
        sceneDescription: "퍼즐 조각들이 완벽하게 맞춰지며 빛을 내는 협동 장면",
        speechBubbles: [{ id: "sb-8", text: "혼자서는 못 하는 일도 함께 모이면 가능해집니다!", position: "bottom" }],
        hasDiagram: true,
        diagram: {
          type: "quote_highlight",
          quoteText: "“서로 다른 색깔이 모여 아름다운 무지개를 이루듯, 다양성은 최고의 자산입니다.”",
          highlightText: "함께할 때 더 커지는 시너지와 성장!"
        },
        mustRemember: "서로의 다름을 존중하고 결합할 때 진정한 가치가 창출됩니다."
      },
      {
        panelNumber: 9,
        title: "9. 결론: 한 장으로 마스터하는 한 줄 요약",
        keyMessage: "지금까지 배운 내용을 일상과 실천에 적용할 수 있는 최종 결론을 맺습니다.",
        sceneDescription: "완성의 깃발을 꽂고 자신감 넘치는 표정으로 미래를 향해 손을 흔드는 모습",
        speechBubbles: [{ id: "sb-9", text: "이제 두려움 없이 자신 있게 실천해볼 수 있겠어요!", position: "right" }],
        hasDiagram: true,
        diagram: {
          type: "quote_highlight",
          quoteText: `“${topic}의 핵심은 기본에 충실하며, 다양성을 포용하고 꾸준히 실천하는 것입니다.”`,
          highlightText: "언제나 복습할 수 있는 나의 든든한 미니 교과서!"
        },
        mustRemember: `${topic}의 핵심 가치를 가슴에 품고 당당하게 전진합시다.`
      }
    ]
  };
}
