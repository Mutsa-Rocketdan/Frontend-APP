import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConcepts } from '../api/lectures';
import { createQuiz } from '../api/quizzes';
import { useTaskPoller } from '../hooks/useTaskPoller';
import { getLectureById } from '../data/curriculum';
import { getMockConceptsByLectureId } from '../data/mockContent';
import type { ConceptResponse } from '../types';

const MASTERY_COLOR = (s: number) =>
  s >= 0.7 ? 'bg-emerald-100 text-emerald-700' : s >= 0.4 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-500';
const MASTERY_LABEL = (s: number) =>
  s >= 0.7 ? '잘 이해함' : s >= 0.4 ? '복습 필요' : '집중 학습';
const MASTERY_BAR = (s: number) =>
  s >= 0.7 ? 'bg-emerald-500' : s >= 0.4 ? 'bg-amber-400' : 'bg-primary';

export const LectureDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lecture = getLectureById(id ?? '');
  const [concepts, setConcepts] = useState<ConceptResponse[]>([]);
  const [loadingConcepts, setLoadingConcepts] = useState(true);
  const [quizTaskId, setQuizTaskId] = useState<string | undefined>(undefined);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  const quizTask = useTaskPoller(quizTaskId);
  const quizStatus = quizTask?.status;

  useEffect(() => {
    if (!id) return;
    const mock = getMockConceptsByLectureId(id);
    if (mock.length) { setConcepts(mock); setLoadingConcepts(false); return; }
    getConcepts(id)
      .then((res) => setConcepts(res.data))
      .catch(() => setConcepts(getMockConceptsByLectureId(id)))
      .finally(() => setLoadingConcepts(false));
  }, [id]);

  useEffect(() => {
    if (quizStatus === 'completed') navigate(`/quizzes/${id}`);
  }, [quizStatus, id, navigate]);

  const handleGenerateQuiz = useCallback(async () => {
    if (!id || generatingQuiz) return;
    setGeneratingQuiz(true);
    try {
      const res = await createQuiz(id);
      const tid = res.data.task_id;
      if (tid) setQuizTaskId(tid);
      else navigate(`/quizzes/${id}`);
    } catch {
      navigate(`/quizzes/${id}`);
    } finally {
      setGeneratingQuiz(false);
    }
  }, [id, generatingQuiz, navigate]);

  const isGenerating = generatingQuiz || (quizTaskId !== undefined && quizStatus !== 'completed' && quizStatus !== 'failed');

  if (!lecture) {
    return (
      <div className="app-container bg-white min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <span className="material-symbols-outlined text-slate-200 text-[64px]">search_off</span>
          <p className="text-slate-500 mt-2">강의를 찾을 수 없어요</p>
          <button onClick={() => navigate('/')} className="mt-4 text-primary text-sm font-semibold">← 강의 목록으로</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container bg-white min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b border-[#E5E3DE]">
        <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center text-[#0D0D0D]">
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <h2 className="text-sm font-bold text-[#0D0D0D] flex-1 text-center truncate px-2">강의 상세</h2>
        <button className="w-11 h-11 flex items-center justify-end text-slate-400">
          <span className="material-symbols-outlined text-[22px]">share</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Video thumbnail */}
        <div className="relative aspect-video bg-[#0D0D0D] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-[#0D0D0D]" />
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="material-symbols-outlined text-white text-[96px]">
              {lecture.subject.includes('Back') ? 'storage' : lecture.subject.includes('Front') ? 'code' : 'auto_awesome'}
            </span>
          </div>
          <button className="relative w-20 h-20 bg-primary rounded-full text-white flex items-center justify-center shadow-2xl">
            <span className="material-symbols-outlined text-[44px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          </button>
        </div>

        {/* Meta */}
        <div className="px-5 pt-5 pb-4 border-b border-[#E5E3DE]">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wider">
              Week {String(lecture.week).padStart(2, '0')}
            </span>
            <span className="text-slate-400 text-xs font-medium">{lecture.subject}</span>
          </div>
          <h1 className="text-xl font-black text-[#0D0D0D] leading-snug">{lecture.topic}</h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">{lecture.learning_goal}</p>
        </div>

        {/* Learning goals */}
        <div className="px-5 pt-5 pb-4 border-b border-[#E5E3DE]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">주요 학습 목표</h3>
          <div className="space-y-0">
            <div className="flex items-start gap-3 py-3 border-b border-[#E5E3DE]">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p className="text-sm font-semibold text-[#0D0D0D] leading-snug">{lecture.learning_goal}</p>
            </div>
            <div className="flex items-start gap-3 py-3">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p className="text-sm font-semibold text-[#0D0D0D] leading-snug">{lecture.subject} 핵심 개념 이해</p>
            </div>
          </div>
        </div>

        {/* Concepts */}
        <div className="px-5 pt-5 pb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">핵심 개념</h3>
          {loadingConcepts ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-0">
              {concepts.map((c, i) => {
                const pct = Math.round((c.mastery_score ?? 0) * 100);
                return (
                  <div key={c.id ?? i} className={`py-4 ${i < concepts.length - 1 ? 'border-b border-[#E5E3DE]' : ''}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-[#0D0D0D]">{c.concept_name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${MASTERY_COLOR(c.mastery_score ?? 0)}`}>
                        {MASTERY_LABEL(c.mastery_score ?? 0)}
                      </span>
                    </div>
                    {c.description && <p className="text-xs text-slate-500 leading-relaxed mb-2.5">{c.description}</p>}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] text-slate-400">이해도</span>
                        <span className="text-[10px] font-bold text-slate-600">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-[#F5F4F1] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${MASTERY_BAR(c.mastery_score ?? 0)}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app px-4 py-4 bg-white border-t border-[#E5E3DE] flex gap-3">
        <button
          onClick={() => navigate(`/lectures/${id}/guide`)}
          className="flex-1 h-14 border border-primary text-primary rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">menu_book</span>
          학습 가이드
        </button>
        <button
          onClick={isGenerating ? undefined : handleGenerateQuiz}
          disabled={isGenerating}
          className="flex-[1.5] h-14 bg-[#FF6A00] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-60"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
              퀴즈 시작
            </>
          )}
        </button>
      </div>
    </div>
  );
};
