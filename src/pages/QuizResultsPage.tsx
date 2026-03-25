import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getQuizResults } from '../api/quizzes';
import { BottomNav } from '../components/BottomNav';
import type { QuizResultResponse } from '../types';

export const QuizResultsPage = () => {
  const [results, setResults] = useState<QuizResultResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const latest = (location.state as {
    score: number; total: number; correctCount: number;
    aiFeedback?: string[]; lectureId?: string;
  } | null) ?? (import.meta.env.DEV ? {
    score: 80, total: 4, correctCount: 3,
    lectureId: 'mock-3',
    aiFeedback: [
      'JWT 구조와 Stateless 개념을 정확히 이해하고 있어요!',
      '빈칸 문제에서 대소문자를 주의해서 입력하면 더 좋아요.',
      'Refresh Token 활용 패턴을 학습 가이드로 복습해보세요.',
    ],
  } : null);

  useEffect(() => {
    getQuizResults()
      .then((res) => setResults(res.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const avg = results.length ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0;
  const best = results.length ? Math.max(...results.map((r) => r.score)) : 0;

  const passed = (latest?.score ?? 0) >= 80;
  const gap = 80 - (latest?.score ?? 0);
  const accuracy = latest ? Math.round(latest.correctCount / latest.total * 100) : 0;

  const headline = passed
    ? '합격했어요!'
    : (latest?.score ?? 0) >= 70
      ? `합격까지 ${gap}점 남았어요`
      : '다시 한 번 도전해봐요';

  const guideHref = latest?.lectureId ? `/lectures/${latest.lectureId}/guide` : '/';

  return (
    <div className="app-container min-h-screen flex flex-col">

      {/* ── 헤더 ── */}
      <div className="flex items-center px-5 pt-14 pb-3 anim-enter">
        <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center text-[#B0A498]">
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>
        <h2 className="flex-1 text-center text-[15px] font-semibold text-[#171717]">퀴즈 결과</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto pb-28">
        {latest ? (
          <>
            {/* ── 히어로 섹션 ── */}
            <div className="px-5 pt-2 pb-5 border-b border-[#E9E1D6] anim-enter-1 relative">

              {/* 사자 워터마크 — overflow는 이 wrapper만 */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
                <img
                  src={passed ? '/lion_pass.png' : '/lion_nonpass.png'}
                  alt=""
                  className="absolute select-none object-contain"
                  style={{
                    height: '200px',
                    opacity: 0.28,
                    filter: 'saturate(0.85)',
                    right: '-10px',
                    top: '20px',
                  }}
                />
              </div>

              {/* 단열: pill → 점수 → 헤드라인 → 서브 */}
              <div className="relative z-[1] mt-2 mb-4">
                {/* 상태 pill */}
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-[3px] rounded-md mb-1 font-semibold"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.05em',
                    background: passed ? 'rgba(255,106,0,0.13)' : 'rgba(140,125,110,0.22)',
                    color: passed ? '#C85000' : '#5E4A38',
                    border: passed ? '1px solid rgba(255,106,0,0.22)' : '1px solid rgba(140,125,110,0.35)',
                  }}
                >
                  {passed ? '✓ 합격' : '불합격'}
                </span>

                {/* 점수 — 단독, 전체 너비 */}
                <div className="relative flex items-baseline gap-2 mt-0.5">
                  <div className="absolute pointer-events-none" style={{
                    width: '180px', height: '100px',
                    top: '50%', left: '10px',
                    transform: 'translateY(-50%)',
                    borderRadius: '50%',
                    background: passed
                      ? 'radial-gradient(ellipse, rgba(255,106,0,0.12) 0%, transparent 65%)'
                      : 'radial-gradient(ellipse, rgba(160,130,110,0.09) 0%, transparent 65%)',
                    filter: 'blur(24px)',
                  }} />
                  <span
                    className="relative font-bold leading-none tracking-[-0.03em]"
                    style={{
                      fontSize: '76px',
                      background: passed
                        ? 'linear-gradient(170deg, #FF6A00 0%, #7A1800 80%)'
                        : 'linear-gradient(170deg, #9A8070 0%, #3D2018 80%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {latest.score}
                  </span>
                  <span className="relative font-medium self-end pb-3" style={{ fontSize: '16px', color: '#C8B8A8' }}>점</span>
                </div>

                {/* 헤드라인 */}
                <p
                  className="font-bold tracking-[-0.03em] leading-[1.2] mt-4 mb-1"
                  style={{ fontSize: '20px', color: '#2C0E06' }}
                >
                  {headline}
                </p>
                <p className="text-[12px] tracking-[-0.01em]" style={{ color: '#C0AFA4' }}>
                  {latest.total}문제 중 {latest.correctCount}개 정답 · 정답률 {accuracy}%
                </p>
              </div>

              {/* 프로그레스 바 */}
              <div>
                <div className="relative">
                  {/* 트랙 */}
                  <div className="relative h-[8px] rounded-full bg-[#EDE6DC] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${latest.score}%`,
                        background: passed
                          ? 'linear-gradient(90deg, #FFAA5C 0%, #FF6A00 100%)'
                          : 'linear-gradient(90deg, #D0C0B0 0%, #A89080 100%)',
                      }}
                    />
                    <div className="absolute top-0 bottom-0 w-[1.5px] bg-white/90 rounded-full" style={{ left: '80%' }} />
                  </div>
                  {/* 현재 점수 dot — overflow-hidden 밖에 배치 */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: '6px', height: '6px',
                      top: '50%', left: `${latest.score}%`,
                      transform: 'translate(-50%, -50%)',
                      background: passed ? '#FF6A00' : '#8A7060',
                    }}
                  />
                  {/* 기준 80점 dot — 링 스타일 */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: '10px', height: '10px',
                      top: '50%', left: '80%',
                      transform: 'translate(-50%, -50%)',
                      background: '#fff',
                      border: '2px solid #B8A898',
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.06)',
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: passed ? '#FF6A00' : '#8A7868' }}
                  >
                    내 점수 {latest.score}점
                  </span>
                  <span className="text-[11px]" style={{ color: passed ? '#FF6A00' : '#C0B0A0' }}>
                    {passed ? '기준 달성 ✓' : (
                      <>합격 기준{' '}
                        <span style={{
                          color: '#8A7868',
                          fontFamily: "Impact, 'Arial Narrow', sans-serif",
                          fontWeight: 700,
                          fontSize: '9px',
                          letterSpacing: '-0.02em',
                        }}>80</span>점
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* ── 콘텐츠 영역 ── */}
            <div className="px-4 pt-5 space-y-3 anim-enter-2">

              {/* AI 학습 포인트 카드 */}
              {latest.aiFeedback && latest.aiFeedback.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E9E1D6] shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
                  {/* 카드 헤더 */}
                  <div className="flex items-center gap-1.5 px-4 pt-3.5 pb-3 border-b border-[#E9E1D6]">
                    <span
                      className="material-symbols-outlined text-[14px] text-[#FF6A00]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      auto_awesome
                    </span>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B0A498]">
                      AI 학습 포인트
                    </p>
                  </div>

                  {/* 첫 번째 항목 — 강조 (따뜻한 배경 + 더 진한 텍스트) */}
                  {latest.aiFeedback.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 px-4 ${i === 0 ? 'pt-4 pb-3.5 bg-[#FFF8F3]' : 'py-3 border-t border-[#F2EAE2]'}`}
                    >
                      <div
                        className="rounded-full flex items-center justify-center shrink-0 mt-[2px]"
                        style={{
                          width: i === 0 ? '22px' : '18px',
                          height: i === 0 ? '22px' : '18px',
                          background: i === 0 ? '#FF6A00' : 'transparent',
                          border: i === 0 ? 'none' : '1.5px solid #E8D8C8',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: i === 0 ? '#fff' : '#C4A88A',
                          }}
                        >
                          {i + 1}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: i === 0 ? '13.5px' : '12.5px',
                          fontWeight: i === 0 ? 600 : 400,
                          color: i === 0 ? '#2C1810' : '#5A4A3A',
                          lineHeight: i === 0 ? '1.6' : '1.5',
                          flex: 1,
                        }}
                      >
                        {msg}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="space-y-2.5 pb-4">
                {/* 메인: 그라디언트 + 강한 그림자로 주 행동 강조 */}
                <button
                  onClick={() => navigate(-1)}
                  className="btn-press w-full h-[52px] text-white font-bold text-[15px] rounded-xl transition-all flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #FF8C3A 0%, #FF6A00 55%, #E05000 100%)',
                    boxShadow: '0 4px 14px rgba(255,106,0,0.22)',
                  }}
                >
                  <span className="material-symbols-outlined text-[18px]">replay</span>
                  오답 다시 풀기
                </button>

                {/* 서브: 따뜻한 배경으로 존재감 유지, 메인 방해 안 함 */}
                <Link
                  to={guideHref}
                  className="w-full h-[48px] rounded-xl flex items-center justify-center gap-2 font-medium text-[13.5px] transition-all hover:opacity-80"
                  style={{
                    background: '#FFF2E6',
                    border: '1px solid #E8B470',
                    color: '#A85018',
                  }}
                >
                  <span className="material-symbols-outlined text-[17px]">menu_book</span>
                  취약 개념 복습
                </Link>
              </div>

            </div>
          </>
        ) : (
          /* 히스토리 뷰 */
          <div className="px-4 py-4 space-y-4">
            {!loading && results.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E9E1D6] shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex divide-x divide-[#E9E1D6]">
                {[
                  { label: '평균점수', val: avg },
                  { label: '최고점수', val: best },
                  { label: '총 퀴즈', val: results.length },
                ].map((s, i) => (
                  <div key={i} className="flex-1 text-center px-4 py-4">
                    <p className="text-[18px] font-bold tracking-[-0.02em] text-[#FF6A00]">{s.val}</p>
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
              <div className="bg-white rounded-2xl border border-[#E9E1D6] p-8 text-center">
                <span className="material-symbols-outlined text-[#E9E1D6] text-[56px]" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
                <p className="text-[14px] text-[#6F6A64] mt-3 font-medium">아직 퀴즈 기록이 없어요</p>
                <p className="text-[12px] text-[#A39586] mt-1">강의를 선택해서 퀴즈를 풀어보세요</p>
                <Link to="/" className="mt-4 inline-block bg-[#FF6A00] text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl">
                  강의 목록 보기
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E9E1D6] shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
                {results.map((r, i) => (
                  <div key={r.id ?? i} className={`flex items-center gap-4 px-4 py-4 ${i < results.length - 1 ? 'border-b border-[#E9E1D6]' : ''}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${r.score >= 80 ? 'bg-[#FFF4EA] border-[#F5C99A]' : 'bg-[#F6F0E8] border-[#E9E1D6]'}`}>
                      <span className={`text-[16px] font-bold tracking-[-0.02em] ${r.score >= 80 ? 'text-[#FF6A00]' : 'text-[#8A8078]'}`}>{r.score}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#171717] truncate">퀴즈 #{r.quiz_id?.slice(0, 8) ?? r.id}</p>
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
