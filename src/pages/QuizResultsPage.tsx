import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getQuizResults } from '../api/quizzes';
import type { QuizResultResponse } from '../types';

export const QuizResultsPage = () => {
  const [results, setResults] = useState<QuizResultResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 방금 제출한 결과 (QuizPage에서 navigate state로 전달)
  const latest = location.state as { score: number; total: number; correctCount: number } | null;

  useEffect(() => {
    getQuizResults()
      .then((res) => setResults(res.data.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-500';
  };

  const scoreBorder = (score: number) => {
    if (score >= 80) return 'border-green-200 bg-green-50';
    if (score >= 60) return 'border-yellow-200 bg-yellow-50';
    return 'border-red-200 bg-red-50';
  };

  const avgScore = results.length
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">학습 현황</h1>
        <p className="text-gray-500 text-sm mb-6">퀴즈 풀이 기록과 성과를 확인하세요</p>

        {/* 방금 제출한 결과 */}
        {latest && (
          <div className="bg-white border-2 border-[#FF6B00] rounded-2xl p-6 mb-6 text-center shadow-sm">
            <p className="text-gray-500 text-sm mb-1">방금 퀴즈 결과</p>
            <p className={`text-5xl font-black mb-1 ${scoreColor(latest.score)}`}>{latest.score}점</p>
            <p className="text-gray-500 text-sm">{latest.total}문제 중 {latest.correctCount}개 정답</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 border border-gray-200 text-gray-600 hover:border-[#FF6B00] hover:text-[#FF6B00] py-2.5 rounded-lg text-sm font-medium transition-all"
              >
                강의 목록
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-[#FF6B00] hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-bold transition-colors"
              >
                다시 풀기
              </button>
            </div>
          </div>
        )}

        {/* 통계 */}
        {results.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: '총 퀴즈', value: `${results.length}회` },
              { label: '평균 점수', value: `${avgScore}점`, color: scoreColor(avgScore) },
              { label: '최고 점수', value: `${Math.max(...results.map(r => r.score))}점`, color: scoreColor(Math.max(...results.map(r => r.score))) },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">{label}</p>
                <p className={`text-xl md:text-2xl font-black ${color || 'text-gray-900'}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length === 0 && !latest ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📊</p>
            <p className="text-gray-500 mb-4">아직 퀴즈 결과가 없어요</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#FF6B00] hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              강의 보러 가기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-gray-700 text-sm font-semibold">이전 기록</h2>
            {results.map((result) => (
              <div key={result.id} className={`bg-white border rounded-xl p-4 md:p-5 ${scoreBorder(result.score)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-xs">
                    {new Date(result.created_at).toLocaleDateString('ko-KR', {
                      month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                  <span className={`text-xl font-black ${scoreColor(result.score)}`}>{result.score}점</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                  <div
                    className={`h-1.5 rounded-full ${result.score >= 80 ? 'bg-green-500' : result.score >= 60 ? 'bg-yellow-500' : 'bg-red-400'}`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                {result.ai_feedback && (
                  <p className="text-gray-500 text-xs leading-relaxed">{result.ai_feedback}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
