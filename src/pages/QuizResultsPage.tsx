import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizResults } from '../api/quizzes';
import type { QuizResultResponse } from '../types';

export const QuizResultsPage = () => {
  const [results, setResults] = useState<QuizResultResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getQuizResults()
      .then((res) => setResults(res.data.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )))
      .finally(() => setLoading(false));
  }, []);

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const scoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  const avgScore = results.length
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-white text-2xl font-bold">학습 결과</h1>
          <p className="text-zinc-500 text-sm mt-1">퀴즈 풀이 기록과 성과를 확인하세요</p>
        </div>

        {/* Stats */}
        {results.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
              <p className="text-zinc-500 text-xs mb-2">총 퀴즈</p>
              <p className="text-white text-3xl font-bold">{results.length}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
              <p className="text-zinc-500 text-xs mb-2">평균 점수</p>
              <p className={`text-3xl font-bold ${scoreColor(avgScore)}`}>{avgScore}점</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
              <p className="text-zinc-500 text-xs mb-2">최고 점수</p>
              <p className={`text-3xl font-bold ${scoreColor(Math.max(...results.map((r) => r.score)))}`}>
                {Math.max(...results.map((r) => r.score))}점
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📊</p>
            <p className="text-zinc-400">아직 퀴즈 결과가 없어요</p>
            <button
              onClick={() => navigate('/lectures')}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              강의 보러 가기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className={`bg-zinc-900 border rounded-xl p-6 ${scoreBg(result.score)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-zinc-400 text-sm">
                    {new Date(result.created_at).toLocaleDateString('ko-KR', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                  <span className={`text-2xl font-bold ${scoreColor(result.score)}`}>
                    {result.score}점
                  </span>
                </div>

                {/* Score bar */}
                <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full transition-all ${result.score >= 80 ? 'bg-green-500' : result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>

                {result.ai_feedback && (
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-zinc-400 text-xs mb-1">AI 피드백</p>
                    <p className="text-zinc-300 text-sm leading-relaxed">{result.ai_feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
