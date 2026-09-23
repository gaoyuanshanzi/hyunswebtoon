import { ComicProject } from '@/types/comic';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

/**
 * 만화 프로젝트를 완벽한 단독 실행형(standalone) HTML 파일로 생성하고 로컬 다운로드합니다.
 */
export function exportComicToHtml(comic: ComicProject) {
  const numberBadges = ['❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽', '❾'];

  // 패널 HTML 렌더러
  const panelsHtml = comic.panels
    .map((panel, idx) => {
      const badge = numberBadges[idx] || `[${idx + 1}]`;

      // 도식 렌더러
      let diagramHtml = '';
      if (panel.diagram && panel.diagram.type !== 'none') {
        const d = panel.diagram;
        if (d.type === 'scroll') {
          diagramHtml = `
            <div class="scroll-box">
              <div class="scroll-title">📜 ${d.title || '사도신경'}</div>
              <p class="scroll-text">${d.highlightText || ''}</p>
            </div>
          `;
        } else if (d.type === 'network') {
          const items = (d.items || [])
            .map((it) => `<span class="badge ${it.color ? 'badge-color' : ''}">${it.label}</span>`)
            .join(' ');
          diagramHtml = `
            <div class="network-box">
              <div class="network-title">${d.title || '한 몸, 많은 지체'}</div>
              <div class="badges-row">${items}</div>
              ${d.highlightText ? `<p class="network-sub">${d.highlightText}</p>` : ''}
            </div>
          `;
        } else if (d.type === 'cards_compare') {
          const cards = (d.items || [])
            .map(
              (it) => `
              <div class="mini-card">
                <strong>${it.label}</strong>
                <div class="mini-desc">${(it.description || '').replace(/\n/g, '<br/>')}</div>
              </div>
            `
            )
            .join('');
          diagramHtml = `
            <div class="compare-grid">${cards}</div>
            ${d.highlightText ? `<div class="compare-banner">${d.highlightText}</div>` : ''}
          `;
        } else if (d.type === 'bullet_list') {
          const lis = (d.items || []).map((it) => `<li>• ${it.label}</li>`).join('');
          diagramHtml = `
            <div class="bullet-box">
              <div class="bullet-title">🛡️ ${d.title || '핵심 원리'}</div>
              <ul>${lis}</ul>
            </div>
          `;
        } else if (d.type === 'table_compare') {
          const headers = d.tableHeaders || ['장로교', '감리교'];
          const rows = (d.tableRows || [])
            .map(
              (r) => `
              <tr>
                <td>${r.col1}</td>
                <td>${r.col2}</td>
              </tr>
            `
            )
            .join('');
          diagramHtml = `
            <table class="table-compare">
              <thead>
                <tr>
                  <th class="th-left">${headers[0]}</th>
                  <th class="th-right">${headers[1]}</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          `;
        } else if (d.type === 'quote_highlight') {
          diagramHtml = `
            <div class="quote-box">
              <p class="quote-main">“${d.quoteText || ''}”</p>
              ${d.highlightText ? `<p class="quote-sub">${d.highlightText}</p>` : ''}
            </div>
          `;
        }
      }

      // 말풍선들
      const bubblesHtml = (panel.speechBubbles || [])
        .map(
          (b) => `
          <div class="speech-bubble">
            ${b.text}
          </div>
        `
        )
        .join('');

      return `
        <div class="panel">
          <div class="panel-header">
            <span class="badge-num">${badge}</span>
            <span class="panel-title">${panel.title}</span>
          </div>
          <div class="panel-body">
            <p class="key-message">${panel.keyMessage}</p>
            ${diagramHtml}
            ${bubblesHtml}
          </div>
          <div class="panel-footer">
            "${panel.mustRemember}"
          </div>
        </div>
      `;
    })
    .join('');

  const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${comic.title} - 9컷 교육용 인포그래픽 만화</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Do+Hyeon&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #f1f5f9;
      font-family: 'Noto Sans KR', sans-serif;
      color: #0f172a;
      padding: 30px 15px;
      display: flex;
      justify-content: center;
    }
    .comic-canvas {
      background: #ffffff;
      width: 100%;
      max-width: 1160px;
      border: 3px solid #0f172a;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      padding: 24px;
    }
    .header-banner {
      display: grid;
      grid-template-columns: 2.5fr 7fr 2.5fr;
      gap: 15px;
      align-items: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .header-char {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .avatar {
      width: 50px;
      height: 50px;
      border: 2px solid #0f172a;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      background: #fef3c7;
      flex-shrink: 0;
    }
    .avatar.right { background: #dbeafe; }
    .header-speech {
      background: #ffffff;
      border: 2px solid #0f172a;
      border-radius: 12px;
      padding: 8px 12px;
      font-size: 11px;
      font-weight: 700;
      box-shadow: 2px 2px 0 #0f172a;
      line-height: 1.35;
    }
    .main-title-block { text-align: center; }
    .main-title {
      font-family: 'Do Hyeon', 'Noto Sans KR', sans-serif;
      font-size: 38px;
      font-weight: 900;
      color: #020617;
      line-height: 1.1;
      margin-bottom: 4px;
    }
    .main-subtitle {
      font-size: 14px;
      font-weight: 700;
      color: #475569;
    }
    .main-source {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 6px;
    }
    /* 3x3 Grid */
    .grid-3x3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .panel {
      border: 2px solid #0f172a;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ffffff;
    }
    .panel-header {
      background: #0f172a;
      color: #ffffff;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge-num {
      color: #fde047;
      font-weight: 900;
      font-size: 16px;
    }
    .panel-title {
      font-size: 13px;
      font-weight: 900;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .panel-body {
      padding: 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    }
    .key-message {
      font-size: 12px;
      font-weight: 600;
      line-height: 1.45;
      color: #1e293b;
    }
    .speech-bubble {
      background: #fffbeb;
      border: 1.5px solid #0f172a;
      border-radius: 10px;
      padding: 8px 10px;
      font-size: 11px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.35;
      box-shadow: 2px 2px 0 rgba(15, 23, 42, 0.8);
    }
    .panel-footer {
      background: #f1f5f9;
      border-top: 2px solid #0f172a;
      padding: 8px 10px;
      text-align: center;
      font-size: 11px;
      font-weight: 900;
      color: #0f172a;
    }
    /* 도식 스타일들 */
    .scroll-box {
      background: #fffbeb;
      border: 1.5px solid #b45309;
      border-radius: 8px;
      padding: 10px;
      box-shadow: inset 0 0 8px rgba(180, 83, 9, 0.1);
    }
    .scroll-title {
      font-size: 11px;
      font-weight: 900;
      color: #78350f;
      text-align: center;
      border-bottom: 1px solid #fde68a;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .scroll-text {
      font-size: 11px;
      line-height: 1.45;
      color: #451a03;
      text-align: justify;
    }
    .network-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 8px;
      text-align: center;
    }
    .network-title { font-size: 11px; font-weight: 900; margin-bottom: 6px; }
    .badges-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; margin-bottom: 6px; }
    .badge {
      font-size: 10px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 12px;
      background: #3b82f6;
      color: white;
    }
    .network-sub { font-size: 10px; font-weight: 700; color: #475569; }
    .compare-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
    .mini-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 4px;
      text-align: center;
      font-size: 10px;
    }
    .mini-desc { font-size: 9px; color: #475569; margin-top: 2px; }
    .compare-banner {
      background: #fef3c7;
      border-radius: 6px;
      padding: 4px;
      font-size: 10px;
      font-weight: 900;
      color: #78350f;
      text-align: center;
      margin-top: 4px;
    }
    .bullet-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 8px;
      font-size: 11px;
    }
    .bullet-title { font-weight: 900; color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px; }
    .bullet-box ul { list-style: none; }
    .bullet-box li { font-size: 10px; margin-bottom: 3px; color: #334155; }
    .table-compare {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
    }
    .table-compare th { padding: 5px; color: white; }
    .th-left { background: #2563eb; }
    .th-right { background: #0d9488; }
    .table-compare td {
      border: 1px solid #e2e8f0;
      padding: 4px 6px;
      font-size: 10px;
      background: #ffffff;
    }
    .quote-box {
      background: #fff7ed;
      border: 1px solid #fed7aa;
      border-radius: 8px;
      padding: 8px;
      text-align: center;
    }
    .quote-main { font-size: 11px; font-weight: 900; color: #7c2d12; line-height: 1.35; }
    .quote-sub { font-size: 10px; font-weight: 700; color: #9a3412; margin-top: 4px; }
    .footer-note {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #94a3b8;
    }
    @media print {
      body { background: white; padding: 0; }
      .comic-canvas { border: none; box-shadow: none; width: 100%; max-width: none; }
    }
  </style>
</head>
<body>
  <div class="comic-canvas">
    <div class="header-banner">
      <div class="header-char">
        <div class="avatar">🙋‍♂️</div>
        <div class="header-speech">${comic.headerDialogue.leftCharacter.dialogue}</div>
      </div>
      <div class="main-title-block">
        <h1 class="main-title">${comic.title}</h1>
        <div class="main-subtitle">${comic.subtitle}</div>
        <div class="main-source">${comic.sourceNote || '글·구성: 교육 인포그래픽 만화 연구팀'}</div>
      </div>
      <div class="header-char" style="justify-content: flex-end;">
        <div class="header-speech" style="background: #eff6ff; color: #1e3a8a;">${comic.headerDialogue.rightCharacter.dialogue}</div>
        <div class="avatar right">⛪</div>
      </div>
    </div>

    <div class="grid-3x3">
      ${panelsHtml}
    </div>

    <div class="footer-note">
      <span>현스 9컷 교육용 인포그래픽 만화 &bull; 한 장으로 읽는 미니 교과서</span>
      <span>생성일: ${new Date().toLocaleDateString('ko-KR')}</span>
    </div>
  </div>
</body>
</html>`;

  // Blob 생성 및 다운로드 트리거
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeTitle = comic.title.replace(/[^a-zA-Z0-9가-힣]/g, '_');
  link.href = url;
  link.download = `hyuns-comic-${safeTitle}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.8 },
  });
}

/**
 * 캔버스 요소를 고해상도 PNG 이미지로 저장합니다.
 */
export async function exportComicToPng(comic: ComicProject) {
  const element = document.getElementById('comic-export-root');
  if (!element) {
    alert('만화 요소를 찾을 수 없습니다.');
    return;
  }

  try {
    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2, // 고해상도 출력
    });

    const link = document.createElement('a');
    const safeTitle = comic.title.replace(/[^a-zA-Z0-9가-힣]/g, '_');
    link.download = `hyuns-comic-${safeTitle}.png`;
    link.href = dataUrl;
    link.click();

    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.8 },
    });
  } catch (err) {
    console.error('Failed to export PNG:', err);
    alert('이미지 내보내기 중 오류가 발생했습니다. 브라우저 인쇄(Ctrl+P)를 활용하실 수도 있습니다.');
  }
}
