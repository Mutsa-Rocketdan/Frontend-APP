import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getQuizResults } from '../api/quizzes';
import { BottomNav } from '../components/BottomNav';
import type { QuizResultResponse } from '../types';

const WEAKNESS_MOCK = [
  { label: 'React State 관리', count: 3, icon: 'priority_high' },
  { label: '비동기 처리 패턴', count: 2, icon: 'sync_problem' },
];

export const QuizResultsPage = () => {
  const [results, setResults] = useState<QuizResultResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const latest = location.state as { score: number; total: number; correctCount: number } | null;

  useEffect(() => {
    getQuizResults()
      .then((res) => setResults(res.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const avg = results.length ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0;
  const best = results.length ? Math.max(...results.map((r) => r.score)) : 0;

  return (
    <div className="app-container min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-[#E9E1D6] flex items-center px-5 pt-14 pb-4">
        {latest ? (
          <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center text-[#B0A498]">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        ) : (
          <div className="w-10" />
        )}
        <h2 className="flex-1 text-center text-[15px] font-semibold text-[#171717]">퀴즈 결과</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto pb-28">
        {latest ? (
          <div className="px-4 pt-4 space-y-3 anim-enter">
            {/* 스코어 카드 — 가로 레이아웃 */}
            <div className="bg-white rounded-2xl border border-[#E9E1D6] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 flex items-center gap-5">
              <div className="relative w-[88px] h-[88px] shrink-0">
                <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
                  <circle cx="44" cy="44" r="34" fill="none" stroke="#E9E1D6" strokeWidth="6" />
                  <circle
                    cx="44" cy="44" r="34" fill="none" stroke="#FF6A00" strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - latest.score / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[30px] font-bold text-[#FF6A00] leading-none tracking-[-0.03em]">{latest.score}</span>
                  <span className="text-[10px] text-[#A39586] mt-1 font-normal tracking-wide">점</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-[#171717] leading-snug mb-1">
                  {latest.score >= 80 ? '잘 했어요' : latest.score >= 60 ? '조금 아쉬워요' : '다시 도전해봐요'}
                </p>
                <p className="text-[13px] text-[#A39586]">
                  {latest.total}문제 중 <span className="text-[#171717] font-semibold">{latest.correctCount}개</span> 정답
                </p>
                <div className="mt-2.5">
                  <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    latest.score >= 80
                      ? 'bg-[#FFF4EA] text-[#FF6A00] border border-[#F5C99A]'
                      : 'bg-[#F6F0E8] text-[#8A8078] border border-[#E9E1D6]'
                  }`}>
                    {latest.score >= 80 ? '합격' : '불합격'}
                  </span>
                </div>
              </div>
            </div>

            {/* 스탯 */}
            <div className="bg-white rounded-xl border border-[#E9E1D6] shadow-[0_1px_6px_rgba(0,0,0,0.03)] flex">
              {[
                { label: '맞은 문제', value: latest.correctCount, orange: true },
                { label: '틀린 문제', value: latest.total - latest.correctCount, orange: false },
                { label: '점수', value: `${latest.score}점`, orange: true },
              ].map((s, i) => (
                <div key={s.label} className={`flex-1 text-center px-3 py-4 ${i < 2 ? 'border-r border-[#E9E1D6]' : ''}`}>
                  <p className={`text-[18px] font-bold tracking-[-0.02em] ${s.orange ? 'text-[#FF6A00]' : 'text-[#8A8078]'}`}>{s.value}</p>
                  <p className="text-[10px] text-[#A39586] mt-0.5 tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>

            {/* 합격 기준 */}
            <div className="bg-white rounded-xl border border-[#E9E1D6] shadow-[0_1px_6px_rgba(0,0,0,0.03)] p-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[13px] font-medium text-[#6F6A64]">합격 기준</p>
                <span className="text-[11px] text-[#A39586]">커트라인 80점</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#E9E1D6] overflow-hidden">
                <div className="h-full bg-[#FF6A00] rounded-full transition-all duration-700" style={{ width: `${latest.score}%` }} />
              </div>
              <p className="text-[12px] text-[#A39586] mt-2">
                {latest.score >= 80 ? '합격 기준을 통과했어요.' : `합격까지 ${80 - latest.score}점 남았습니다.`}
              </p>
            </div>

            {/* 취약 개념 */}
            <div className="bg-white rounded-xl border border-[#E9E1D6] shadow-[0_1px_6px_rgba(0,0,0,0.03)] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B0A498] mb-3">취약 개념</p>
              <div className="space-y-0">
                {WEAKNESS_MOCK.map((w, i) => (
                  <div key={i} className={`flex items-center gap-3 py-3 ${i < WEAKNESS_MOCK.length - 1 ? 'border-b border-[#E9E1D6]' : ''}`}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#F6F0E8] border border-[#E9E1D6]">
                      <span className="material-symbols-outlined text-[#364152] text-[16px]">{w.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[13px] font-semibold text-[#171717]">{w.label}</h4>
                      <p className="text-[11px] text-[#A39586]">오답 {w.count}문제</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-2.5 pb-4">
              <button
                onClick={() => navigate(-1)}
                className="w-full h-[52px] border border-[#E9E1D6] bg-white text-[#4D4840] font-medium text-[14px] rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-[#FFF4EA] hover:border-[#F5C99A]"
              >
                <span className="material-symbols-outlined text-[18px] text-[#B0A498]">replay</span>
                틀린 문제 다시 풀기
              </button>
              <Link
                to="/"
                className="btn-press w-full h-[52px] bg-[#FF6A00] hover:bg-[#E05E00] text-white font-semibold text-[15px] rounded-xl shadow-[0_4px_16px_rgba(255,106,0,0.22)] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                학습 가이드 복습하기
              </Link>
            </div>
          </div>
        ) : (
          /* 히스토리 뷰 */
          <div className="px-4 py-4 space-y-4">
            {!loading && results.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E9E1D6] shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex">
                {[
                  { label: '평균점수', val: avg, orange: true },
                  { label: '최고점수', val: best, orange: true },
                  { label: '총 퀴즈', val: results.length, orange: false },
                ].map((s, i) => (
                  <div key={i} className={`flex-1 text-center px-4 py-4 ${i < 2 ? 'border-r border-[#E9E1D6]' : ''}`}>
                    <p className={`text-[18px] font-bold tracking-[-0.02em] ${s.orange ? 'text-[#FF6A00]' : 'text-[#171717]'}`}>{s.val}</p>
                    <p className="text-[10px] text-[#A39586] mt-0.5 uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B0A498] px-1">퀴즈 기록</p>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E9E1D6] p-8 text-center">
                <span className="material-symbols-outlined text-[#E9E1D6] text-[56px]" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
                <p className="text-[14px] text-[#6F6A64] mt-3 font-medium">아직 퀴즈 기록이 없어요</p>
                <p className="text-[12px] text-[#A39586] mt-1">강의를 선택해서 퀴즈를 풀어보세요</p>
                <Link to="/" className="mt-4 inline-block bg-[#FF6A00] text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl">
                  강의 목록 보기
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#E9E1D6] shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
                {results.map((r, i) => (
                  <div key={r.id ?? i} className={`flex items-center gap-4 px-4 py-4 ${i < results.length - 1 ? 'border-b border-[#E9E1D6]' : ''}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      r.score >= 80
                        ? 'bg-[#FFF4EA] border-[#F5C99A]'
                        : 'bg-[#F6F0E8] border-[#E9E1D6]'
                    }`}>
                      <span className={`text-[16px] font-bold tracking-[-0.02em] ${r.score >= 80 ? 'text-[#FF6A00]' : 'text-[#8A8078]'}`}>{r.score}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#171717] truncate">
                        퀴즈 #{r.quiz_id?.slice(0, 8) ?? r.id}
                      </p>
                      <p className="text-[12px] text-[#A39586] mt-0.5">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString('ko-KR') : '-'}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/quizzes/${r.quiz_id}`)}
                      className="text-[12px] text-[#FF6A00] font-semibold bg-[#FFF4EA] border border-[#F5C99A] px-3 py-1.5 rounded-lg"
                    >
                      다시 풀기
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
};
