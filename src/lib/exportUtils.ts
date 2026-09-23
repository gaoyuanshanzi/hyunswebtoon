import { ComicProject } from '@/types/comic';
import { normalizeCharacterType, CharacterRole } from '@/components/ComicCharacter';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

/**
 * 9가지 포즈 및 4가지 캐릭터 유형별 인라인 SVG 문자열 생성기 (HTML 내보내기용)
 */
function getCharacterSvgString(pose: string, gender = 'boy', size = 64): string {
  const role: CharacterRole = normalizeCharacterType(gender as any);
  const isFemale = role === 'girl' || role === 'woman';
  const isAdult = role === 'man' || role === 'woman';
  const prefix = `${pose}_${role}`;

  let jacketGradColors = '<stop offset="0%" stop-color="#2563eb"/><stop offset="100%" stop-color="#1d4ed8"/>';
  if (role === 'girl') jacketGradColors = '<stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#e11d48"/>';
  if (role === 'man') jacketGradColors = '<stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/>';
  if (role === 'woman') jacketGradColors = '<stop offset="0%" stop-color="#0d9488"/><stop offset="100%" stop-color="#0f766e"/>';

  let hairGradColors = '<stop offset="0%" stop-color="#334155"/><stop offset="100%" stop-color="#0f172a"/>';
  if (role === 'girl') hairGradColors = '<stop offset="0%" stop-color="#5c3822"/><stop offset="100%" stop-color="#2c1810"/>';
  if (role === 'man') hairGradColors = '<stop offset="0%" stop-color="#374151"/><stop offset="100%" stop-color="#111827"/>';
  if (role === 'woman') hairGradColors = '<stop offset="0%" stop-color="#451a03"/><stop offset="100%" stop-color="#1c1917"/>';

  const defs = `
    <defs>
      <linearGradient id="skinGrad_${prefix}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fff2e8"/>
        <stop offset="100%" stop-color="#ffd8b8"/>
      </linearGradient>
      <linearGradient id="jacketGrad_${prefix}" x1="0%" y1="0%" x2="100%" y2="100%">
        ${jacketGradColors}
      </linearGradient>
      <linearGradient id="hairGrad_${prefix}" x1="0%" y1="0%" x2="0%" y2="100%">
        ${hairGradColors}
      </linearGradient>
    </defs>
  `;

  const bodyBase = isAdult
    ? `
      <path d="M 36 160 C 38 122, 60 118, 80 118 C 100 118, 122 122, 124 160 Z" fill="url(#jacketGrad_${prefix})" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M 68 118 L 80 142 L 92 118 Z" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
      ${role === 'man' ? '<path d="M 77 126 L 83 126 L 82 155 L 80 160 L 78 155 Z" fill="#2563eb" stroke="#0f172a" stroke-width="2"/>' : '<circle cx="80" cy="134" r="2.5" fill="#f59e0b"/>'}
      <path d="M 62 118 L 74 140 L 70 160 M 98 118 L 86 140 L 90 160" stroke="#0f172a" stroke-width="2.5"/>
    `
    : `
      <path d="M 50 128 L 54 160 M 110 128 L 106 160" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
      <path d="M 50 128 L 54 160 M 110 128 L 106 160" stroke="${role === 'girl' ? '#fb7185' : '#475569'}" stroke-width="4" stroke-linecap="round"/>
      <path d="M 38 160 C 40 125, 60 120, 80 120 C 100 120, 120 125, 122 160 Z" fill="url(#jacketGrad_${prefix})" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M 68 122 C 72 135, 88 135, 92 122 Z" fill="#f8fafc" stroke="#0f172a" stroke-width="2.5"/>
      <path d="M 64 122 C 68 130, 72 148, 80 160 M 96 122 C 92 130, 88 148, 80 160" stroke="${role === 'girl' ? '#be123c' : '#1e3a8a'}" stroke-width="2"/>
    `;

  const headBase = (tilt = 0) => `
    <g transform="rotate(${tilt} 80 75)">
      <rect x="72" y="105" width="16" height="20" fill="url(#skinGrad_${prefix})" stroke="#0f172a" stroke-width="3"/>
      <ellipse cx="44" cy="80" rx="6" ry="8" fill="url(#skinGrad_${prefix})" stroke="#0f172a" stroke-width="2.5"/>
      <ellipse cx="116" cy="80" rx="6" ry="8" fill="url(#skinGrad_${prefix})" stroke="#0f172a" stroke-width="2.5"/>
      <path d="M 46 68 C 44 95, 60 114, 80 114 C 100 114, 116 95, 114 68 C 114 45, 46 45, 46 68 Z" fill="url(#skinGrad_${prefix})" stroke="#0f172a" stroke-width="3.5"/>
      <circle cx="56" cy="88" r="${isFemale ? 8 : 6.5}" fill="#f43f5e" opacity="${isFemale ? '0.45' : '0.3'}"/>
      <circle cx="104" cy="88" r="${isFemale ? 8 : 6.5}" fill="#f43f5e" opacity="${isFemale ? '0.45' : '0.3'}"/>
    </g>
  `;

  const hair = (tilt = 0) => {
    if (role === 'girl') {
      return `
        <g transform="rotate(${tilt} 80 75)">
          <path d="M 115 50 C 135 45, 142 65, 135 85 C 130 92, 122 85, 120 75 Z" fill="url(#hairGrad_${prefix})" stroke="#0f172a" stroke-width="3"/>
          <circle cx="118" cy="58" r="4.5" fill="#f43f5e" stroke="#0f172a" stroke-width="2"/>
          <path d="M 40 68 C 36 45, 54 26, 80 26 C 106 26, 124 45, 120 68 C 117 76, 120 84, 118 88 C 114 78, 115 62, 113 58 C 108 38, 95 32, 80 32 C 65 32, 52 38, 47 58 C 45 62, 46 78, 42 88 C 40 84, 43 76, 40 68 Z" fill="url(#hairGrad_${prefix})" stroke="#0f172a" stroke-width="3"/>
          <path d="M 44 56 C 50 64, 58 63, 64 66 C 68 58, 76 56, 82 66 C 88 56, 96 58, 102 66 C 108 58, 114 62, 116 56 C 112 40, 98 32, 80 32 C 62 32, 48 40, 44 56 Z" fill="url(#hairGrad_${prefix})" stroke="#0f172a" stroke-width="2.5"/>
          <path d="M 46 70 C 44 82, 46 92, 48 96 M 114 70 C 116 82, 114 92, 112 96" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        </g>
      `;
    }
    if (role === 'woman') {
      return `
        <g transform="rotate(${tilt} 80 75)">
          <path d="M 38 72 C 34 45, 52 25, 80 25 C 108 25, 126 45, 122 72 C 122 88, 124 98, 120 102 C 116 94, 115 80, 114 65 C 108 40, 95 32, 80 32 C 65 32, 52 40, 46 65 C 45 80, 44 94, 40 102 C 36 98, 38 88, 38 72 Z" fill="url(#hairGrad_${prefix})" stroke="#0f172a" stroke-width="3"/>
          <path d="M 42 60 C 50 68, 62 65, 72 68 C 76 56, 92 52, 114 58 C 110 40, 98 32, 80 32 C 60 32, 46 42, 42 60 Z" fill="url(#hairGrad_${prefix})" stroke="#0f172a" stroke-width="2.5"/>
        </g>
      `;
    }
    if (role === 'man') {
      return `
        <g transform="rotate(${tilt} 80 75)">
          <path d="M 42 68 C 38 46, 56 26, 80 26 C 104 26, 122 46, 118 68 C 116 75, 118 80, 116 84 C 114 78, 114 66, 112 60 C 108 42, 96 34, 80 34 C 64 34, 52 42, 48 60 C 46 66, 46 78, 44 84 C 42 80, 44 75, 42 68 Z" fill="url(#hairGrad_${prefix})" stroke="#0f172a" stroke-width="3"/>
          <path d="M 44 56 C 54 62, 66 60, 74 63 C 78 54, 94 50, 114 55 C 110 38, 96 32, 80 32 C 62 32, 48 40, 44 56 Z" fill="url(#hairGrad_${prefix})" stroke="#0f172a" stroke-width="2.5"/>
        </g>
      `;
    }
    // boy
    return `
      <g transform="rotate(${tilt} 80 75)">
        <path d="M 40 70 C 35 45, 55 25, 80 25 C 105 25, 125 45, 120 70 C 118 78, 122 84, 120 88 C 116 80, 116 65, 114 60 C 110 40, 95 32, 80 32 C 65 32, 50 40, 46 60 C 44 65, 44 80, 40 88 C 38 84, 42 78, 40 70 Z" fill="url(#hairGrad_${prefix})" stroke="#0f172a" stroke-width="3"/>
        <path d="M 43 55 C 50 62, 58 60, 62 65 C 65 58, 72 55, 78 66 C 82 56, 90 58, 96 66 C 100 58, 108 62, 116 56 C 112 40, 98 32, 80 32 C 60 32, 48 42, 43 55 Z" fill="url(#hairGrad_${prefix})" stroke="#0f172a" stroke-width="2.5"/>
        <path d="M 78 26 C 75 18, 85 16, 82 25" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
    `;
  };

  const eyelashes = (lx: number, ly: number, rx: number, ry: number) => {
    if (!isFemale) return '';
    return `
      <g stroke="#0f172a" stroke-width="1.8" stroke-linecap="round">
        <path d="M ${lx - 3} ${ly - 3} L ${lx - 6} ${ly - 6}"/>
        <path d="M ${rx + 3} ${ry - 3} L ${rx + 6} ${ry - 6}"/>
      </g>
    `;
  };

  let poseContent = '';

  if (pose === 'curious' || pose === 'headerLeft') {
    poseContent = `
      ${bodyBase}
      <path d="M 108 145 C 118 130, 110 108, 98 96" stroke="#0f172a" stroke-width="10" stroke-linecap="round"/>
      <path d="M 108 145 C 118 130, 110 108, 98 96" stroke="url(#jacketGrad_${prefix})" stroke-width="7" stroke-linecap="round"/>
      <circle cx="96" cy="94" r="7" fill="url(#skinGrad_${prefix})" stroke="#0f172a" stroke-width="2.5"/>
      ${headBase(-8)}
      <g transform="rotate(-8 80 75)">
        <path d="M 54 68 Q 63 64 70 70 M 90 70 Q 98 63 106 66" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none"/>
        <ellipse cx="62" cy="78" rx="4.5" ry="6" fill="#0f172a"/><circle cx="63.5" cy="76" r="2" fill="#ffffff"/>
        <ellipse cx="98" cy="78" rx="4.5" ry="6" fill="#0f172a"/><circle cx="99.5" cy="76" r="2" fill="#ffffff"/>
        ${eyelashes(62, 75, 98, 75)}
        <ellipse cx="80" cy="96" rx="4" ry="5" fill="#e11d48" stroke="#0f172a" stroke-width="2"/>
      </g>
      ${hair(-8)}
      <text x="115" y="45" font-size="22" font-weight="900" fill="${isFemale ? '#f43f5e' : '#3b82f6'}" font-family="sans-serif">?</text>
    `;
  } else if (pose === 'listening') {
    poseContent = `
      ${bodyBase}
      <path d="M 52 145 C 60 135, 70 135, 78 136 M 108 145 C 100 135, 90 135, 82 136" stroke="url(#jacketGrad_${prefix})" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="80" cy="136" rx="8" ry="6" fill="url(#skinGrad_${prefix})" stroke="#0f172a" stroke-width="2.5"/>
      ${headBase(4)}
      <g transform="rotate(4 80 75)">
        <path d="M 54 68 Q 63 63 70 67 M 90 67 Q 97 63 106 68" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none"/>
        <ellipse cx="62" cy="78" rx="5" ry="6.5" fill="#0f172a"/><circle cx="63.5" cy="75.5" r="2.5" fill="#ffffff"/>
        <ellipse cx="98" cy="78" rx="5" ry="6.5" fill="#0f172a"/><circle cx="99.5" cy="75.5" r="2.5" fill="#ffffff"/>
        ${eyelashes(62, 75, 98, 75)}
        <path d="M 74 95 Q 80 100 86 95" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      </g>
      ${hair(4)}
    `;
  } else if (pose === 'thinking') {
    poseContent = `
      ${bodyBase}
      <path d="M 112 145 C 118 125, 112 100, 104 88" stroke="url(#jacketGrad_${prefix})" stroke-width="7" stroke-linecap="round"/>
      <circle cx="104" cy="86" r="6" fill="url(#skinGrad_${prefix})" stroke="#0f172a" stroke-width="2.5"/>
      ${headBase(0)}
      <g>
        <path d="M 54 69 L 70 70 M 90 70 L 106 69" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="65" cy="78" rx="4.5" ry="5.5" fill="#0f172a"/><circle cx="66" cy="76" r="1.8" fill="#ffffff"/>
        <ellipse cx="101" cy="78" rx="4.5" ry="5.5" fill="#0f172a"/><circle cx="102" cy="76" r="1.8" fill="#ffffff"/>
        ${eyelashes(65, 75, 101, 75)}
        <path d="M 76 96 L 84 96" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      ${hair(0)}
    `;
  } else if (pose === 'comparing') {
    poseContent = `
      ${bodyBase}
      <path d="M 44 148 C 35 130, 32 118, 30 110 M 116 148 C 125 130, 128 118, 130 110" stroke="url(#jacketGrad_${prefix})" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="28" cy="108" rx="6" ry="5" fill="url(#skinGrad_${prefix})" stroke="#0f172a" stroke-width="2.5"/>
      <ellipse cx="132" cy="108" rx="6" ry="5" fill="url(#skinGrad_${prefix})" stroke="#0f172a" stroke-width="2.5"/>
      ${headBase(0)}
      <g>
        <ellipse cx="62" cy="78" rx="4.5" ry="5.5" fill="#0f172a"/><circle cx="63.5" cy="76" r="1.8" fill="#ffffff"/>
        <ellipse cx="98" cy="78" rx="4.5" ry="5.5" fill="#0f172a"/><circle cx="99.5" cy="76" r="1.8" fill="#ffffff"/>
        ${eyelashes(62, 75, 98, 75)}
        <path d="M 75 96 Q 80 99 85 96" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      </g>
      ${hair(0)}
    `;
  } else if (pose === 'impressed') {
    poseContent = `
      ${bodyBase}
      <path d="M 112 145 C 105 130, 95 125, 84 126" stroke="url(#jacketGrad_${prefix})" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="82" cy="126" rx="7" ry="6" fill="url(#skinGrad_${prefix})" stroke="#0f172a" stroke-width="2.5"/>
      ${headBase(3)}
      <g transform="rotate(3 80 75)">
        <path d="M 57 78 Q 63 72 69 78 M 93 78 Q 99 72 105 78" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        ${eyelashes(57, 76, 105, 76)}
        <path d="M 74 95 Q 80 102 86 95" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="#e11d48"/>
      </g>
      ${hair(3)}
    `;
  } else if (pose === 'explaining' || pose === 'headerRight') {
    poseContent = `
      ${bodyBase}
      <path d="M 112 145 C 122 135, 130 130, 142 125" stroke="url(#jacketGrad_${prefix})" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="144" cy="123" rx="7" ry="5" fill="url(#skinGrad_${prefix})" stroke="#0f172a" stroke-width="2.5"/>
      ${headBase(-3)}
      <g transform="rotate(-3 80 75)">
        <ellipse cx="62" cy="77" rx="4.5" ry="6" fill="#0f172a"/><circle cx="63.5" cy="75" r="2" fill="#ffffff"/>
        <ellipse cx="98" cy="77" rx="4.5" ry="6" fill="#0f172a"/><circle cx="99.5" cy="75" r="2" fill="#ffffff"/>
        ${eyelashes(62, 74, 98, 74)}
        <path d="M 75 94 Q 80 102 85 94 Z" fill="#e11d48" stroke="#0f172a" stroke-width="2"/>
      </g>
      ${hair(-3)}
    `;
  } else if (pose === 'realized') {
    poseContent = `
      ${bodyBase}
      <path d="M 112 145 C 124 130, 126 100, 126 78 L 126 62" stroke="url(#jacketGrad_${prefix})" stroke-width="7" stroke-linecap="round"/>
      <circle cx="126" cy="62" r="5" fill="url(#skinGrad_${prefix})" stroke="#0f172a" stroke-width="2"/>
      ${headBase(5)}
      <g transform="rotate(5 80 75)">
        <ellipse cx="62" cy="76" rx="5.5" ry="6.5" fill="#0f172a"/><circle cx="64" cy="74" r="2.5" fill="#ffffff"/>
        <ellipse cx="98" cy="76" rx="5.5" ry="6.5" fill="#0f172a"/><circle cx="100" cy="74" r="2.5" fill="#ffffff"/>
        ${eyelashes(62, 73, 98, 73)}
        <ellipse cx="80" cy="95" rx="5" ry="6" fill="#e11d48" stroke="#0f172a" stroke-width="2"/>
      </g>
      ${hair(5)}
      <circle cx="130" cy="42" r="6" fill="#fde047" stroke="#f59e0b" stroke-width="2"/>
    `;
  } else if (pose === 'smiling') {
    poseContent = `
      ${bodyBase}
      <path d="M 50 145 C 60 138, 70 138, 76 138" stroke="url(#jacketGrad_${prefix})" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="78" cy="138" rx="6" ry="5" fill="url(#skinGrad_${prefix})" stroke="#0f172a" stroke-width="2"/>
      ${headBase(2)}
      <g transform="rotate(2 80 75)">
        <path d="M 56 77 Q 62 70 68 77 M 92 77 Q 98 70 104 77" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        ${eyelashes(56, 75, 104, 75)}
        <path d="M 72 93 Q 80 104 88 93 Z" fill="#e11d48" stroke="#0f172a" stroke-width="2"/>
        <path d="M 74 93 Q 80 97 86 93" fill="#ffffff"/>
      </g>
      ${hair(2)}
    `;
  } else {
    // cheering (9컷)
    poseContent = `
      ${bodyBase}
      <path d="M 112 145 C 126 128, 130 95, 128 72" stroke="url(#jacketGrad_${prefix})" stroke-width="7" stroke-linecap="round"/>
      <circle cx="128" cy="68" r="8" fill="url(#skinGrad_${prefix})" stroke="#0f172a" stroke-width="2.5"/>
      ${headBase(-2)}
      <g transform="rotate(-2 80 75)">
        <ellipse cx="62" cy="76" rx="5" ry="6" fill="#0f172a"/><circle cx="64" cy="74" r="2.2" fill="#ffffff"/>
        <ellipse cx="98" cy="76" rx="5" ry="6" fill="#0f172a"/><circle cx="100" cy="74" r="2.2" fill="#ffffff"/>
        ${eyelashes(62, 73, 98, 73)}
        <path d="M 73 93 Q 80 105 87 93 Z" fill="#e11d48" stroke="#0f172a" stroke-width="2"/>
        <path d="M 75 93 Q 80 97 85 93" fill="#ffffff"/>
      </g>
      ${hair(-2)}
      <text x="135" y="45" font-size="20" fill="#f59e0b">✨</text>
    `;
  }

  return `
    <svg viewBox="0 0 160 160" width="${size}" height="${size}" style="width:${size}px; height:${size}px; overflow:visible;">
      ${defs}
      ${poseContent}
    </svg>
  `;
}

const poseList = ['curious', 'listening', 'thinking', 'comparing', 'impressed', 'explaining', 'realized', 'smiling', 'cheering'];

/**
 * 만화 프로젝트를 완벽한 단독 실행형(standalone) HTML 파일로 생성하고 로컬 다운로드합니다.
 */
export function exportComicToHtml(comic: ComicProject) {
  const numberBadges = ['❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽', '❾'];
  const globalGender = comic.characterGender || 'male';

  // 패널 HTML 렌더러
  const panelsHtml = comic.panels
    .map((panel, idx) => {
      const badge = numberBadges[idx] || `[${idx + 1}]`;
      const pose = poseList[idx] || 'cheering';
      const panelGender = panel.characterGender || globalGender;
      const charSvg = getCharacterSvgString(pose, panelGender, 72);

      // 도식 렌더러
      let diagramHtml = '';
      if (panel.diagram && panel.diagram.type !== 'none') {
        const d = panel.diagram;
        if (d.type === 'scroll') {
          diagramHtml = `
            <div class="scroll-box">
              <div class="scroll-title">📜 ${d.title || '출발점 질문'}</div>
              <p class="scroll-text">${d.highlightText || ''}</p>
            </div>
          `;
        } else if (d.type === 'network') {
          const items = (d.items || [])
            .map((it) => `<span class="badge ${it.color ? 'badge-color' : ''}">${it.label}</span>`)
            .join(' ');
          diagramHtml = `
            <div class="network-box">
              <div class="network-title">${d.title || '핵심 요소'}</div>
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

      // 말풍선들 (왼쪽 꼬리표로 캐릭터를 명확히 가리킴!)
      const bubblesHtml = (panel.speechBubbles || [{ id: '1', text: '핵심을 기억해요!' }])
        .map(
          (b) => `
          <div class="speech-bubble speech-bubble-tail-left">
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
            
            <!-- 캐릭터 아바타 + 말풍선 결합 영역 (말풍선이 캐릭터를 가리킴) -->
            <div class="character-speech-row">
              <div class="char-avatar-box">
                ${charSvg}
              </div>
              <div class="bubble-column">
                ${bubblesHtml}
              </div>
            </div>
          </div>
          <div class="panel-footer">
            "${panel.mustRemember}"
          </div>
        </div>
      `;
    })
    .join('');

  const headerLeftSvg = getCharacterSvgString('curious', globalGender, 68);
  const headerRightSvg = getCharacterSvgString('explaining', globalGender, 68);

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
      max-width: 1200px;
      border: 3px solid #0f172a;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      padding: 24px;
    }
    .header-banner {
      display: grid;
      grid-template-columns: 2.8fr 6.4fr 2.8fr;
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
    .header-avatar {
      width: 64px;
      height: 64px;
      border: 2px solid #0f172a;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eff6ff;
      flex-shrink: 0;
      overflow: hidden;
    }
    .header-speech {
      position: relative;
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
      font-size: 40px;
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
    /* 캐릭터와 말풍선 행 */
    .character-speech-row {
      display: flex;
      align-items: flex-end;
      gap: 10px;
      margin-top: auto;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
    }
    .char-avatar-box {
      width: 68px;
      height: 68px;
      border-radius: 12px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }
    .bubble-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    /* 말풍선 기본 및 왼쪽 꼬리표 (캐릭터 입 가리키기) */
    .speech-bubble {
      position: relative;
      background: #fffbeb;
      border: 1.5px solid #0f172a;
      border-radius: 10px;
      padding: 7px 10px;
      font-size: 11px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.35;
      box-shadow: 2px 2px 0 rgba(15, 23, 42, 0.8);
    }
    .speech-bubble-tail-left::after {
      content: '';
      position: absolute;
      left: -8px;
      top: 12px;
      border-width: 6px 9px 6px 0;
      border-style: solid;
      border-color: transparent #fffbeb transparent transparent;
      display: block;
      width: 0;
    }
    .speech-bubble-tail-left::before {
      content: '';
      position: absolute;
      left: -11px;
      top: 11px;
      border-width: 7px 11px 7px 0;
      border-style: solid;
      border-color: transparent #0f172a transparent transparent;
      display: block;
      width: 0;
    }
    .speech-bubble-tail-right::after {
      content: '';
      position: absolute;
      right: -8px;
      top: 12px;
      border-width: 6px 0 6px 9px;
      border-style: solid;
      border-color: transparent transparent transparent #eff6ff;
      display: block;
      width: 0;
    }
    .speech-bubble-tail-right::before {
      content: '';
      position: absolute;
      right: -11px;
      top: 11px;
      border-width: 7px 0 7px 11px;
      border-style: solid;
      border-color: transparent transparent transparent #1e3a8a;
      display: block;
      width: 0;
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
      padding: 8px;
    }
    .scroll-title {
      font-size: 10px;
      font-weight: 900;
      color: #78350f;
      text-align: center;
      border-bottom: 1px solid #fde68a;
      padding-bottom: 3px;
      margin-bottom: 4px;
    }
    .scroll-text {
      font-size: 10px;
      line-height: 1.4;
      color: #451a03;
      text-align: justify;
    }
    .network-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 6px;
      text-align: center;
    }
    .network-title { font-size: 10px; font-weight: 900; margin-bottom: 4px; }
    .badges-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; margin-bottom: 4px; }
    .badge {
      font-size: 9px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 12px;
      background: #3b82f6;
      color: white;
    }
    .network-sub { font-size: 9px; font-weight: 700; color: #475569; }
    .compare-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
    .mini-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 4px;
      text-align: center;
      font-size: 9px;
    }
    .mini-desc { font-size: 8px; color: #475569; margin-top: 2px; }
    .compare-banner {
      background: #fef3c7;
      border-radius: 6px;
      padding: 4px;
      font-size: 9px;
      font-weight: 900;
      color: #78350f;
      text-align: center;
      margin-top: 4px;
    }
    .bullet-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 6px;
      font-size: 10px;
    }
    .bullet-title { font-weight: 900; color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 4px; }
    .bullet-box ul { list-style: none; }
    .bullet-box li { font-size: 9px; margin-bottom: 2px; color: #334155; }
    .table-compare {
      width: 100%;
      border-collapse: collapse;
      font-size: 9px;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
    }
    .table-compare th { padding: 4px; color: white; }
    .th-left { background: #2563eb; }
    .th-right { background: #0d9488; }
    .table-compare td {
      border: 1px solid #e2e8f0;
      padding: 3px 5px;
      font-size: 9px;
      background: #ffffff;
    }
    .quote-box {
      background: #fff7ed;
      border: 1px solid #fed7aa;
      border-radius: 8px;
      padding: 6px;
      text-align: center;
    }
    .quote-main { font-size: 10px; font-weight: 900; color: #7c2d12; line-height: 1.35; }
    .quote-sub { font-size: 9px; font-weight: 700; color: #9a3412; margin-top: 3px; }
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
        <div class="header-avatar">${headerLeftSvg}</div>
        <div class="header-speech speech-bubble-tail-left">${comic.headerDialogue.leftCharacter.dialogue}</div>
      </div>
      <div class="main-title-block">
        <h1 class="main-title">${comic.title}</h1>
        <div class="main-subtitle">${comic.subtitle}</div>
        <div class="main-source">${comic.sourceNote || '글·구성: 교육 인포그래픽 만화 연구팀'}</div>
      </div>
      <div class="header-char" style="justify-content: flex-end;">
        <div class="header-speech speech-bubble-tail-right" style="background: #eff6ff; color: #1e3a8a;">${comic.headerDialogue.rightCharacter.dialogue}</div>
        <div class="header-avatar" style="background: #e0e7ff;">${headerRightSvg}</div>
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
      pixelRatio: 2,
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
