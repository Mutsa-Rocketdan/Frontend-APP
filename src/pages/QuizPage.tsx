import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuizResult } from '../api/quizzes';
import type { QuizResponse, QuizQuestionResponse } from '../types';

// 백엔드 없을 때 보여줄 mock 퀴즈
const MOCK_QUIZ: QuizResponse = {
  id: 'mock', lecture_id: 'mock', user_id: 'mock',
  title: '데코레이터·옵저버 패턴 복습 퀴즈',
  created_at: new Date().toISOString(),
  questions: [
    {
      id: 1, quiz_id: 'mock',
      question_text: '데코레이터 패턴의 주요 목적은 무엇인가요?',
      options: ['객체 생성을 단순화한다', '기존 객체에 동적으로 새로운 기능을 추가한다', '복잡한 서브시스템을 단순한 인터페이스로 감싼다', '알고리즘을 캡슐화하여 교체 가능하게 한다'],
      correct_answer: '기존 객체에 동적으로 새로운 기능을 추가한다',
      explanation: '데코레이터 패턴은 상속 대신 합성을 사용하여 런타임에 객체에 새로운 책임을 동적으로 추가합니다.',
    },
    {
      id: 2, quiz_id: 'mock',
      question_text: '옵저버 패턴에서 상태 변화를 통보받는 객체를 무엇이라고 하나요?',
      options: ['Subject', 'Observer', 'Publisher', 'Decorator'],
      correct_answer: 'Observer',
      explanation: '옵저버 패턴에서 Subject(발행자)가 상태 변화 시 Observer(구독자)들에게 알림을 보냅니다.',
    },
    {
      id: 3, quiz_id: 'mock',
      question_text: '파사드 패턴의 가장 큰 장점은 무엇인가요?',
      options: ['성능이 향상된다', '클라이언트와 서브시스템 간의 결합도를 낮춘다', '메모리 사용량이 줄어든다', '코드 재사용성이 증가한다'],
      correct_answer: '클라이언트와 서브시스템 간의 결합도를 낮춘다',
      explanation: '파사드는 복잡한 서브시스템에 단순화된 인터페이스를 제공하여 클라이언트 코드를 단순화합니다.',
    },
  ],
};

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
    if (id === 'mock') {
      setQuiz(MOCK_QUIZ);
      setAnswers(new Array(MOCK_QUIZ.questions.length).fill(''));
      setLoading(false);
      return;
    }
    getQuiz(id)
      .then((res) => {
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(''));
      })
      .catch(() => {
        setQuiz(MOCK_QUIZ);
        setAnswers(new Array(MOCK_QUIZ.questions.length).fill(''));
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">퀴즈 문항이 없습니다.</p>
          <button onClick={() => navigate('/')} className="mt-4 text-[#FF6B00] text-sm font-medium">
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
      if (id !== 'mock') await submitQuizResult(id, { score, user_answers: answers });
    } finally {
      navigate('/quiz-results', { state: { score, total, correctCount } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium truncate">{quiz.title}</span>
            <span className="text-[#FF6B00] text-sm font-bold shrink-0 ml-2">{currentIdx + 1} / {total}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-[#FF6B00] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Question */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 mb-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-2 font-medium">문제 {currentIdx + 1}</p>
          <h2 className="text-gray-900 text-base md:text-lg font-semibold leading-relaxed">
            {question.question_text}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-2.5 mb-4">
          {question.options.map((opt, i) => {
            let cls = 'border-gray-200 text-gray-700 hover:border-[#FF6B00] hover:bg-orange-50';
            if (showExplanation) {
              if (opt === question.correct_answer) cls = 'border-green-500 bg-green-50 text-green-700';
              else if (opt === selected) cls = 'border-red-400 bg-red-50 text-red-600';
              else cls = 'border-gray-100 text-gray-400';
            } else if (opt === selected) {
              cls = 'border-[#FF6B00] bg-orange-50 text-[#FF6B00]';
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`w-full text-left border-2 rounded-xl px-4 py-3.5 text-sm transition-all flex items-center gap-3 bg-white ${cls}`}
              >
                <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold shrink-0">
                  {optionLabel[i]}
                </span>
                <span className="leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`rounded-xl p-4 mb-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`font-bold mb-1.5 ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
              {isCorrect ? '✓ 정답!' : '✗ 오답'}
            </p>
            {!isCorrect && (
              <p className="text-gray-700 text-sm mb-1">
                정답: <span className="text-green-600 font-semibold">{question.correct_answer}</span>
              </p>
            )}
            {question.explanation && (
              <p className="text-gray-600 text-sm leading-relaxed">{question.explanation}</p>
            )}
          </div>
        )}

        {showExplanation && (
          <button
            onClick={handleNext}
            disabled={submitting}
            className="w-full bg-[#FF6B00] hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 rounded-xl transition-colors"
          >
            {submitting ? '제출 중...' : isLast ? '결과 보기 →' : '다음 문제 →'}
          </button>
        )}
      </div>
    </div>
  );
};
