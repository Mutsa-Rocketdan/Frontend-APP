import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConcepts } from '../api/lectures';
import { createQuiz } from '../api/quizzes';
import { useTaskPoller } from '../hooks/useTaskPoller';
import { getLectureById } from '../data/curriculum';
import { getMockConceptsByLectureId } from '../data/mockContent';
import type { ConceptResponse } from '../types';

const MASTERY_COLOR = (s: number) =>
  s >= 0.7 ? 'text-[#FF6A00]' : s >= 0.4 ? 'text-[#8C7C72]' : 'text-[#A89E98]';
const MASTERY_BG = (s: number) =>
  s >= 0.7 ? 'bg-[#FFF4EA]' : s >= 0.4 ? 'bg-[#F2EDE9]' : 'bg-[#F5F0ED]';
const MASTERY_BORDER = (s: number) =>
  s >= 0.7 ? 'border-[#F5C99A]' : s >= 0.4 ? 'border-[#D4C8C0]' : 'border-[#E0D8D2]';
const MASTERY_LABEL = (s: number) =>
  s >= 0.7 ? '잘 이해함' : s >= 0.4 ? '복습 필요' : '집중 학습';
const MASTERY_BAR = (s: number) =>
  s >= 0.7 ? 'bg-[#FF6A00]' : s >= 0.4 ? 'bg-[#8C7C72]' : 'bg-[#C8C0BA]';

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
      <div className="app-container min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <span className="material-symbols-outlined text-[#E9E1D6] text-[64px]">search_off</span>
          <p className="text-[14px] text-[#B0A498] mt-2">강의를 찾을 수 없어요</p>
          <button onClick={() => navigate('/')} className="mt-4 text-[#FF6A00] text-[14px] font-semibold">← 강의 목록으로</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container min-h-screen flex flex-col">
      {/* Dark video hero */}
      <div className="relative bg-[#0D0D0D] aspect-video flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-[#0D0D0D]" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="material-symbols-outlined text-white text-[96px]">
            {lecture.subject.includes('Back') ? 'storage' : lecture.subject.includes('Front') ? 'code' : 'auto_awesome'}
          </span>
        </div>
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-14 pb-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
        <button className="relative w-16 h-16 bg-[#FF6A00] rounded-full text-white flex items-center justify-center shadow-2xl">
          <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Meta */}
        <div className="px-5 pt-5 pb-4 border-b border-[#E9E1D6] anim-enter">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-[#FFF4EA] text-[#FF6A00] text-[11px] font-semibold uppercase rounded-md border border-[#F5C99A]">
              Week {String(lecture.week).padStart(2, '0')}
            </span>
            <span className="text-[12px] font-medium text-[#A39586]">{lecture.subject}</span>
          </div>
          <h1 className="text-[22px] font-bold leading-[1.35] tracking-[-0.02em] text-[#171717]">{lecture.topic}</h1>
          <p className="text-[14px] leading-[1.65] text-[#A39586] mt-2">{lecture.learning_goal}</p>
        </div>

        {/* Learning goals */}
        <div className="px-5 py-4 border-b border-[#E9E1D6] anim-enter-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B0A498] mb-3">주요 학습 목표</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#FF6A00] text-[18px] mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p className="text-[14px] font-medium text-[#171717] leading-[1.5]">{lecture.learning_goal}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#FF6A00] text-[18px] mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p className="text-[14px] font-medium text-[#171717] leading-[1.5]">{lecture.subject} 핵심 개념 이해</p>
            </div>
          </div>
        </div>

        {/* Concepts */}
        <div className="px-5 py-4 anim-enter-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B0A498] mb-3">핵심 개념</p>
          {loadingConcepts ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-0">
              {concepts.map((c, i) => {
                const pct = Math.round((c.mastery_score ?? 0) * 100);
                return (
                  <div key={c.id ?? i} className={`py-4 ${i < concepts.length - 1 ? 'border-b border-[#E9E1D6]' : ''}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-[15px] font-semibold leading-[1.5] text-[#171717]">{c.concept_name}</h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 border ${MASTERY_BG(c.mastery_score ?? 0)} ${MASTERY_BORDER(c.mastery_score ?? 0)} ${MASTERY_COLOR(c.mastery_score ?? 0)}`}>
                        {MASTERY_LABEL(c.mastery_score ?? 0)}
                      </span>
                    </div>
                    {c.description && (
                      <p className="text-[13px] text-[#A39586] leading-[1.65] mb-2.5">{c.description}</p>
                    )}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-[11px] text-[#A39586]">이해도</span>
                        <span className="text-[11px] font-medium text-[#A39586]">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-[#E9E1D6] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${MASTERY_BAR(c.mastery_score ?? 0)}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 py-4 bg-white/95 backdrop-blur-sm border-t border-[#E9E1D6] flex gap-3">
        <button
          onClick={() => navigate(`/lectures/${id}/guide`)}
          className="flex-1 h-[52px] border border-[#E9E1D6] text-[#4D4840] rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-[#FFF4EA] hover:border-[#F5C99A] hover:text-[#FF6A00] transition-all duration-150 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[20px]">menu_book</span>
          학습 가이드
        </button>
        <button
          onClick={isGenerating ? undefined : handleGenerateQuiz}
          disabled={isGenerating}
          className="btn-press flex-[1.5] h-[52px] bg-[#FF6A00] hover:bg-[#E05E00] text-white rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(255,106,0,0.22)] transition-all disabled:opacity-50"
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
