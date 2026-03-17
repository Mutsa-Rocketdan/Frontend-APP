import { useNavigate } from 'react-router-dom';
import { LECTURES, WEEKS, getSubjectStyle } from '../data/curriculum';

export const LecturesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200 px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-orange-500 text-sm font-semibold mb-2">KDT Backend 21기</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            AI 복습 퀴즈 & 학습 가이드
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            강의를 선택하면 AI가 핵심 개념 추출 · 퀴즈 · 학습 가이드를 자동으로 생성합니다
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        {WEEKS.map((week) => {
          const weekLectures = LECTURES.filter((l) => l.week === week);
          return (
            <div key={week} className="mb-8 md:mb-12">
              {/* Week Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {week}주차
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Lecture Cards */}
              <div className="grid gap-3">
                {weekLectures.map((lecture, idx) => (
                  <button
                    key={lecture.id}
                    onClick={() => navigate(`/lectures/${lecture.id}`)}
                    className="w-full text-left bg-white border border-gray-200 hover:border-orange-400 hover:shadow-md rounded-xl p-4 md:p-5 transition-all group"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      {/* Day number */}
                      <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-100 group-hover:bg-orange-50 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-500 group-hover:text-orange-500">
                          {(week - 1) * 5 + idx + 1}일
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded border ${getSubjectStyle(lecture.subject)}`}>
                            {lecture.subject}
                          </span>
                          <span className="text-xs text-gray-400">{lecture.date}</span>
                        </div>
                        <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                          {lecture.topic}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-1 hidden md:block">
                          {lecture.learning_goal}
                        </p>
                      </div>

                      {/* Arrow */}
                      <span className="shrink-0 text-gray-300 group-hover:text-orange-400 text-lg transition-colors">
                        →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
