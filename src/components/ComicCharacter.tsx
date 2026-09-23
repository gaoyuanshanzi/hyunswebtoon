'use client';

import React from 'react';

export type CharacterPose =
  | 'curious'     // 1컷: 갸우뚱, 고민, 질문
  | 'listening'   // 2컷: 경청, 눈 반짝임
  | 'thinking'    // 3컷: 깊은 생각, 탐구, 턱에 손
  | 'comparing'   // 4컷: 가리키기, 비교
  | 'impressed'   // 5컷: 가슴에 손, 감탄과 공감
  | 'explaining'  // 6컷: 손을 펼쳐 대화/설명
  | 'realized'    // 7컷: 번뜩임, 아하! 검지 들기
  | 'smiling'     // 8컷: 활짝 웃는 미소, 따뜻함
  | 'cheering'    // 9컷: 주먹 불끈, 결의와 희망
  | 'headerLeft'  // 상단 좌측: 배낭 멘 호기심 소년
  | 'headerRight'; // 상단 우측: 미소 띤 안내자 소년

interface ComicCharacterProps {
  pose: CharacterPose;
  className?: string;
  size?: number;
}

export default function ComicCharacter({ pose, className = '', size = 120 }: ComicCharacterProps) {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 160 160"
        width={size}
        height={size}
        className="w-full h-full drop-shadow-sm overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 피부톤 그라데이션 */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffeedd" />
            <stop offset="100%" stopColor="#ffd8b8" />
          </linearGradient>

          {/* 볼터치 필터 */}
          <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </radialGradient>

          {/* 파란 재킷 그라데이션 */}
          <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* 머리카락 하이라이트 */}
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {renderCharacterPose(pose)}
      </svg>
    </div>
  );
}

function renderCharacterPose(pose: CharacterPose) {
  // 공통 기저 요소: 몸통/어깨 (파란색 후드 재킷과 티셔츠)
  const renderBody = (armLeft?: React.ReactNode, armRight?: React.ReactNode) => (
    <g id="body-group">
      {/* 백팩 끈 */}
      <path
        d="M 50 128 L 54 160 M 110 128 L 106 160"
        stroke="#0f172a"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M 50 128 L 54 160 M 110 128 L 106 160"
        stroke="#475569"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* 어깨와 몸통 */}
      <path
        d="M 38 160 C 40 125, 60 120, 80 120 C 100 120, 120 125, 122 160 Z"
        fill="url(#jacketGrad)"
        stroke="#0f172a"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* 이너 티셔츠 & 후드 카라 */}
      <path
        d="M 68 122 C 72 135, 88 135, 92 122 Z"
        fill="#f8fafc"
        stroke="#0f172a"
        strokeWidth="2.5"
      />

      {/* 후드 깃/지퍼 라인 */}
      <path
        d="M 64 122 C 68 130, 72 148, 80 160 M 96 122 C 92 130, 88 148, 80 160"
        stroke="#1e3a8a"
        strokeWidth="2"
      />

      {/* 팔/손 제스처 커스텀 */}
      {armLeft}
      {armRight}
    </g>
  );

  // 공통 머리/얼굴 기저 (귀, 얼굴형, 목)
  const renderHeadBase = (tiltAngle = 0, tiltX = 80, tiltY = 75) => (
    <g transform={`rotate(${tiltAngle} ${tiltX} ${tiltY})`}>
      {/* 목 */}
      <rect
        x="72"
        y="105"
        width="16"
        height="20"
        fill="url(#skinGrad)"
        stroke="#0f172a"
        strokeWidth="3"
      />

      {/* 귀 좌우 */}
      <ellipse
        cx="44"
        cy="80"
        rx="6"
        ry="8"
        fill="url(#skinGrad)"
        stroke="#0f172a"
        strokeWidth="2.5"
      />
      <ellipse
        cx="116"
        cy="80"
        rx="6"
        ry="8"
        fill="url(#skinGrad)"
        stroke="#0f172a"
        strokeWidth="2.5"
      />

      {/* 얼굴 윤곽 */}
      <path
        d="M 46 68 C 44 95, 60 114, 80 114 C 100 114, 116 95, 114 68 C 114 45, 46 45, 46 68 Z"
        fill="url(#skinGrad)"
        stroke="#0f172a"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* 볼터치 (생기 있는 홍조) */}
      <circle cx="56" cy="88" r="7" fill="url(#blushGrad)" />
      <circle cx="104" cy="88" r="7" fill="url(#blushGrad)" />
    </g>
  );

  // 공통 헤어스타일 (웹툰 스타일 댄디 투블럭 컷)
  const renderHair = (tiltAngle = 0, tiltX = 80, tiltY = 75) => (
    <g transform={`rotate(${tiltAngle} ${tiltX} ${tiltY})`}>
      {/* 뒷머리/볼륨 */}
      <path
        d="M 40 70 C 35 45, 55 25, 80 25 C 105 25, 125 45, 120 70 C 118 78, 122 84, 120 88 C 116 80, 116 65, 114 60 C 110 40, 95 32, 80 32 C 65 32, 50 40, 46 60 C 44 65, 44 80, 40 88 C 38 84, 42 78, 40 70 Z"
        fill="url(#hairGrad)"
        stroke="#0f172a"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* 앞머리 가닥들 (자연스러운 텍스처) */}
      <path
        d="M 43 55 C 50 62, 58 60, 62 65 C 65 58, 72 55, 78 66 C 82 56, 90 58, 96 66 C 100 58, 108 62, 116 56 C 112 40, 98 32, 80 32 C 60 32, 48 42, 43 55 Z"
        fill="url(#hairGrad)"
        stroke="#0f172a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* 살짝 삐친 귀여운 잔머리 */}
      <path
        d="M 78 26 C 75 18, 85 16, 82 25"
        stroke="#0f172a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );

  // -------------------------------------------------------------
  // 포즈 1: CURIOUS (1컷 - 갸우뚱, 호기심, 질문)
  // -------------------------------------------------------------
  if (pose === 'curious' || pose === 'headerLeft') {
    return (
      <g>
        {renderBody(
          // 오른손으로 턱을 굄
          <g>
            <path
              d="M 108 145 C 118 130, 110 108, 98 96"
              stroke="#0f172a"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 108 145 C 118 130, 110 108, 98 96"
              stroke="url(#jacketGrad)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* 손 */}
            <circle cx="96" cy="94" r="7" fill="url(#skinGrad)" stroke="#0f172a" strokeWidth="2.5" />
          </g>
        )}
        {renderHeadBase(-8)}
        <g transform="rotate(-8 80 75)">
          {/* 눈썹: 한쪽 올라감 */}
          <path d="M 54 68 Q 63 64 70 70" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 90 70 Q 98 63 106 66" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* 눈: 똥그랗게 뜨고 위를 쳐다봄 */}
          <ellipse cx="62" cy="78" rx="4.5" ry="6" fill="#0f172a" />
          <circle cx="63.5" cy="76" r="2" fill="#ffffff" />
          <ellipse cx="98" cy="78" rx="4.5" ry="6" fill="#0f172a" />
          <circle cx="99.5" cy="76" r="2" fill="#ffffff" />
          {/* 코 */}
          <path d="M 78 84 L 80 87" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          {/* 입: 살짝 벌린 o모양 */}
          <ellipse cx="80" cy="96" rx="4" ry="5" fill="#e11d48" stroke="#0f172a" strokeWidth="2" />
        </g>
        {renderHair(-8)}
        {/* 물음표 아이콘 */}
        <text x="115" y="45" fontSize="22" fontWeight="900" fill="#3b82f6" fontFamily="sans-serif">?</text>
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 2: LISTENING (2컷 - 경청, 눈 반짝임, 손 모으기)
  // -------------------------------------------------------------
  if (pose === 'listening') {
    return (
      <g>
        {renderBody(
          // 두 손을 가슴 앞에 가지런히 모음
          <g>
            <path d="M 52 145 C 60 135, 70 135, 78 136" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
            <path d="M 52 145 C 60 135, 70 135, 78 136" stroke="url(#jacketGrad)" strokeWidth="6" strokeLinecap="round" />
            <path d="M 108 145 C 100 135, 90 135, 82 136" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
            <path d="M 108 145 C 100 135, 90 135, 82 136" stroke="url(#jacketGrad)" strokeWidth="6" strokeLinecap="round" />
            {/* 맞잡은 두 손 */}
            <ellipse cx="80" cy="136" rx="8" ry="6" fill="url(#skinGrad)" stroke="#0f172a" strokeWidth="2.5" />
          </g>
        )}
        {renderHeadBase(4)}
        <g transform="rotate(4 80 75)">
          {/* 눈썹: 부드럽고 다정한 아치 */}
          <path d="M 54 68 Q 63 63 70 67" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 90 67 Q 97 63 106 68" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* 눈: 초롱초롱 반짝이는 큰 눈동자 */}
          <ellipse cx="62" cy="78" rx="5" ry="6.5" fill="#0f172a" />
          <circle cx="63.5" cy="75.5" r="2.5" fill="#ffffff" />
          <circle cx="61" cy="80.5" r="1.2" fill="#ffffff" />
          <ellipse cx="98" cy="78" rx="5" ry="6.5" fill="#0f172a" />
          <circle cx="99.5" cy="75.5" r="2.5" fill="#ffffff" />
          <circle cx="97" cy="80.5" r="1.2" fill="#ffffff" />
          {/* 코 */}
          <path d="M 80 84 L 81 87" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          {/* 입: 부드러운 호감 미소 */}
          <path d="M 74 95 Q 80 100 86 95" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
        {renderHair(4)}
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 3: THINKING (3컷 - 깊은 생각, 지적인 탐구, 턱에 손가락)
  // -------------------------------------------------------------
  if (pose === 'thinking') {
    return (
      <g>
        {renderBody(
          <g>
            {/* 왼팔로 책/자료를 받치고, 오른손 검지를 뺨/관자놀이에 댐 */}
            <path d="M 112 145 C 118 125, 112 100, 104 88" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
            <path d="M 112 145 C 118 125, 112 100, 104 88" stroke="url(#jacketGrad)" strokeWidth="6" strokeLinecap="round" />
            <circle cx="104" cy="86" r="6" fill="url(#skinGrad)" stroke="#0f172a" strokeWidth="2.5" />
          </g>
        )}
        {renderHeadBase(0)}
        <g>
          {/* 눈썹: 진지한 직선 */}
          <path d="M 54 69 L 70 70" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <path d="M 90 70 L 106 69" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* 눈: 살짝 옆을 응시하며 사색 */}
          <ellipse cx="65" cy="78" rx="4.5" ry="5.5" fill="#0f172a" />
          <circle cx="66" cy="76" r="1.8" fill="#ffffff" />
          <ellipse cx="101" cy="78" rx="4.5" ry="5.5" fill="#0f172a" />
          <circle cx="102" cy="76" r="1.8" fill="#ffffff" />
          {/* 코 */}
          <path d="M 79 84 L 80 87" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          {/* 입: 앙다문 지적인 입 */}
          <path d="M 76 96 L 84 96" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {renderHair(0)}
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 4: COMPARING (4컷 - 양손을 들어 비교하고 살피는 제스처)
  // -------------------------------------------------------------
  if (pose === 'comparing') {
    return (
      <g>
        {renderBody(
          <g>
            {/* 양손을 올려 저울질하듯 손바닥을 펼침 */}
            <path d="M 44 148 C 35 130, 32 118, 30 110" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
            <path d="M 44 148 C 35 130, 32 118, 30 110" stroke="url(#jacketGrad)" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="28" cy="108" rx="6" ry="5" fill="url(#skinGrad)" stroke="#0f172a" strokeWidth="2.5" />

            <path d="M 116 148 C 125 130, 128 118, 130 110" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
            <path d="M 116 148 C 125 130, 128 118, 130 110" stroke="url(#jacketGrad)" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="132" cy="108" rx="6" ry="5" fill="url(#skinGrad)" stroke="#0f172a" strokeWidth="2.5" />
          </g>
        )}
        {renderHeadBase(0)}
        <g>
          {/* 눈썹 */}
          <path d="M 54 67 Q 63 62 70 67" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 90 67 Q 97 62 106 67" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* 눈: 호기심과 비교의 눈빛 */}
          <ellipse cx="62" cy="78" rx="4.5" ry="5.5" fill="#0f172a" />
          <circle cx="63.5" cy="76" r="1.8" fill="#ffffff" />
          <ellipse cx="98" cy="78" rx="4.5" ry="5.5" fill="#0f172a" />
          <circle cx="99.5" cy="76" r="1.8" fill="#ffffff" />
          {/* 코 & 입 */}
          <path d="M 79 84 L 80 87" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          <path d="M 75 96 Q 80 99 85 96" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
        {renderHair(0)}
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 5: IMPRESSED (5컷 - 가슴에 손, 감탄과 깊은 공감)
  // -------------------------------------------------------------
  if (pose === 'impressed') {
    return (
      <g>
        {renderBody(
          <g>
            {/* 오른손을 가슴 중앙에 올림 */}
            <path d="M 112 145 C 105 130, 95 125, 84 126" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
            <path d="M 112 145 C 105 130, 95 125, 84 126" stroke="url(#jacketGrad)" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="82" cy="126" rx="7" ry="6" fill="url(#skinGrad)" stroke="#0f172a" strokeWidth="2.5" />
          </g>
        )}
        {renderHeadBase(3)}
        <g transform="rotate(3 80 75)">
          {/* 눈썹: 따스한 감동의 곡선 */}
          <path d="M 54 67 Q 63 62 70 66" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 90 66 Q 97 62 106 67" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* 눈: 살짝 감기듯 눈웃음 (감동) */}
          <path d="M 57 78 Q 63 72 69 78" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 93 78 Q 99 72 105 78" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* 코 & 입: 환하고 감동적인 미소 */}
          <path d="M 79 84 L 80 87" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          <path d="M 74 95 Q 80 102 86 95" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="#e11d48" />
        </g>
        {renderHair(3)}
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 6: EXPLAINING (6컷 - 손을 뻗어 정답게 대화/설명하는 모습)
  // -------------------------------------------------------------
  if (pose === 'explaining' || pose === 'headerRight') {
    return (
      <g>
        {renderBody(
          <g>
            {/* 오른손을 앞으로 펼쳐 상대방에게 설명 */}
            <path d="M 112 145 C 122 135, 130 130, 142 125" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
            <path d="M 112 145 C 122 135, 130 130, 142 125" stroke="url(#jacketGrad)" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="144" cy="123" rx="7" ry="5" fill="url(#skinGrad)" stroke="#0f172a" strokeWidth="2.5" />
          </g>
        )}
        {renderHeadBase(-3)}
        <g transform="rotate(-3 80 75)">
          {/* 눈썹 */}
          <path d="M 54 66 Q 63 62 70 66" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 90 66 Q 97 62 106 66" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* 눈: 자신감 있고 따뜻한 눈빛 */}
          <ellipse cx="62" cy="77" rx="4.5" ry="6" fill="#0f172a" />
          <circle cx="63.5" cy="75" r="2" fill="#ffffff" />
          <ellipse cx="98" cy="77" rx="4.5" ry="6" fill="#0f172a" />
          <circle cx="99.5" cy="75" r="2" fill="#ffffff" />
          {/* 입: 말하고 있는 밝은 입모양 */}
          <path d="M 75 94 Q 80 102 85 94 Z" fill="#e11d48" stroke="#0f172a" strokeWidth="2" />
        </g>
        {renderHair(-3)}
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 7: REALIZED (7컷 - 번뜩임, 아하! 검지손가락 세우기)
  // -------------------------------------------------------------
  if (pose === 'realized') {
    return (
      <g>
        {renderBody(
          <g>
            {/* 오른손 검지를 위로 쑥 올려 "아하!" 제스처 */}
            <path d="M 112 145 C 124 130, 126 100, 126 78" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
            <path d="M 112 145 C 124 130, 126 100, 126 78" stroke="url(#jacketGrad)" strokeWidth="6" strokeLinecap="round" />
            {/* 세운 검지 손가락 */}
            <path d="M 126 78 L 126 62" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
            <path d="M 126 78 L 126 62" stroke="url(#skinGrad)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="126" cy="78" r="5" fill="url(#skinGrad)" stroke="#0f172a" strokeWidth="2" />
          </g>
        )}
        {renderHeadBase(5)}
        <g transform="rotate(5 80 75)">
          {/* 눈썹: 깜짝 놀람과 기쁨으로 올라감 */}
          <path d="M 54 64 Q 63 60 70 65" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 90 65 Q 97 60 106 64" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* 눈: 커다랗게 번뜩이는 눈 */}
          <ellipse cx="62" cy="76" rx="5.5" ry="6.5" fill="#0f172a" />
          <circle cx="64" cy="74" r="2.5" fill="#ffffff" />
          <ellipse cx="98" cy="76" rx="5.5" ry="6.5" fill="#0f172a" />
          <circle cx="100" cy="74" r="2.5" fill="#ffffff" />
          {/* 입: 환호하는 열린 입 */}
          <ellipse cx="80" cy="95" rx="5" ry="6" fill="#e11d48" stroke="#0f172a" strokeWidth="2" />
        </g>
        {renderHair(5)}
        {/* 머리 위 반짝이는 전구/스파크 */}
        <g transform="translate(130, 42)">
          <path d="M 0 -8 L 0 -14 M 6 -6 L 11 -10 M 8 0 L 14 0" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="0" cy="0" r="5" fill="#fde047" stroke="#f59e0b" strokeWidth="2" />
        </g>
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 8: SMILING (8컷 - 활짝 핀 눈웃음, 따뜻한 마음과 평화)
  // -------------------------------------------------------------
  if (pose === 'smiling') {
    return (
      <g>
        {renderBody(
          <g>
            {/* 가슴 앞에 편안하게 손을 얹음 */}
            <path d="M 50 145 C 60 138, 70 138, 76 138" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
            <path d="M 50 145 C 60 138, 70 138, 76 138" stroke="url(#jacketGrad)" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="78" cy="138" rx="6" ry="5" fill="url(#skinGrad)" stroke="#0f172a" strokeWidth="2" />
          </g>
        )}
        {renderHeadBase(2)}
        <g transform="rotate(2 80 75)">
          {/* 눈썹: 매우 편안한 활꼴 */}
          <path d="M 54 67 Q 63 61 70 66" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 90 66 Q 97 61 106 67" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* 눈: 활짝 웃는 초승달 반달 눈 */}
          <path d="M 56 77 Q 62 70 68 77" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 92 77 Q 98 70 104 77" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* 입: 활짝 웃어 하얀 치아가 보이는 미소 */}
          <path d="M 72 93 Q 80 104 88 93 Z" fill="#e11d48" stroke="#0f172a" strokeWidth="2" />
          <path d="M 74 93 Q 80 97 86 93" fill="#ffffff" />
        </g>
        {renderHair(2)}
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 9: CHEERING (9컷 - 주먹 불끈, 당당한 전진과 결의)
  // -------------------------------------------------------------
  return (
    <g>
      {renderBody(
        <g>
          {/* 오른손 주먹을 하늘을 향해 불끈 쥠 (화이팅!) */}
          <path d="M 112 145 C 126 128, 130 95, 128 72" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" />
          <path d="M 112 145 C 126 128, 130 95, 128 72" stroke="url(#jacketGrad)" strokeWidth="6" strokeLinecap="round" />
          {/* 쥔 주먹 */}
          <circle cx="128" cy="68" r="8" fill="url(#skinGrad)" stroke="#0f172a" strokeWidth="2.5" />
          <path d="M 124 65 L 132 65 M 124 69 L 132 69" stroke="#0f172a" strokeWidth="1.5" />
        </g>
      )}
      {renderHeadBase(-2)}
      <g transform="rotate(-2 80 75)">
        {/* 눈썹: 자신감 넘치는 눈썹 */}
        <path d="M 54 66 L 70 64" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
        <path d="M 90 64 L 106 66" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
        {/* 눈: 당당하고 반짝이는 눈 */}
        <ellipse cx="62" cy="76" rx="5" ry="6" fill="#0f172a" />
        <circle cx="64" cy="74" r="2.2" fill="#ffffff" />
        <ellipse cx="98" cy="76" rx="5" ry="6" fill="#0f172a" />
        <circle cx="100" cy="74" r="2.2" fill="#ffffff" />
        {/* 입: 힘찬 파이팅 미소 */}
        <path d="M 73 93 Q 80 105 87 93 Z" fill="#e11d48" stroke="#0f172a" strokeWidth="2" />
        <path d="M 75 93 Q 80 97 85 93" fill="#ffffff" />
      </g>
      {renderHair(-2)}
      {/* 승리의 반짝임 별 */}
      <text x="135" y="45" fontSize="20" fill="#f59e0b">✨</text>
    </g>
  );
}

// 패널 번호(1~9)에 맞춰 가장 어울리는 주인공 캐릭터 포즈를 반환하는 함수
export function getCharacterPoseForPanel(panelNumber: number): CharacterPose {
  switch (panelNumber) {
    case 1:
      return 'curious';    // 1컷: 질문, 갸우뚱
    case 2:
      return 'listening';  // 2컷: 경청, 하나됨과 지체
    case 3:
      return 'thinking';   // 3컷: 원인/역사 탐구
    case 4:
      return 'comparing';  // 4컷: 비교 살피기
    case 5:
      return 'impressed';  // 5컷: 감탄, 공감
    case 6:
      return 'explaining'; // 6컷: 대화와 설명
    case 7:
      return 'realized';   // 7컷: 아하! 분별과 깨달음
    case 8:
      return 'smiling';    // 8컷: 따스한 다양성의 미소
    case 9:
    default:
      return 'cheering';   // 9컷: 결론, 희망찬 화이팅
  }
}
