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
          <p className="text-sm text-gray-400">퀴즈 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="app-container bg-white min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <span className="material-symbols-outlined text-gray-200 text-[64px]">quiz</span>
          <p className="text-gray-500 mt-2">퀴즈 문항이 없습니다.</p>
          <button onClick={() => navigate('/')} className="mt-4 text-primary text-sm font-semibold">
            강의 목록으로
          </button>
        </div>
      </div>
    );
  }

  const question: QuizQuestionResponse = quiz.questions[currentIdx];
  const total = quiz.questions.length;
  const isLast = currentIdx === total - 1;
  const isCorrect = selected === question.correct_answer;
  const optionLabel = ['A', 'B', 'C', 'D'];
  const progress = ((currentIdx + 1) / total) * 100;

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
    const correctCount = answers.filter((ans, i) => ans === quiz.questions[i].correct_answer).length;
    const score = Math.round((correctCount / total) * 100);
    try {
      const isMockQuiz = !!getMockQuizByLectureId(id);
      if (!isMockQuiz) await submitQuizResult(id, { score, user_answers: answers });
    } finally {
      navigate('/quiz-results', { state: { score, total, correctCount } });
    }
  };

  return (
    <div className="app-container bg-bg-light min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-white px-4 pt-12 pb-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-50">
            <span className="material-symbols-outlined text-gray-500 text-[22px]">close</span>
          </button>
          <span className="text-xs text-gray-500 font-medium truncate flex-1 mx-3 text-center">{quiz.title}</span>
          <span className="text-sm font-bold text-primary shrink-0">{currentIdx + 1}/{total}</span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 py-5 gap-3">
        {/* Question */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wide mb-2">문제 {currentIdx + 1}</p>
          <p className="text-base font-semibold text-gray-900 leading-relaxed">{question.question_text}</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2">
          {question.options.map((opt, i) => {
            let bg = 'bg-white border-gray-100';
            let text = 'text-gray-700';
            if (showExplanation) {
              if (opt === question.correct_answer) { bg = 'bg-green-50 border-green-300'; text = 'text-green-700'; }
              else if (opt === selected) { bg = 'bg-red-50 border-red-300'; text = 'text-red-600'; }
              else { bg = 'bg-white border-gray-50'; text = 'text-gray-300'; }
            } else if (opt === selected) {
              bg = 'bg-primary-light border-primary';
              text = 'text-primary';
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`w-full text-left border-2 rounded-2xl px-4 py-3.5 text-sm transition-all flex items-center gap-3 ${bg} ${text}`}
              >
                <span className={`w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold shrink-0`}>
                  {optionLabel[i]}
                </span>
                <span className="leading-snug">{opt}</span>
                {showExplanation && opt === question.correct_answer && (
                  <span className="material-symbols-outlined ml-auto text-green-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                )}
                {showExplanation && opt === selected && opt !== question.correct_answer && (
                  <span className="material-symbols-outlined ml-auto text-red-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`rounded-2xl p-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`font-bold mb-1.5 text-sm ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
              {isCorrect ? '✓ 정답!' : '✗ 오답'}
            </p>
            {!isCorrect && (
              <p className="text-gray-700 text-xs mb-1">
                정답: <span className="text-green-600 font-bold">{question.correct_answer}</span>
              </p>
            )}
            {question.explanation && (
              <p className="text-gray-600 text-xs leading-relaxed mt-1">{question.explanation}</p>
            )}
          </div>
        )}

        <div className="flex-1" />

        {/* Next button */}
        {showExplanation && (
          <button
            onClick={handleNext}
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-colors text-sm shadow-lg shadow-primary/20"
          >
            {submitting ? '제출 중...' : isLast ? '결과 보기 →' : '다음 문제 →'}
          </button>
        )}
      </div>
    </div>
  );
};
