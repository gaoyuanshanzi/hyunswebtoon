'use client';

import React from 'react';
import { CharacterType } from '@/types/comic';

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
  | 'headerLeft'  // 상단 좌측
  | 'headerRight'; // 상단 우측

export type CharacterRole = 'boy' | 'girl' | 'man' | 'woman';

export function normalizeCharacterType(type?: CharacterType): CharacterRole {
  if (!type) return 'boy';
  if (type === 'female' || type === 'girl') return 'girl';
  if (type === 'man') return 'man';
  if (type === 'woman') return 'woman';
  return 'boy'; // 'male' or 'boy'
}

interface ComicCharacterProps {
  pose: CharacterPose;
  gender?: CharacterType;
  className?: string;
  size?: number;
}

export default function ComicCharacter({
  pose,
  gender = 'boy',
  className = '',
  size = 120,
}: ComicCharacterProps) {
  const role: CharacterRole = normalizeCharacterType(gender);

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
          <linearGradient id={`skinGrad_${role}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff2e8" />
            <stop offset="100%" stopColor="#ffd8b8" />
          </linearGradient>

          {/* 볼터치 필터 */}
          <radialGradient id={`blushGrad_${role}`} cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor={role === 'girl' ? '#fb7185' : role === 'woman' ? '#f43f5e' : '#f87171'}
              stopOpacity={role === 'girl' || role === 'woman' ? 0.45 : 0.3}
            />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </radialGradient>

          {/* 의상 그라데이션 */}
          <linearGradient id={`jacketGrad_${role}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {role === 'boy' && (
              <>
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </>
            )}
            {role === 'girl' && (
              <>
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </>
            )}
            {role === 'man' && (
              <>
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </>
            )}
            {role === 'woman' && (
              <>
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#0f766e" />
              </>
            )}
          </linearGradient>

          {/* 머리카락 그라데이션 */}
          <linearGradient id={`hairGrad_${role}`} x1="0%" y1="0%" x2="0%" y2="100%">
            {role === 'boy' && (
              <>
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
              </>
            )}
            {role === 'girl' && (
              <>
                <stop offset="0%" stopColor="#5c3822" />
                <stop offset="100%" stopColor="#2c1810" />
              </>
            )}
            {role === 'man' && (
              <>
                <stop offset="0%" stopColor="#374151" />
                <stop offset="100%" stopColor="#111827" />
              </>
            )}
            {role === 'woman' && (
              <>
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#1c1917" />
              </>
            )}
          </linearGradient>
        </defs>

        {renderCharacterPose(pose, role)}
      </svg>
    </div>
  );
}

function renderCharacterPose(pose: CharacterPose, role: CharacterRole) {
  const isFemale = role === 'girl' || role === 'woman';
  const isAdult = role === 'man' || role === 'woman';

  const skinId = `url(#skinGrad_${role})`;
  const blushId = `url(#blushGrad_${role})`;
  const jacketId = `url(#jacketGrad_${role})`;
  const hairId = `url(#hairGrad_${role})`;

  // 공통 기저 요소: 몸통/어깨 (어른: 블레이저/셔츠, 학생: 후드티/백팩)
  const renderBody = (armLeft?: React.ReactNode, armRight?: React.ReactNode) => {
    if (isAdult) {
      // 성인(남성 어른/여성 어른) 정장 블레이저 & 카라
      return (
        <g id="body-group-adult">
          {/* 어깨와 자켓 */}
          <path
            d="M 36 160 C 38 122, 60 118, 80 118 C 100 118, 122 122, 124 160 Z"
            fill={jacketId}
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* 와이셔츠 / 블라우스 V넥 */}
          <path
            d="M 68 118 L 80 142 L 92 118 Z"
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth="2.5"
          />

          {/* 남성 어른: 넥타이 vs 여성 어른: 깔끔한 블라우스 깃 */}
          {role === 'man' ? (
            <path
              d="M 77 126 L 83 126 L 82 155 L 80 160 L 78 155 Z"
              fill="#2563eb"
              stroke="#0f172a"
              strokeWidth="2"
            />
          ) : (
            <circle cx="80" cy="134" r="2.5" fill="#f59e0b" />
          )}

          {/* 자켓 라펠(카라) */}
          <path
            d="M 62 118 L 74 140 L 70 160 M 98 118 L 86 140 L 90 160"
            stroke="#0f172a"
            strokeWidth="2.5"
          />

          {armLeft}
          {armRight}
        </g>
      );
    }

    // 학생(소년/소녀) 후드 자켓 & 백팩
    return (
      <g id="body-group-student">
        {/* 백팩 끈 */}
        <path
          d="M 50 128 L 54 160 M 110 128 L 106 160"
          stroke="#0f172a"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 50 128 L 54 160 M 110 128 L 106 160"
          stroke={role === 'girl' ? '#fb7185' : '#475569'}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* 어깨와 몸통 */}
        <path
          d="M 38 160 C 40 125, 60 120, 80 120 C 100 120, 120 125, 122 160 Z"
          fill={jacketId}
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
          stroke={role === 'girl' ? '#be123c' : '#1e3a8a'}
          strokeWidth="2"
        />

        {armLeft}
        {armRight}
      </g>
    );
  };

  // 공통 머리/얼굴 기저
  const renderHeadBase = (tiltAngle = 0, tiltX = 80, tiltY = 75) => (
    <g transform={`rotate(${tiltAngle} ${tiltX} ${tiltY})`}>
      {/* 목 */}
      <rect
        x="72"
        y="105"
        width="16"
        height="20"
        fill={skinId}
        stroke="#0f172a"
        strokeWidth="3"
      />

      {/* 귀 좌우 */}
      <ellipse
        cx="44"
        cy="80"
        rx="6"
        ry="8"
        fill={skinId}
        stroke="#0f172a"
        strokeWidth="2.5"
      />
      <ellipse
        cx="116"
        cy="80"
        rx="6"
        ry="8"
        fill={skinId}
        stroke="#0f172a"
        strokeWidth="2.5"
      />

      {/* 얼굴 윤곽 */}
      <path
        d="M 46 68 C 44 95, 60 114, 80 114 C 100 114, 116 95, 114 68 C 114 45, 46 45, 46 68 Z"
        fill={skinId}
        stroke="#0f172a"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* 볼터치 (생기 있는 홍조) */}
      <circle cx="56" cy="88" r={isFemale ? 8 : 6.5} fill={blushId} />
      <circle cx="104" cy="88" r={isFemale ? 8 : 6.5} fill={blushId} />
    </g>
  );

  // 4가지 헤어스타일 렌더러
  const renderHair = (tiltAngle = 0, tiltX = 80, tiltY = 75) => {
    // 1. 여성 소녀 (포니테일)
    if (role === 'girl') {
      return (
        <g transform={`rotate(${tiltAngle} ${tiltX} ${tiltY})`}>
          <path
            d="M 115 50 C 135 45, 142 65, 135 85 C 130 92, 122 85, 120 75 Z"
            fill={hairId}
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="118" cy="58" r="4.5" fill="#f43f5e" stroke="#0f172a" strokeWidth="2" />
          <path
            d="M 40 68 C 36 45, 54 26, 80 26 C 106 26, 124 45, 120 68 C 117 76, 120 84, 118 88 C 114 78, 115 62, 113 58 C 108 38, 95 32, 80 32 C 65 32, 52 38, 47 58 C 45 62, 46 78, 42 88 C 40 84, 43 76, 40 68 Z"
            fill={hairId}
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 44 56 C 50 64, 58 63, 64 66 C 68 58, 76 56, 82 66 C 88 56, 96 58, 102 66 C 108 58, 114 62, 116 56 C 112 40, 98 32, 80 32 C 62 32, 48 40, 44 56 Z"
            fill={hairId}
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 46 70 C 44 82, 46 92, 48 96 M 114 70 C 116 82, 114 92, 112 96" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    }

    // 2. 여성 어른 (세련된 미디엄 보브 단발 / 펌)
    if (role === 'woman') {
      return (
        <g transform={`rotate(${tiltAngle} ${tiltX} ${tiltY})`}>
          <path
            d="M 38 72 C 34 45, 52 25, 80 25 C 108 25, 126 45, 122 72 C 122 88, 124 98, 120 102 C 116 94, 115 80, 114 65 C 108 40, 95 32, 80 32 C 65 32, 52 40, 46 65 C 45 80, 44 94, 40 102 C 36 98, 38 88, 38 72 Z"
            fill={hairId}
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* 우아한 7:3 가르마 앞머리 */}
          <path
            d="M 42 60 C 50 68, 62 65, 72 68 C 76 56, 92 52, 114 58 C 110 40, 98 32, 80 32 C 60 32, 46 42, 42 60 Z"
            fill={hairId}
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
      );
    }

    // 3. 남성 어른 (신뢰감 있는 깔끔한 가르마/포마드 스타일)
    if (role === 'man') {
      return (
        <g transform={`rotate(${tiltAngle} ${tiltX} ${tiltY})`}>
          <path
            d="M 42 68 C 38 46, 56 26, 80 26 C 104 26, 122 46, 118 68 C 116 75, 118 80, 116 84 C 114 78, 114 66, 112 60 C 108 42, 96 34, 80 34 C 64 34, 52 42, 48 60 C 46 66, 46 78, 44 84 C 42 80, 44 75, 42 68 Z"
            fill={hairId}
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* 단정한 2:8 / 3:7 넘김 머리 */}
          <path
            d="M 44 56 C 54 62, 66 60, 74 63 C 78 54, 94 50, 114 55 C 110 38, 96 32, 80 32 C 62 32, 48 40, 44 56 Z"
            fill={hairId}
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
      );
    }

    // 4. 남성 소년 (기본 댄디컷)
    return (
      <g transform={`rotate(${tiltAngle} ${tiltX} ${tiltY})`}>
        <path
          d="M 40 70 C 35 45, 55 25, 80 25 C 105 25, 125 45, 120 70 C 118 78, 122 84, 120 88 C 116 80, 116 65, 114 60 C 110 40, 95 32, 80 32 C 65 32, 50 40, 46 60 C 44 65, 44 80, 40 88 C 38 84, 42 78, 40 70 Z"
          fill={hairId}
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M 43 55 C 50 62, 58 60, 62 65 C 65 58, 72 55, 78 66 C 82 56, 90 58, 96 66 C 100 58, 108 62, 116 56 C 112 40, 98 32, 80 32 C 60 32, 48 42, 43 55 Z"
          fill={hairId}
          stroke="#0f172a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M 78 26 C 75 18, 85 16, 82 25"
          stroke="#0f172a"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  };

  // 속눈썹 (여성 전용)
  const renderEyelashes = (leftX: number, leftY: number, rightX: number, rightY: number) => {
    if (!isFemale) return null;
    return (
      <g stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round">
        <path d={`M ${leftX - 3} ${leftY - 3} L ${leftX - 6} ${leftY - 6}`} />
        <path d={`M ${rightX + 3} ${rightY - 3} L ${rightX + 6} ${rightY - 6}`} />
      </g>
    );
  };

  // -------------------------------------------------------------
  // 포즈 1: CURIOUS (1컷 - 갸우뚱, 고민, 질문)
  // -------------------------------------------------------------
  if (pose === 'curious' || pose === 'headerLeft') {
    return (
      <g>
        {renderBody(
          <g>
            <path d="M 108 145 C 118 130, 110 108, 98 96" stroke="#0f172a" strokeWidth="10" strokeLinecap="round" />
            <path d="M 108 145 C 118 130, 110 108, 98 96" stroke={jacketId} strokeWidth="7" strokeLinecap="round" />
            <circle cx="96" cy="94" r="7" fill={skinId} stroke="#0f172a" strokeWidth="2.5" />
          </g>
        )}
        {renderHeadBase(-8)}
        <g transform="rotate(-8 80 75)">
          <path d="M 54 68 Q 63 64 70 70" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 90 70 Q 98 63 106 66" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="62" cy="78" rx="4.5" ry="6" fill="#0f172a" />
          <circle cx="63.5" cy="76" r="2" fill="#ffffff" />
          <ellipse cx="98" cy="78" rx="4.5" ry="6" fill="#0f172a" />
          <circle cx="99.5" cy="76" r="2" fill="#ffffff" />
          {renderEyelashes(62, 75, 98, 75)}
          <path d="M 78 84 L 80 87" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="80" cy="96" rx="4" ry="5" fill="#e11d48" stroke="#0f172a" strokeWidth="2" />
        </g>
        {renderHair(-8)}
        <text x="115" y="45" fontSize="22" fontWeight="900" fill={isFemale ? '#f43f5e' : '#3b82f6'} fontFamily="sans-serif">?</text>
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
          <g>
            <path d="M 52 145 C 60 135, 70 135, 78 136 M 108 145 C 100 135, 90 135, 82 136" stroke={jacketId} strokeWidth="7" strokeLinecap="round" />
            <ellipse cx="80" cy="136" rx="8" ry="6" fill={skinId} stroke="#0f172a" strokeWidth="2.5" />
          </g>
        )}
        {renderHeadBase(4)}
        <g transform="rotate(4 80 75)">
          <path d="M 54 68 Q 63 63 70 67" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 90 67 Q 97 63 106 68" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="62" cy="78" rx="5" ry="6.5" fill="#0f172a" />
          <circle cx="63.5" cy="75.5" r="2.5" fill="#ffffff" />
          <circle cx="61" cy="80.5" r="1.2" fill="#ffffff" />
          <ellipse cx="98" cy="78" rx="5" ry="6.5" fill="#0f172a" />
          <circle cx="99.5" cy="75.5" r="2.5" fill="#ffffff" />
          <circle cx="97" cy="80.5" r="1.2" fill="#ffffff" />
          {renderEyelashes(62, 75, 98, 75)}
          <path d="M 80 84 L 81 87" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          <path d="M 74 95 Q 80 100 86 95" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
        {renderHair(4)}
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 3: THINKING (3컷 - 탐구, 사색, 턱에 손)
  // -------------------------------------------------------------
  if (pose === 'thinking') {
    return (
      <g>
        {renderBody(
          <g>
            <path d="M 112 145 C 118 125, 112 100, 104 88" stroke={jacketId} strokeWidth="7" strokeLinecap="round" />
            <circle cx="104" cy="86" r="6" fill={skinId} stroke="#0f172a" strokeWidth="2.5" />
          </g>
        )}
        {renderHeadBase(0)}
        <g>
          <path d="M 54 69 L 70 70 M 90 70 L 106 69" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="65" cy="78" rx="4.5" ry="5.5" fill="#0f172a" />
          <circle cx="66" cy="76" r="1.8" fill="#ffffff" />
          <ellipse cx="101" cy="78" rx="4.5" ry="5.5" fill="#0f172a" />
          <circle cx="102" cy="76" r="1.8" fill="#ffffff" />
          {renderEyelashes(65, 75, 101, 75)}
          <path d="M 79 84 L 80 87" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          <path d="M 76 96 L 84 96" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {renderHair(0)}
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 4: COMPARING (4컷 - 양손 들어 비교)
  // -------------------------------------------------------------
  if (pose === 'comparing') {
    return (
      <g>
        {renderBody(
          <g>
            <path d="M 44 148 C 35 130, 32 118, 30 110" stroke={jacketId} strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="28" cy="108" rx="6" ry="5" fill={skinId} stroke="#0f172a" strokeWidth="2.5" />
            <path d="M 116 148 C 125 130, 128 118, 130 110" stroke={jacketId} strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="132" cy="108" rx="6" ry="5" fill={skinId} stroke="#0f172a" strokeWidth="2.5" />
          </g>
        )}
        {renderHeadBase(0)}
        <g>
          <path d="M 54 67 Q 63 62 70 67" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 90 67 Q 97 62 106 67" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="62" cy="78" rx="4.5" ry="5.5" fill="#0f172a" />
          <circle cx="63.5" cy="76" r="1.8" fill="#ffffff" />
          <ellipse cx="98" cy="78" rx="4.5" ry="5.5" fill="#0f172a" />
          <circle cx="99.5" cy="76" r="1.8" fill="#ffffff" />
          {renderEyelashes(62, 75, 98, 75)}
          <path d="M 79 84 L 80 87" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          <path d="M 75 96 Q 80 99 85 96" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
        {renderHair(0)}
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 5: IMPRESSED (5컷 - 가슴에 손, 감탄/공감)
  // -------------------------------------------------------------
  if (pose === 'impressed') {
    return (
      <g>
        {renderBody(
          <g>
            <path d="M 112 145 C 105 130, 95 125, 84 126" stroke={jacketId} strokeWidth="7" strokeLinecap="round" />
            <ellipse cx="82" cy="126" rx="7" ry="6" fill={skinId} stroke="#0f172a" strokeWidth="2.5" />
          </g>
        )}
        {renderHeadBase(3)}
        <g transform="rotate(3 80 75)">
          <path d="M 57 78 Q 63 72 69 78 M 93 78 Q 99 72 105 78" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {renderEyelashes(57, 76, 105, 76)}
          <path d="M 79 84 L 80 87" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          <path d="M 74 95 Q 80 102 86 95" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="#e11d48" />
        </g>
        {renderHair(3)}
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 6: EXPLAINING (6컷 - 손 뻗어 설명/대화)
  // -------------------------------------------------------------
  if (pose === 'explaining' || pose === 'headerRight') {
    return (
      <g>
        {renderBody(
          <g>
            <path d="M 112 145 C 122 135, 130 130, 142 125" stroke={jacketId} strokeWidth="7" strokeLinecap="round" />
            <ellipse cx="144" cy="123" rx="7" ry="5" fill={skinId} stroke="#0f172a" strokeWidth="2.5" />
          </g>
        )}
        {renderHeadBase(-3)}
        <g transform="rotate(-3 80 75)">
          <ellipse cx="62" cy="77" rx="4.5" ry="6" fill="#0f172a" />
          <circle cx="63.5" cy="75" r="2" fill="#ffffff" />
          <ellipse cx="98" cy="77" rx="4.5" ry="6" fill="#0f172a" />
          <circle cx="99.5" cy="75" r="2" fill="#ffffff" />
          {renderEyelashes(62, 74, 98, 74)}
          <path d="M 75 94 Q 80 102 85 94 Z" fill="#e11d48" stroke="#0f172a" strokeWidth="2" />
        </g>
        {renderHair(-3)}
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 7: REALIZED (7컷 - 번뜩임, 아하! 검지 들기)
  // -------------------------------------------------------------
  if (pose === 'realized') {
    return (
      <g>
        {renderBody(
          <g>
            <path d="M 112 145 C 124 130, 126 100, 126 78 L 126 62" stroke={jacketId} strokeWidth="7" strokeLinecap="round" />
            <circle cx="126" cy="62" r="5" fill={skinId} stroke="#0f172a" strokeWidth="2" />
          </g>
        )}
        {renderHeadBase(5)}
        <g transform="rotate(5 80 75)">
          <ellipse cx="62" cy="76" rx="5.5" ry="6.5" fill="#0f172a" />
          <circle cx="64" cy="74" r="2.5" fill="#ffffff" />
          <ellipse cx="98" cy="76" rx="5.5" ry="6.5" fill="#0f172a" />
          <circle cx="100" cy="74" r="2.5" fill="#ffffff" />
          {renderEyelashes(62, 73, 98, 73)}
          <ellipse cx="80" cy="95" rx="5" ry="6" fill="#e11d48" stroke="#0f172a" strokeWidth="2" />
        </g>
        {renderHair(5)}
        <circle cx="130" cy="42" r="6" fill="#fde047" stroke="#f59e0b" strokeWidth="2" />
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 8: SMILING (8컷 - 반달 눈웃음 활짝)
  // -------------------------------------------------------------
  if (pose === 'smiling') {
    return (
      <g>
        {renderBody(
          <g>
            <path d="M 50 145 C 60 138, 70 138, 76 138" stroke={jacketId} strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="78" cy="138" rx="6" ry="5" fill={skinId} stroke="#0f172a" strokeWidth="2" />
          </g>
        )}
        {renderHeadBase(2)}
        <g transform="rotate(2 80 75)">
          <path d="M 56 77 Q 62 70 68 77 M 92 77 Q 98 70 104 77" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {renderEyelashes(56, 75, 104, 75)}
          <path d="M 72 93 Q 80 104 88 93 Z" fill="#e11d48" stroke="#0f172a" strokeWidth="2" />
          <path d="M 74 93 Q 80 97 86 93" fill="#ffffff" />
        </g>
        {renderHair(2)}
      </g>
    );
  }

  // -------------------------------------------------------------
  // 포즈 9: CHEERING (9컷 - 주먹 불끈, 화이팅!)
  // -------------------------------------------------------------
  return (
    <g>
      {renderBody(
        <g>
          <path d="M 112 145 C 126 128, 130 95, 128 72" stroke={jacketId} strokeWidth="7" strokeLinecap="round" />
          <circle cx="128" cy="68" r="8" fill={skinId} stroke="#0f172a" strokeWidth="2.5" />
        </g>
      )}
      {renderHeadBase(-2)}
      <g transform="rotate(-2 80 75)">
        <ellipse cx="62" cy="76" rx="5" ry="6" fill="#0f172a" />
        <circle cx="64" cy="74" r="2.2" fill="#ffffff" />
        <ellipse cx="98" cy="76" rx="5" ry="6" fill="#0f172a" />
        <circle cx="100" cy="74" r="2.2" fill="#ffffff" />
        {renderEyelashes(62, 73, 98, 73)}
        <path d="M 73 93 Q 80 105 87 93 Z" fill="#e11d48" stroke="#0f172a" strokeWidth="2" />
        <path d="M 75 93 Q 80 97 85 93" fill="#ffffff" />
      </g>
      {renderHair(-2)}
      <text x="135" y="45" fontSize="20" fill="#f59e0b">✨</text>
    </g>
  );
}

export function getCharacterPoseForPanel(panelNumber: number): CharacterPose {
  switch (panelNumber) {
    case 1:
      return 'curious';
    case 2:
      return 'listening';
    case 3:
      return 'thinking';
    case 4:
      return 'comparing';
    case 5:
      return 'impressed';
    case 6:
      return 'explaining';
    case 7:
      return 'realized';
    case 8:
      return 'smiling';
    case 9:
    default:
      return 'cheering';
  }
}
