import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getConcepts } from '../api/lectures';
import { createQuiz } from '../api/quizzes';
import { useTaskPoller } from '../hooks/useTaskPoller';
import { getLectureById } from '../data/curriculum';
import { getMockConceptsByLectureId } from '../data/mockContent';
import type { ConceptResponse } from '../types';

type Tab = 'concepts' | 'quiz' | 'guide';

const MASTERY_LABEL = (score: number) => {
  if (score >= 0.7) return { label: '잘 이해함', color: 'text-green-600 bg-green-50' };
  if (score >= 0.4) return { label: '복습 필요', color: 'text-yellow-600 bg-yellow-50' };
  return { label: '집중 학습', color: 'text-red-500 bg-red-50' };
};

export const LectureDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lecture = getLectureById(id ?? '');
  const [tab, setTab] = useState<Tab>('concepts');
  const [concepts, setConcepts] = useState<ConceptResponse[]>([]);
  const [loadingConcepts, setLoadingConcepts] = useState(true);
  const [quizTaskId, setQuizTaskId] = useState<string | undefined>(undefined);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  const quizTask = useTaskPoller(quizTaskId);
  const quizStatus = quizTask?.status;

  useEffect(() => {
    if (!id) return;
    const mock = getMockConceptsByLectureId(id);
    if (mock.length) {
      setConcepts(mock);
      setLoadingConcepts(false);
      return;
    }
    getConcepts(id)
      .then((res) => setConcepts(res.data))
      .catch(() => setConcepts(getMockConceptsByLectureId(id)))
      .finally(() => setLoadingConcepts(false));
  }, [id]);

  useEffect(() => {
    if (quizStatus === 'completed') {
      navigate(`/quizzes/${id}`);
    }
  }, [quizStatus, id, navigate]);

  const handleGenerateQuiz = useCallback(async () => {
    if (!id || generatingQuiz) return;
    setGeneratingQuiz(true);
    try {
      const res = await createQuiz(id);
      setQuizTaskId(res.data.task_id ?? undefined);
    } catch {
      navigate(`/quizzes/${id}`);
    } finally {
      setGeneratingQuiz(false);
    }
  }, [id, generatingQuiz, navigate]);

  if (!lecture) {
    return (
      <div className="app-container bg-white min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <span className="material-symbols-outlined text-gray-300 text-[64px]">search_off</span>
          <p className="text-gray-500 mt-2">강의를 찾을 수 없어요</p>
          <Link to="/" className="mt-4 inline-block text-primary text-sm font-semibold">← 강의 목록으로</Link>
        </div>
      </div>
    );
  }

  const isGenerating = generatingQuiz || (quizTaskId !== undefined && quizStatus !== 'completed' && quizStatus !== 'failed');

  return (
    <div className="app-container bg-bg-light min-h-screen pb-28">
      {/* Header */}
      <div className="bg-white">
        <div className="flex items-center gap-3 px-4 pt-12 pb-4">
          <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-50">
            <span className="material-symbols-outlined text-gray-700 text-[22px]">arrow_back</span>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-400 font-medium">{lecture.date} · {lecture.instructor}</p>
            <h1 className="text-base font-bold text-gray-900 leading-snug truncate">{lecture.topic}</h1>
          </div>
        </div>

        {/* Learning goal banner */}
        <div className="mx-4 mb-4 bg-primary-light rounded-2xl px-4 py-3 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>target</span>
          <div>
            <p className="text-[10px] font-bold text-primary/70 uppercase tracking-wide mb-0.5">학습 목표</p>
            <p className="text-xs text-primary/90 leading-relaxed">{lecture.learning_goal}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-4">
          {(['concepts', 'quiz', 'guide'] as Tab[]).map((t) => {
            const labels = { concepts: '핵심 개념', quiz: '퀴즈', guide: '학습 가이드' };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                  tab === t ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {labels[t]}
                {tab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 pt-4">
        {tab === 'concepts' && (
          <div className="flex flex-col gap-3">
            {loadingConcepts ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : concepts.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">개념 정보가 없습니다.</div>
            ) : (
              concepts.map((c, i) => {
                const mastery = MASTERY_LABEL(c.mastery_score ?? 0);
                const pct = Math.round((c.mastery_score ?? 0) * 100);
                return (
                  <div key={c.id ?? i} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-gray-900">{c.concept_name}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${mastery.color}`}>
                        {mastery.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">{c.description}</p>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] text-gray-400">이해도</span>
                        <span className="text-[10px] font-bold text-gray-600">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-400' : 'bg-primary'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === 'quiz' && (
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="w-20 h-20 bg-primary-light rounded-3xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[42px]" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">AI 퀴즈 생성</h3>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                강의 스크립트를 분석해<br />맞춤형 복습 퀴즈를 생성해요
              </p>
            </div>
            {isGenerating ? (
              <div className="w-full bg-white rounded-2xl p-5 text-center shadow-sm">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-700">퀴즈 생성 중...</p>
                <p className="text-xs text-gray-400 mt-1">AI가 문제를 만들고 있어요</p>
              </div>
            ) : (
              <>
                <button
                  onClick={handleGenerateQuiz}
                  className="w-full bg-primary text-white font-bold py-4 rounded-2xl text-sm shadow-lg shadow-primary/20"
                >
                  퀴즈 생성하기
                </button>
                <Link
                  to={`/quizzes/${id}`}
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-600 font-medium py-3.5 rounded-2xl text-sm border border-gray-100"
                >
                  <span className="material-symbols-outlined text-[16px]">history</span>
                  기존 퀴즈 풀기
                </Link>
              </>
            )}
          </div>
        )}

        {tab === 'guide' && (
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-500 text-[42px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">AI 학습 가이드</h3>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                강의 내용을 요약하고<br />핵심 개념을 정리해드려요
              </p>
            </div>
            <Link
              to={`/lectures/${id}/guide`}
              className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl text-sm text-center shadow-lg shadow-blue-500/20"
            >
              학습 가이드 보기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
