import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuizResult } from '../api/quizzes';
import type { QuizResponse, QuizQuestionResponse } from '../types';

export const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getQuiz(id)
      .then((res) => {
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(''));
      })
      .catch(() => setQuiz(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="app-container min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin" />
          <p className="text-[14px] text-[#B0A498]">퀴즈 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="app-container min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <span className="material-symbols-outlined text-[#E9E1D6] text-[64px]">quiz</span>
          <p className="text-[14px] text-[#B0A498] mt-2">퀴즈 문항이 없습니다.</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-[#FF6A00] text-[14px] font-semibold">← 돌아가기</button>
        </div>
      </div>
    );
  }

  const question: QuizQuestionResponse = quiz.questions[currentIdx];
  const total = quiz.questions.length;
  const isLast = currentIdx === total - 1;
  const isCorrect = selected === question.correct_answer;

  const handleSelect = (opt: string) => {
    if (showExplanation) return;
    setSelected(opt);
    setShowExplanation(true);
    const newAnswers = [...answers];
    newAnswers[currentIdx] = opt;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLast) handleSubmit();
    else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const handleSubmit = async () => {
    if (!id || submitting) return;
    setSubmitting(true);
    const correctCount = answers.filter((a, i) => a === quiz.questions[i].correct_answer).length;
    const score = Math.round((correctCount / total) * 100);
    try {
      const res = await submitQuizResult(id, { score, user_answers: answers });
      const raw = res.data.ai_feedback;
      let aiFeedback: string[] | undefined;
      if (typeof raw === 'string') {
        try { aiFeedback = JSON.parse(raw); } catch { aiFeedback = [raw]; }
      } else if (Array.isArray(raw)) {
        aiFeedback = raw as string[];
      }
      navigate('/quiz-results', { state: { score, total, correctCount, aiFeedback, lectureId: quiz.lecture_id } });
    } catch {
      navigate('/quiz-results', { state: { score, total, correctCount, lectureId: quiz.lecture_id } });
    }
  };

  const progress = ((currentIdx + (showExplanation ? 1 : 0)) / total) * 100;

  return (
    <div className="app-container min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-[#E9E1D6] px-5 pt-14 pb-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center text-[#B0A498]">
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>
        <div className="text-center">
          <p className="text-[15px] font-bold text-[#171717]">퀴즈</p>
          <p className="text-[11px] text-[#B0A498]">문제 {currentIdx + 1}/{total}</p>
        </div>
        <div className="w-10 flex justify-end">
          <span className="text-[#FF6A00] font-bold text-[13px]">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-[#E9E1D6]">
        <div className="h-full bg-[#FF6A00] transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto pb-4">
        {/* Question card */}
        <div className="mx-4 mt-4 mb-3 bg-white rounded-xl border border-[#E9E1D6] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] anim-enter">
          <span className="inline-block bg-[#FFF4EA] text-[#FF6A00] text-[11px] font-semibold px-2 py-0.5 rounded-md mb-3">
            Q{currentIdx + 1}
          </span>
          <h3 className="text-[17px] font-semibold leading-[1.5] tracking-[-0.01em] text-[#171717]">
            {question.question_text}
          </h3>
        </div>

        {/* Options */}
        <div className="mx-4 space-y-2">
          {question.options.map((opt, i) => {
            let containerClass = 'bg-white border border-[#E9E1D6]';
            let textClass = 'text-[#171717]';
            let iconEl = null;

            if (showExplanation) {
              if (opt === question.correct_answer) {
                containerClass = 'border-2 border-[#FF6A00] bg-[#FFF4EA]';
                textClass = 'text-[#CC5200] font-semibold';
                iconEl = (
                  <span className="material-symbols-outlined text-[#FF6A00] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                );
              } else if (opt === selected) {
                containerClass = 'border border-[#DDD4C8] bg-[#EFE7DC]';
                textClass = 'text-[#6F6A64]';
                iconEl = (
                  <span className="material-symbols-outlined text-[#364152] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    cancel
                  </span>
                );
              } else {
                containerClass = 'border border-[#E9E1D6] bg-white opacity-35';
              }
            } else if (opt === selected) {
              containerClass = 'border-2 border-[#FF6A00] bg-[#FFF4EA]';
              textClass = 'text-[#CC5200] font-semibold';
            }

            return (
              <div
                key={i}
                onClick={() => handleSelect(opt)}
                style={{ animationDelay: `${i * 0.05}s` }}
                className={`anim-enter flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-150 ${containerClass}`}
              >
                <p className={`text-[14px] font-medium leading-[1.5] flex-1 ${textClass}`}>{opt}</p>
                {iconEl && <div className="ml-3 shrink-0">{iconEl}</div>}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`mx-4 mt-3 rounded-xl p-4 ${isCorrect ? 'bg-[#FFF4EA] border border-[#F5C99A]' : 'bg-[#F6F0E8] border border-[#E9E1D6]'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`material-symbols-outlined text-[15px] ${isCorrect ? 'text-[#FF6A00]' : 'text-[#364152]'}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isCorrect ? 'check_circle' : 'info'}
              </span>
              <p className={`font-semibold text-[13px] ${isCorrect ? 'text-[#FF6A00]' : 'text-[#364152]'}`}>
                {isCorrect ? '정답' : '오답'}
              </p>
            </div>
            {!isCorrect && (
              <p className="text-[13px] text-[#4D4840] mb-1.5">
                정답: <span className="text-[#FF6A00] font-semibold">{question.correct_answer}</span>
              </p>
            )}
            {question.explanation && (
              <p className="text-[13px] text-[#6F6A64] leading-[1.65]">{question.explanation}</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-[#E9E1D6] px-4 py-4">
        {showExplanation ? (
          <button
            onClick={handleNext}
            disabled={submitting}
            className="btn-press w-full h-[52px] bg-[#FF6A00] hover:bg-[#E05E00] text-white font-semibold text-[15px] rounded-xl shadow-[0_4px_16px_rgba(255,106,0,0.22)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? '제출 중...' : isLast ? '결과 보기' : '다음으로'}
            {!submitting && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
          </button>
        ) : (
          <div className="h-[52px] flex items-center justify-center">
            <p className="text-[13px] text-[#B0A498]">보기를 선택해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
};
