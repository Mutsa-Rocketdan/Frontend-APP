import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConcepts } from '../api/lectures';
import { createQuiz } from '../api/quizzes';
import { useTaskPoller } from '../hooks/useTaskPoller';
import { ProgressBar } from '../components/ProgressBar';
import { getLectureById } from '../data/curriculum';
import type { ConceptResponse } from '../types';

// 백엔드 없을 때 보여줄 mock 개념
const MOCK_CONCEPTS: ConceptResponse[] = [
  { id: 1, lecture_id: 'mock', concept_name: '데코레이터 패턴', description: '기존 객체에 새로운 기능을 동적으로 추가하는 구조적 디자인 패턴. 상속 대신 합성을 사용한다.', mastery_score: 0.3 },
  { id: 2, lecture_id: 'mock', concept_name: '옵저버 패턴', description: '한 객체의 상태 변화를 다른 객체들에게 자동으로 알리는 행동 패턴. 이벤트 기반 시스템에 활용된다.', mastery_score: 0.6 },
  { id: 3, lecture_id: 'mock', concept_name: '파사드 패턴', description: '복잡한 서브시스템을 단순한 인터페이스로 감싸는 구조적 패턴. 클라이언트와 시스템 간 결합도를 낮춘다.', mastery_score: 0.0 },
];

const GeneratingModal = ({ label, taskId, onDone }: { label: string; taskId: string; onDone: (id?: string) => void }) => {
  const task = useTaskPoller(taskId);
  useEffect(() => {
    if (task?.status === 'completed') {
      const resultId = task.result_url?.split('/').pop();
      setTimeout(() => onDone(resultId), 800);
    }
  }, [task?.status, task?.result_url, onDone]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-semibold text-gray-900 mb-1">AI가 {label}을 생성하고 있어요</p>
        <p className="text-gray-500 text-sm mb-6">잠시만 기다려주세요...</p>
        <ProgressBar progress={task?.progress ?? 0} />
        {task?.status === 'failed' && (
          <p className="text-red-500 text-sm mt-4">생성 중 오류가 발생했습니다.</p>
        )}
      </div>
    </div>
  );
};

export const LectureDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [concepts, setConcepts] = useState<ConceptResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'concepts' | 'quiz' | 'guide'>('concepts');
  const [quizTaskId, setQuizTaskId] = useState<string | undefined>();
  const [guideTaskId, setGuideTaskId] = useState<string | undefined>();
  const [generating, setGenerating] = useState<'quiz' | 'guide' | null>(null);
  const navigate = useNavigate();

  const lecture = getLectureById(id ?? '');

  useEffect(() => {
    if (!id) return;
    // 백엔드 없으면 mock 데이터로 폴백
    getConcepts(id)
      .then((res) => setConcepts(res.data))
      .catch(() => setConcepts(MOCK_CONCEPTS))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCreateQuiz = async () => {
    if (!id || generating) return;
    setGenerating('quiz');
    try {
      const res = await createQuiz(id);
      if (res.data.task_id) {
        setQuizTaskId(res.data.task_id);
      } else {
        navigate(`/quizzes/${res.data.id}`);
      }
    } catch {
      // 백엔드 없으면 mock quiz로 이동
      navigate('/quizzes/mock');
      setGenerating(null);
    }
  };

  const handleCreateGuide = async () => {
    if (!id || generating) return;
    setGenerating('guide');
    try {
      // TODO: 학습가이드 생성 API 연동 (성진님 추가 예정)
      // 임시로 mock guide 페이지로 이동
      navigate(`/lectures/${id}/guide`);
    } catch {
      navigate(`/lectures/${id}/guide`);
    } finally {
      setGenerating(null);
    }
  };

  const handleQuizDone = useCallback((quizId?: string) => {
    setQuizTaskId(undefined);
    setGenerating(null);
    navigate(quizId ? `/quizzes/${quizId}` : '/quizzes/mock');
  }, [navigate]);

  const masteryColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-red-500';
  };

  const masteryBg = (score: number) => {
    if (score >= 0.7) return 'bg-green-500';
    if (score >= 0.4) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {quizTaskId && <GeneratingModal label="퀴즈" taskId={quizTaskId} onDone={handleQuizDone} />}
      {guideTaskId && <GeneratingModal label="학습 가이드" taskId={guideTaskId} onDone={() => { setGuideTaskId(undefined); setGenerating(null); }} />}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-5 md:py-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-orange-500 text-sm mb-3 flex items-center gap-1 transition-colors"
          >
            ← 강의 목록
          </button>
          {lecture && (
            <>
              <div className="flex flex-wrap gap-2 items-center mb-2">
                <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                  {lecture.week}주차
                </span>
                <span className="text-xs text-gray-400">{lecture.date} · {lecture.instructor}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{lecture.topic}</h1>
              <p className="text-sm text-gray-500 mt-1">{lecture.learning_goal}</p>
            </>
          )}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto flex gap-2">
          <button
            onClick={handleCreateQuiz}
            disabled={!!generating}
            className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>⚡</span>
            {generating === 'quiz' ? '생성 중...' : '퀴즈 자동 생성'}
          </button>
          <button
            onClick={handleCreateGuide}
            disabled={!!generating}
            className="flex-1 md:flex-none bg-white border border-orange-400 hover:bg-orange-50 disabled:bg-gray-50 text-orange-500 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>📖</span>
            {generating === 'guide' ? '생성 중...' : '학습 가이드 생성'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="max-w-3xl mx-auto flex">
          {(['concepts', 'quiz', 'guide'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'concepts' ? '핵심 개념' : tab === 'quiz' ? '퀴즈' : '학습 가이드'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {activeTab === 'concepts' && (
          <>
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {concepts.map((concept) => (
                  <div key={concept.id} className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{concept.concept_name}</h3>
                      <span className={`text-xs font-semibold ml-3 shrink-0 ${masteryColor(concept.mastery_score)}`}>
                        숙련도 {Math.round(concept.mastery_score * 100)}%
                      </span>
                    </div>
                    {concept.description && (
                      <p className="text-gray-500 text-sm leading-relaxed mb-3">{concept.description}</p>
                    )}
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${masteryBg(concept.mastery_score)}`}
                        style={{ width: `${Math.max(concept.mastery_score * 100, 4)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'quiz' && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">⚡</p>
            <p className="font-semibold text-gray-700 mb-2">퀴즈를 자동 생성할 수 있어요</p>
            <p className="text-gray-500 text-sm mb-6">AI가 강의 내용을 분석해서 퀴즈를 만들어드려요</p>
            <button
              onClick={handleCreateQuiz}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              퀴즈 생성 시작
            </button>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📖</p>
            <p className="font-semibold text-gray-700 mb-2">학습 가이드를 자동 생성할 수 있어요</p>
            <p className="text-gray-500 text-sm mb-6">핵심 요약, 개념 맵, 복습 포인트를 AI가 만들어드려요</p>
            <button
              onClick={handleCreateGuide}
              className="bg-white border border-orange-400 hover:bg-orange-50 text-orange-500 font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              학습 가이드 생성 시작
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
