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
    <div className="app-container bg-bg-light min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 pt-12 pb-3 justify-between">
        {latest ? (
          <button onClick={() => navigate('/')} className="w-11 h-11 flex items-center text-slate-500">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        ) : (
          <div className="w-11" />
        )}
        <h2 className="text-base font-bold text-slate-900 flex-1 text-center pr-11">퀴즈 결과</h2>
      </header>

      <div className="flex-1 overflow-y-auto pb-28">
        {latest ? (
          <>
            {/* Result celebration */}
            <div className="flex flex-col items-center px-4 pt-4 pb-5">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
              </div>
              <span className="text-primary font-bold text-sm mb-1">멋쟁이사자처럼</span>
              <h1 className="text-2xl font-bold text-slate-900 text-center">수고하셨습니다!</h1>
            </div>

            {/* Score card */}
            <div className="px-4">
              <div className="bg-white rounded-xl border border-slate-100 p-7 flex flex-col items-center shadow-sm">
                <span className="text-slate-500 text-sm mb-2">최종 점수</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-primary">{latest.score}</span>
                  <span className="text-2xl font-bold text-slate-300">/ 100</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">{latest.total}문제 중 {latest.correctCount}개 정답</p>
              </div>
            </div>

            {/* Progress to passing */}
            <div className="px-4 mt-4 space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-sm text-slate-600 font-medium">
                  {latest.score >= 80 ? '훌륭해요! 합격 기준을 넘었어요 🎉' : `합격 커트라인까지 ${80 - latest.score}점 남았습니다`}
                </p>
                <p className="text-primary font-bold text-sm">{latest.score}%</p>
              </div>
              <div className="rounded-full bg-primary/15 h-3 overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${latest.score}%` }} />
              </div>
              <p className="text-primary/70 text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">info</span>
                {latest.score >= 80 ? '개념을 잘 이해하고 있어요!' : '조금만 더 힘내세요! 다음에는 합격할 수 있어요.'}
              </p>
            </div>

            {/* Weakness analysis */}
            <section className="px-4 pt-7">
              <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                취약 개념 분석
              </h2>
              <div className="space-y-2.5">
                {WEAKNESS_MOCK.map((w, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-red-500 text-[18px]">{w.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-900">{w.label}</h4>
                      <p className="text-slate-400 text-xs">오답 {w.count}문제 발생</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 text-[20px]">chevron_right</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Action footer */}
            <div className="px-4 mt-6 space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all"
              >
                틀린 문제 다시 풀기
              </button>
              <Link
                to="/"
                className="block w-full py-4 rounded-xl bg-primary text-white font-bold text-center shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all"
              >
                관련 가이드 복습하기
              </Link>
            </div>
          </>
        ) : (
          /* History view */
          <>
            <div className="px-4 py-4 space-y-4">
              {/* Stats */}
              {!loading && results.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: '평균점수', val: avg, color: 'text-primary' },
                    { label: '최고점수', val: best, color: 'text-emerald-500' },
                    { label: '총 퀴즈', val: results.length, color: 'text-slate-900' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                      <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <h3 className="text-sm font-bold text-slate-700 pt-2">퀴즈 기록</h3>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : results.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
                  <span className="material-symbols-outlined text-slate-200 text-[56px]" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
                  <p className="text-slate-500 mt-3 text-sm font-medium">아직 퀴즈 기록이 없어요</p>
                  <p className="text-slate-300 text-xs mt-1">강의를 선택해서 퀴즈를 풀어보세요</p>
                  <Link to="/" className="mt-4 inline-block bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl">
                    강의 목록 보기
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {results.map((r, i) => (
                    <div key={r.id ?? i} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        r.score >= 80 ? 'bg-emerald-50' : r.score >= 60 ? 'bg-amber-50' : 'bg-red-50'
                      }`}>
                        <span className={`text-lg font-black ${
                          r.score >= 80 ? 'text-emerald-500' : r.score >= 60 ? 'text-amber-500' : 'text-red-400'
                        }`}>{r.score}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          퀴즈 #{r.quiz_id?.slice(0, 8) ?? r.id}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString('ko-KR') : '-'}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/quizzes/${r.quiz_id}`)}
                        className="text-xs text-primary font-bold"
                      >
                        다시 풀기
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
};
