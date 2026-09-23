'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lightbulb, Key, HelpCircle, CheckCircle } from 'lucide-react';
import { ComicProject } from '@/types/comic';

interface Step1InputProps {
  onStoryboardGenerated: (comic: ComicProject) => void;
}

const PRESET_TOPICS = [
  {
    topic: '교파가 많은 이유?',
    audience: '청소년 및 성도',
    desc: '예시 이미지와 동일한 주제 (장로교, 감리교, 침례교 등)',
  },
  {
    topic: '인공지능(AI)과 딥러닝 원리',
    audience: '청소년 및 일반 성인',
    desc: '기계학습과 인공신경망의 개념을 9칸으로 완벽 정리',
  },
  {
    topic: '민주주의와 삼권분립',
    audience: '중·고등학생',
    desc: '입법·사법·행정부의 견제와 균형을 알기 쉽게 설명',
  },
  {
    topic: '기후변화와 탄소중립 실천',
    audience: '어린이 및 일반 시민',
    desc: '지구온난화 원인과 생활 속 탄소 저감 가이드',
  },
];

export default function Step1Input({ onStoryboardGenerated }: Step1InputProps) {
  const [topic, setTopic] = useState('교파가 많은 이유?');
  const [audience, setAudience] = useState('청소년 및 성도');
  const [customApiKey, setCustomApiKey] = useState('');
  const [showApiKeySetting, setShowApiKeySetting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setError('주제를 입력해주세요.');
      return;
    }
    if (!audience.trim()) {
      setError('대상 독자를 입력해주세요.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          audience: audience.trim(),
          customApiKey: customApiKey.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '스토리보드 생성 실패');
      }

      const newComic: ComicProject = {
        id: `comic_${Date.now()}`,
        title: data.title || topic,
        subtitle: data.subtitle || `- ${audience}를 위한 9칸 핵심 원리 -`,
        topic: topic,
        audience: audience,
        author: data.author || '현스웹툰',
        sourceNote: data.sourceNote || '글·구성: 교육 인포그래픽 연구소',
        headerDialogue: data.headerDialogue || {
          leftCharacter: { dialogue: `${topic}에 대해 궁금해요!` },
          rightCharacter: { dialogue: `함께 9컷으로 차근차근 알아볼까요?` },
        },
        panels: data.panels,
      };

      onStoryboardGenerated(newComic);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '스토리보드 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (pTopic: string, pAudience: string) => {
    setTopic(pTopic);
    setAudience(pAudience);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* 1단계 안내 배너 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          [1단계] 기획 단계
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          주제와 대상을 입력하면 9칸 스토리보드가 완성됩니다
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          &quot;문제 제기 → 원인 → 설명 → 비교 → 핵심 원리 → 결론&quot; 흐름에 맞춰 
          독자가 자연스럽게 이해할 수 있는 9개 패널 기획안을 즉시 설계합니다.
        </p>
      </div>

      {/* 입력 카드 */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-10 mb-8 transition-all">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 주제 입력 */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                1. 무엇에 관한 만화인가요? <span className="text-blue-600 font-extrabold">[주제]</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 교파가 많은 이유?, 인공지능의 기본 원리"
                required
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-base font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                궁금증을 자아내는 질문 형태(예: ~한 이유?)가 가장 효과적입니다.
              </p>
            </div>

            {/* 대상 독자 입력 */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                2. 누구를 위한 만화인가요? <span className="text-blue-600 font-extrabold">[대상 독자]</span>
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="예: 청소년 및 성도, 초등학생, 취업준비생"
                required
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-base font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                독자의 눈높이에 맞춰 어휘와 비유, 설명 깊이가 맞춤 조정됩니다.
              </p>
            </div>
          </div>

          {/* 추천 주제 칩 */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>추천 예시 주제 (클릭 시 자동 입력):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_TOPICS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.topic, preset.audience)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                    topic === preset.topic
                      ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-semibold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-slate-900">{preset.topic}</span>
                    <span className="text-slate-500 text-[11px] block mt-0.5">{preset.desc}</span>
                  </div>
                  {topic === preset.topic && (
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 커스텀 AI API 키 옵션 토글 */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowApiKeySetting(!showApiKeySetting)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{showApiKeySetting ? '▲ API 설정 접기' : '▼ 직접 본인의 AI API Key를 사용하고 싶으신가요? (선택사항)'}</span>
            </button>

            {showApiKeySetting && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs text-slate-600">
                  키를 입력하지 않아도 내장 지능형 기획 엔진이 작동하여 고품질 9패널을 즉시 생성합니다. 
                  OpenAI API Key를 넣으시면 더욱 자유로운 주제의 AI 생성이 가능합니다.
                </p>
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="sk-... (OpenAI API Key)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* 생성 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-base rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>9개 패널 스토리보드 기획 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>1단계: 9칸 스토리보드 기획안 만들기</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* 안내 규칙 박스 */}
      <div className="bg-slate-100/80 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
          📌 9칸 교육 만화 설계 가이드
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200/80">
            <span className="font-bold text-blue-700 block mb-1">1~2. 문제 제기</span>
            독자의 호기심과 흔한 오해를 던져 몰입을 유도합니다.
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/80">
            <span className="font-bold text-indigo-700 block mb-1">3~5. 원인과 설명</span>
            배경과 핵심 원리를 명쾌한 인포그래픽 도식으로 설명합니다.
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/80">
            <span className="font-bold text-purple-700 block mb-1">6~7. 비교와 대조</span>
            헷갈리는 개념(예: 장로교 vs 감리교, 정통 vs 이단)을 표로 대조합니다.
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 sm:col-span-2 md:col-span-3">
            <span className="font-bold text-emerald-700 block mb-1">8~9. 핵심 원리와 결론</span>
            풍성한 비유와 함께 독자가 평생 기억할 단 하나의 명쾌한 결론으로 마무리합니다.
          </div>
        </div>
      </div>
    </div>
  );
}
