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
    <div className="app-container bg-bg-light min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 bg-bg-light">
        <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center text-slate-500">
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>
        <h2 className="text-base font-bold text-slate-900 flex-1 text-center truncate px-2">멋쟁이사자처럼</h2>
        <div className="w-11" />
      </div>

      {/* Progress */}
      <div className="px-4 pb-4 space-y-2">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Progress</span>
            <p className="text-xl font-bold text-slate-900">
              {String(currentIdx + 1).padStart(2, '0')}{' '}
              <span className="text-slate-300 font-normal">/ {String(total).padStart(2, '0')}</span>
            </p>
          </div>
          <p className="text-primary text-sm font-bold">{Math.round(((currentIdx + 1) / total) * 100)}% 완료</p>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 pb-4 gap-3 overflow-y-auto">
        {/* Question */}
        <div className="pt-6 pb-4">
          <span className="text-primary font-bold text-sm">질문 {String(currentIdx + 1).padStart(2, '0')}</span>
          <h3 className="text-xl font-bold text-slate-900 mt-1.5 leading-snug">{question.question_text}</h3>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 flex-1">
          {question.options.map((opt, i) => {
            let border = 'border-slate-100';
            let bg = '';
            let text = 'text-slate-700';
            let radioFill = false;

            if (showExplanation) {
              if (opt === question.correct_answer) {
                border = 'border-emerald-400'; bg = 'bg-emerald-50'; text = 'text-emerald-700';
              } else if (opt === selected) {
                border = 'border-red-300'; bg = 'bg-red-50'; text = 'text-red-600';
              } else {
                border = 'border-slate-100'; text = 'text-slate-300';
              }
            } else if (opt === selected) {
              border = 'border-primary'; bg = 'bg-primary/5'; text = 'text-primary'; radioFill = true;
            }

            return (
              <div
                key={i}
                onClick={() => handleSelect(opt)}
                className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all cursor-pointer bg-white ${border} ${bg}`}
              >
                <p className={`text-sm font-semibold leading-snug flex-1 ${text}`}>{opt}</p>
                <div className={`ml-3 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  radioFill ? 'border-primary' :
                  showExplanation && opt === question.correct_answer ? 'border-emerald-500' :
                  showExplanation && opt === selected ? 'border-red-400' :
                  'border-slate-200'
                }`}>
                  {showExplanation && opt === question.correct_answer && (
                    <span className="material-symbols-outlined text-emerald-500 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  )}
                  {showExplanation && opt === selected && opt !== question.correct_answer && (
                    <span className="material-symbols-outlined text-red-400 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>close</span>
                  )}
                  {radioFill && !showExplanation && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`rounded-xl p-4 ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`font-bold text-sm mb-1 ${isCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
              {isCorrect ? '✓ 정답!' : '✗ 오답'}
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

      {/* Bottom next button */}
      <div className="px-4 py-4 bg-white/80 backdrop-blur-md border-t border-slate-100 sticky bottom-0">
        {showExplanation ? (
          <button
            onClick={handleNext}
            disabled={submitting}
            className="w-full h-14 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-60 transition-all"
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
