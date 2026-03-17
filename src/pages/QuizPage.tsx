import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuizResult } from '../api/quizzes';
import { getMockQuizByLectureId } from '../data/mockContent';
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
    const mockQuiz = getMockQuizByLectureId(id);
    if (mockQuiz) {
      setQuiz(mockQuiz);
      setAnswers(new Array(mockQuiz.questions.length).fill(''));
      setLoading(false);
      return;
    }
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
      <div className="app-container bg-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">퀴즈 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="app-container bg-white min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <span className="material-symbols-outlined text-slate-200 text-[64px]">quiz</span>
          <p className="text-slate-500 mt-2">퀴즈 문항이 없습니다.</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-primary text-sm font-semibold">← 돌아가기</button>
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
      const isMock = !!getMockQuizByLectureId(id);
      if (!isMock) await submitQuizResult(id, { score, user_answers: answers });
    } finally {
      navigate('/quiz-results', { state: { score, total, correctCount } });
    }
  };

  const progress = ((currentIdx + (showExplanation ? 1 : 0)) / total) * 100;

  return (
    <div className="app-container bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 bg-white border-b border-[#E5E3DE]">
        <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center text-slate-400">
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>
        <h2 className="text-sm font-bold text-[#0D0D0D] flex-1 text-center truncate px-2">멋쟁이사자처럼</h2>
        <div className="w-11 text-right">
          <span className="text-xs font-semibold text-slate-400">{currentIdx + 1}/{total}</span>
        </div>
      </div>

      {/* Progress bar - full width, no padding */}
      <div className="h-1 w-full bg-[#F5F4F1]">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col px-5 pb-4 overflow-y-auto">
        {/* Question */}
        <div className="pt-7 pb-5">
          <span className="text-primary font-black text-sm">Q{currentIdx + 1}</span>
          <h3 className="text-xl font-black text-[#0D0D0D] mt-2 leading-snug">{question.question_text}</h3>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 flex-1">
          {question.options.map((opt, i) => {
            let borderClass = 'border-slate-200';
            let bgClass = 'bg-white';
            let textClass = 'text-slate-700';
            let radioFill = false;

            if (showExplanation) {
              if (opt === question.correct_answer) {
                borderClass = 'border-emerald-400'; bgClass = 'bg-emerald-50'; textClass = 'text-emerald-700';
              } else if (opt === selected) {
                borderClass = 'border-red-300'; bgClass = 'bg-red-50'; textClass = 'text-red-600';
              } else {
                borderClass = 'border-slate-200'; textClass = 'text-slate-300';
              }
            } else if (opt === selected) {
              borderClass = 'border-[#FF6A00]'; bgClass = 'bg-orange-50'; textClass = 'text-[#FF6A00]'; radioFill = true;
            }

            return (
              <div
                key={i}
                onClick={() => handleSelect(opt)}
                className={`flex items-center justify-between px-4 py-4 rounded-lg border transition-all cursor-pointer ${borderClass} ${bgClass}`}
              >
                <p className={`text-sm font-semibold leading-snug flex-1 ${textClass}`}>{opt}</p>
                <div className={`ml-3 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  radioFill ? 'border-[#FF6A00]' :
                  showExplanation && opt === question.correct_answer ? 'border-emerald-500' :
                  showExplanation && opt === selected ? 'border-red-400' :
                  'border-slate-200'
                }`}>
                  {showExplanation && opt === question.correct_answer && (
                    <span className="material-symbols-outlined text-emerald-500 text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  )}
                  {showExplanation && opt === selected && opt !== question.correct_answer && (
                    <span className="material-symbols-outlined text-red-400 text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>close</span>
                  )}
                  {radioFill && !showExplanation && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF6A00]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`mt-4 rounded-lg p-4 ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`font-bold text-sm mb-1 ${isCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
              {isCorrect ? '정답!' : '오답'}
            </p>
            {!isCorrect && (
              <p className="text-slate-700 text-xs mb-1.5">
                정답: <span className="text-emerald-600 font-bold">{question.correct_answer}</span>
              </p>
            )}
            {question.explanation && (
              <p className="text-slate-600 text-xs leading-relaxed">{question.explanation}</p>
            )}
          </div>
        )}
      </div>

      {/* Sticky bottom button */}
      <div className="sticky bottom-0 px-5 py-4 bg-white border-t border-[#E5E3DE]">
        {showExplanation ? (
          <button
            onClick={handleNext}
            disabled={submitting}
            className="w-full h-14 bg-[#FF6A00] text-white rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
          >
            {submitting ? '제출 중...' : isLast ? '결과 보기' : '다음으로'}
            {!submitting && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
          </button>
        ) : (
          <div className="h-14 flex items-center justify-center">
            <p className="text-slate-400 text-sm font-medium">보기를 선택해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
};
