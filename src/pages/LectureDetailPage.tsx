import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLectureById, getConcepts } from '../api/lectures';
import { createQuiz } from '../api/quizzes';
import { useTaskPoller } from '../hooks/useTaskPoller';
import type { ConceptResponse, LectureResponse, QuizCreateOptions } from '../types';

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

const QUIZ_TYPES = [
  { value: 'multiple_choice', label: '객관식', icon: 'check_box', needsCode: false },
  { value: 'short_answer', label: '주관식', icon: 'edit_note', needsCode: false },
  { value: 'fill_blank', label: '빈칸 채우기', icon: 'text_fields', needsCode: false },
  { value: 'code', label: '코드', icon: 'code', needsCode: true },
] as const;

const DIFFICULTIES = [
  { value: 'easy', label: '쉬움', color: '#4A8A3A', bg: '#F0F8EE' },
  { value: 'medium', label: '보통', color: '#CC7A00', bg: '#FFF4EA' },
  { value: 'hard', label: '어려움', color: '#CC3A3A', bg: '#FFF0F0' },
] as const;

const COUNTS = [3, 5, 7, 10] as const;

export const LectureDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<LectureResponse | null>(null);
  const [lectureLoading, setLectureLoading] = useState(true);
  const [concepts, setConcepts] = useState<ConceptResponse[]>([]);
  const [loadingConcepts, setLoadingConcepts] = useState(true);
  const [quizTaskId, setQuizTaskId] = useState<string | undefined>(undefined);
  const [pendingQuizId, setPendingQuizId] = useState<string | undefined>(undefined);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  const [showQuizSettings, setShowQuizSettings] = useState(false);
  const [quizTypes, setQuizTypes] = useState<string[]>(['multiple_choice']);
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(5);

  const quizTask = useTaskPoller(quizTaskId);
  const quizStatus = quizTask?.status;

  useEffect(() => {
    if (!id) return;
    getLectureById(id)
      .then((res) => setLecture(res.data))
      .catch(() => setLecture(null))
      .finally(() => setLectureLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    getConcepts(id)
      .then((res) => setConcepts(res.data))
      .catch(() => setConcepts([]))
      .finally(() => setLoadingConcepts(false));
  }, [id]);

  useEffect(() => {
    if (quizStatus !== 'completed') return;
    const qid = pendingQuizId ?? (quizTask as any)?.quiz_id;
    navigate(qid ? `/quizzes/${qid}` : '/');
  }, [quizStatus, pendingQuizId, quizTask, navigate]);

  const handleGenerateQuiz = useCallback(async () => {
    if (!id || generatingQuiz) return;
    setGeneratingQuiz(true);
    setShowQuizSettings(false);
    const sanitized = (lecture?.has_code_quiz === false)
      ? quizTypes.filter((t) => t !== 'code')
      : quizTypes;
    const finalTypes = sanitized.length ? sanitized : ['multiple_choice'];
    const options: QuizCreateOptions = { quiz_types: finalTypes, difficulty, count, quiz_type: finalTypes[0] };
    try {
      const res = await createQuiz(id, options);
      const tid = res.data.task_id;
      if (tid) {
        setPendingQuizId(res.data.id);
        setQuizTaskId(tid);
      } else if (res.data.id) {
        navigate(`/quizzes/${res.data.id}`);
      }
    } catch {
      // ignore
    } finally {
      setGeneratingQuiz(false);
    }
  }, [id, generatingQuiz, navigate, quizTypes, difficulty, count, lecture?.has_code_quiz]);

  const isGenerating = generatingQuiz || (quizTaskId !== undefined && quizStatus !== 'completed' && quizStatus !== 'failed');

  if (lectureLoading) {
    return (
      <div className="app-container min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            {lecture.subject?.includes('Back') ? 'storage' : lecture.subject?.includes('Front') ? 'code' : 'auto_awesome'}
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
            {lecture.week != null && (
              <span className="px-2 py-0.5 bg-[#FFF4EA] text-[#FF6A00] text-[11px] font-semibold uppercase rounded-md border border-[#F5C99A]">
                Week {String(lecture.week).padStart(2, '0')}
              </span>
            )}
            {lecture.subject && (
              <span className="text-[12px] font-medium text-[#A39586]">{lecture.subject}</span>
            )}
            {lecture.has_code_quiz !== undefined && (
              <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                lecture.has_code_quiz
                  ? 'bg-[#EEF6FF] text-[#2563EB] border border-[#BFDBFE]'
                  : 'bg-[#F5F0ED] text-[#A39586] border border-[#E0D8D2]'
              }`}>
                <span className="material-symbols-outlined text-[12px]">code</span>
                {lecture.has_code_quiz ? '코드 퀴즈' : '코드 퀴즈 불가'}
              </span>
            )}
          </div>
          <h1 className="text-[22px] font-bold leading-[1.35] tracking-[-0.02em] text-[#171717]">{lecture.subject && lecture.title.startsWith(lecture.subject) ? lecture.title.slice(lecture.subject.length).replace(/^\s*[-–—]\s*/, '') : lecture.title}</h1>
          {(lecture.instructor || lecture.date) && (
            <p className="text-[13px] text-[#B0A498] mt-1.5">
              {[lecture.instructor, lecture.date].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        {/* Learning Goal */}
        {lecture.learning_goal && (
          <div className="px-5 py-4 border-b border-[#E9E1D6] anim-enter-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B0A498] mb-3">학습 목표</p>
            <div className="bg-[#FFF9F3] rounded-xl border border-[#F5C99A]/50 p-4">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#FF6A00] text-[20px] mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
                <p className="text-[14px] text-[#4D4840] leading-[1.7] whitespace-pre-line">{lecture.learning_goal}</p>
              </div>
            </div>
          </div>
        )}

        {/* Concepts */}
        <div className="px-5 py-4 anim-enter-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B0A498] mb-3">핵심 개념</p>
          {loadingConcepts ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : concepts.length === 0 ? (
            <div className="py-6 text-center">
              <span className="material-symbols-outlined text-[#DDD5C8] text-[40px]">auto_awesome</span>
              <p className="text-[13px] text-[#B0A498] mt-2">AI가 개념을 분석 중이에요</p>
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
          onClick={isGenerating ? undefined : () => setShowQuizSettings(true)}
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

      {/* Quiz Settings Modal */}
      {showQuizSettings && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowQuizSettings(false)} />
          <div className="relative w-full max-w-[480px] bg-white rounded-t-2xl border-t border-[#E9E1D6] shadow-[0_-8px_32px_rgba(0,0,0,0.12)] animate-[slideUp_0.3s_ease-out]">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h3 className="text-[17px] font-bold text-[#171717]">퀴즈 설정</h3>
              <button onClick={() => setShowQuizSettings(false)} className="w-8 h-8 flex items-center justify-center text-[#B0A498]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="px-5 pb-2">
              {/* Quiz Type */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B0A498] mb-2">문제 유형</p>
                <div className="flex flex-wrap gap-2">
                  {QUIZ_TYPES.map((t) => {
                    const disabled = t.needsCode && !lecture.has_code_quiz;
                    const active = quizTypes.includes(t.value);
                    return (
                      <button
                        key={t.value}
                        onClick={() => {
                          if (disabled) return;
                          setQuizTypes((prev) => {
                            const has = prev.includes(t.value);
                            const next = has ? prev.filter((x) => x !== t.value) : [...prev, t.value];
                            return next.length ? next : ['multiple_choice'];
                          });
                        }}
                        disabled={disabled}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                          disabled
                            ? 'bg-[#F0EDED] text-[#C4BDB6] cursor-not-allowed opacity-50'
                            : active
                              ? 'bg-[#FF6A00] text-white shadow-[0_2px_8px_rgba(255,106,0,0.25)]'
                              : 'bg-[#F5F0ED] text-[#6F6A64] hover:bg-[#EDE6DF]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                        {t.label}
                      </button>
                    );
                  })}
                </div>
                {!lecture.has_code_quiz && (
                  <p className="text-[11px] text-[#B0A498] mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">info</span>
                    이 강의는 코드 퀴즈에 적합하지 않은 내용입니다
                  </p>
                )}
              </div>

              {/* Difficulty */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B0A498] mb-2">난이도</p>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value)}
                      className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                        difficulty === d.value
                          ? 'ring-2 ring-offset-1'
                          : 'opacity-60 hover:opacity-80'
                      }`}
                      style={{
                        background: d.bg,
                        color: d.color,
                        ...(difficulty === d.value ? { ringColor: d.color } : {}),
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count */}
              <div className="mb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B0A498] mb-2">문항 수</p>
                <div className="flex gap-2">
                  {COUNTS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCount(c)}
                      className={`flex-1 py-2.5 rounded-lg text-[14px] font-bold transition-all ${
                        count === c
                          ? 'bg-[#FF6A00] text-white shadow-[0_2px_8px_rgba(255,106,0,0.25)]'
                          : 'bg-[#F5F0ED] text-[#6F6A64] hover:bg-[#EDE6DF]'
                      }`}
                    >
                      {c}문제
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 pb-6">
              <button
                onClick={handleGenerateQuiz}
                className="btn-press w-full h-[52px] bg-[#FF6A00] hover:bg-[#E05E00] text-white rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(255,106,0,0.22)] transition-all"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                퀴즈 생성하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
