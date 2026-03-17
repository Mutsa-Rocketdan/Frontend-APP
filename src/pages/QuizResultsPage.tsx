import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getQuizResults } from '../api/quizzes';
import type { QuizResultResponse } from '../types';

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

  const avg = results.length ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0;
  const best = results.length ? Math.max(...results.map((r) => r.score)) : 0;

  return (
    <div className="app-container bg-bg-light min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-5">
        <h1 className="text-xl font-bold text-gray-900">학습 현황</h1>
        <p className="text-sm text-gray-400 mt-0.5">퀴즈 결과를 확인하세요</p>
      </div>

      {/* Latest result banner */}
      {latest && (
        <div className="mx-4 mt-4">
          <div className={`rounded-2xl p-5 text-white ${latest.score >= 70 ? 'bg-primary' : 'bg-gray-700'}`}
            style={{ background: latest.score >= 70 ? 'linear-gradient(135deg, #ff6a00, #ff9a4c)' : undefined }}>
            <p className="text-xs font-semibold text-white/70 mb-1">최근 퀴즈 결과</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black">{latest.score}</span>
              <span className="text-2xl font-bold mb-1">점</span>
            </div>
            <p className="text-white/80 text-sm mt-1">
              {latest.total}문제 중 {latest.correctCount}개 정답
            </p>
            <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${latest.score}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mx-4 mt-4">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-black text-primary">{avg}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">평균점수</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-black text-green-500">{best}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">최고점수</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-black text-gray-700">{results.length}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">총 퀴즈</p>
          </div>
        </div>
      )}

      {/* History */}
      <div className="px-4 mt-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3">퀴즈 기록</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <span className="material-symbols-outlined text-gray-200 text-[56px]" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
            <p className="text-gray-500 mt-3 text-sm">아직 퀴즈 기록이 없어요</p>
            <p className="text-gray-300 text-xs mt-1">강의를 선택해서 퀴즈를 풀어보세요</p>
            <Link to="/" className="mt-4 inline-block bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-xl">
              강의 목록 보기
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {results.map((r, i) => (
              <div key={r.id ?? i} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  r.score >= 80 ? 'bg-green-50' : r.score >= 60 ? 'bg-yellow-50' : 'bg-red-50'
                }`}>
                  <span className={`text-lg font-black ${
                    r.score >= 80 ? 'text-green-500' : r.score >= 60 ? 'text-yellow-500' : 'text-red-400'
                  }`}>{r.score}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    퀴즈 #{r.quiz_id?.slice(0, 8) ?? r.id}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {r.created_at ? new Date(r.created_at).toLocaleDateString('ko-KR') : '-'}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/quizzes/${r.quiz_id}`)}
                  className="text-xs text-primary font-semibold"
                >
                  다시 풀기
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
