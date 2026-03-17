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
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400">퀴즈 문항이 없습니다.</p>
          <button onClick={() => navigate('/lectures')} className="mt-4 text-orange-500 text-sm">
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

  const handleSelect = (opt: string) => {
    if (showExplanation) return;
    setSelected(opt);
    setShowExplanation(true);
    const newAnswers = [...answers];
    newAnswers[currentIdx] = opt;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLast) {
      handleSubmit();
    } else {
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
      await submitQuizResult(id, { score, user_answers: answers });
      navigate('/quiz-results');
    } finally {
      setSubmitting(false);
    }
  };

  const optionLabel = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-500 text-sm">{quiz.title}</span>
            <span className="text-orange-500 text-sm font-semibold">{currentIdx + 1} / {total}</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5">
            <div
              className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-6">
          <p className="text-zinc-400 text-xs mb-3">문제 {currentIdx + 1}</p>
          <h2 className="text-white text-lg font-medium leading-relaxed">{question.question_text}</h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((opt, i) => {
            let style = 'border-zinc-700 text-zinc-300 hover:border-orange-500/50';
            if (showExplanation) {
              if (opt === question.correct_answer) {
                style = 'border-green-500 bg-green-500/10 text-green-400';
              } else if (opt === selected && !isCorrect) {
                style = 'border-red-500 bg-red-500/10 text-red-400';
              } else {
                style = 'border-zinc-800 text-zinc-600';
              }
            } else if (opt === selected) {
              style = 'border-orange-500 bg-orange-500/10 text-orange-400';
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`w-full text-left border rounded-xl px-5 py-4 text-sm transition-all flex items-center gap-3 ${style}`}
              >
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                  {optionLabel[i]}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`rounded-xl p-5 mb-6 ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
            <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✓ 정답!' : '✗ 오답'}
            </p>
            {!isCorrect && (
              <p className="text-zinc-300 text-sm mb-2">
                정답: <span className="text-green-400 font-medium">{question.correct_answer}</span>
              </p>
            )}
            {question.explanation && (
              <p className="text-zinc-400 text-sm leading-relaxed">{question.explanation}</p>
            )}
          </div>
        )}

        {/* Next Button */}
        {showExplanation && (
          <button
            onClick={handleNext}
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold py-4 rounded-xl transition-colors"
          >
            {submitting ? '제출 중...' : isLast ? '결과 보기' : '다음 문제 →'}
          </button>
        )}
      </div>
    </div>
  );
};
