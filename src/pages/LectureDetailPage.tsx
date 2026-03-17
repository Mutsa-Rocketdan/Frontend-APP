import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConcepts } from '../api/lectures';
import { createQuiz } from '../api/quizzes';
import { useTaskPoller } from '../hooks/useTaskPoller';
import { ProgressBar } from '../components/ProgressBar';
import type { ConceptResponse } from '../types';

const QuizGeneratingModal = ({ taskId, onDone }: { taskId: string; onDone: (quizId: string) => void }) => {
  const task = useTaskPoller(taskId);

  useEffect(() => {
    // task 완료 시 quiz_id 추출 (result_url 또는 별도 방법으로)
    if (task?.status === 'completed') {
      // result_url에서 quiz id 파싱 시도, 없으면 목록으로
      const quizId = task.result_url?.split('/').pop();
      setTimeout(() => onDone(quizId || ''), 800);
    }
  }, [task?.status, task?.result_url, onDone]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-sm text-center">
        <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white font-semibold mb-1">AI가 퀴즈를 생성하고 있어요</p>
        <p className="text-zinc-400 text-sm mb-6">잠시만 기다려주세요...</p>
        <ProgressBar progress={task?.progress ?? 0} />
        {task?.status === 'failed' && (
          <p className="text-red-400 text-sm mt-4">퀴즈 생성 중 오류가 발생했습니다.</p>
        )}
      </div>
    </div>
  );
};

export const LectureDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [concepts, setConcepts] = useState<ConceptResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizTaskId, setQuizTaskId] = useState<string | undefined>();
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getConcepts(id)
      .then((res) => setConcepts(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCreateQuiz = async () => {
    if (!id || generatingQuiz) return;
    setGeneratingQuiz(true);
    try {
      const res = await createQuiz(id);
      if (res.data.task_id) {
        setQuizTaskId(res.data.task_id);
      } else if (res.data.id) {
        navigate(`/quizzes/${res.data.id}`);
      }
    } catch {
      setGeneratingQuiz(false);
    }
  };

  const handleQuizDone = useCallback((quizId: string) => {
    setQuizTaskId(undefined);
    setGeneratingQuiz(false);
    if (quizId) navigate(`/quizzes/${quizId}`);
    else navigate('/lectures');
  }, [navigate]);

  const masteryColor = (score: number) => {
    if (score >= 0.7) return 'text-green-400';
    if (score >= 0.4) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {quizTaskId && <QuizGeneratingModal taskId={quizTaskId} onDone={handleQuizDone} />}

      <div className="max-w-4xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate('/lectures')}
          className="text-zinc-500 hover:text-orange-500 text-sm mb-6 flex items-center gap-1 transition-colors"
        >
          ← 강의 목록으로
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-2xl font-bold">핵심 개념</h1>
            <p className="text-zinc-500 text-sm mt-1">AI가 추출한 강의 핵심 개념들이에요</p>
          </div>
          <button
            onClick={handleCreateQuiz}
            disabled={generatingQuiz || concepts.length === 0}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            {generatingQuiz ? '생성 중...' : '퀴즈 생성'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : concepts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-zinc-400">아직 추출된 개념이 없어요</p>
            <p className="text-zinc-600 text-sm mt-1">AI 분석이 완료되면 개념이 표시됩니다</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {concepts.map((concept) => (
              <div key={concept.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-orange-500 font-semibold">{concept.concept_name}</h3>
                  <span className={`text-sm font-medium ${masteryColor(concept.mastery_score)}`}>
                    숙련도 {Math.round(concept.mastery_score * 100)}%
                  </span>
                </div>
                {concept.description && (
                  <p className="text-zinc-400 text-sm leading-relaxed">{concept.description}</p>
                )}
                <div className="mt-3">
                  <div className="w-full bg-zinc-800 rounded-full h-1.5">
                    <div
                      className="bg-orange-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${concept.mastery_score * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
