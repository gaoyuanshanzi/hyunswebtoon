import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, panelNumber } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 한국 교육용 만화 스타일 키워드 추가
    const enhancedPrompt = `${prompt}, Korean educational webtoon style, warm clean lineart, vibrant friendly colors, manhwa infographic illustration, high quality, soft shading, clear character expressions, textbook style, no watermark, no text artifacts`;
    
    // Pollinations AI 고품질 무료 이미지 생성 URL (Next.js SSR/CSR에서 즉시 로드 가능)
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const seed = Math.floor(Math.random() * 100000) + (panelNumber || 1) * 777;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=600&height=400&nologo=true&seed=${seed}&enhance=false`;

    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
