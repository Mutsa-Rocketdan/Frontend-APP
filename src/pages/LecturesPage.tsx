import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LECTURES, WEEKS } from '../data/curriculum';

const WEEK_LABELS = ['', '1주차', '2주차', '3주차'];
const SUBJECT_COLORS: Record<string, string> = {
  '객체지향 프로그래밍': 'bg-purple-100 text-purple-600',
  'Front-End Programming': 'bg-blue-100 text-blue-600',
  'Back-End Programming': 'bg-green-100 text-green-600',
};
const subjectColor = (s: string) => SUBJECT_COLORS[s] || 'bg-gray-100 text-gray-500';

export const LecturesPage = () => {
  const { user } = useAuth();
  const displayName = user?.nickname || user?.email?.split('@')[0] || '학습자';
  const totalLectures = LECTURES.length;

  return (
    <div className="app-container bg-bg-light min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <span className="text-primary font-bold text-base tracking-tight">멋쟁이사자처럼</span>
          </div>
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-bg-light">
            <span className="material-symbols-outlined text-gray-500 text-[22px]">notifications</span>
          </button>
        </div>

        <p className="text-gray-400 text-sm">안녕하세요,</p>
        <h1 className="text-xl font-bold text-gray-900 mt-0.5">{displayName}님 👋</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-primary-light rounded-2xl p-3.5 text-center">
            <p className="text-2xl font-bold text-primary">{totalLectures}</p>
            <p className="text-xs text-primary/70 mt-0.5 font-medium">전체 강의</p>
          </div>
          <div className="bg-bg-light rounded-2xl p-3.5 text-center">
            <p className="text-2xl font-bold text-gray-700">3</p>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">학습 주차</p>
          </div>
          <div className="bg-bg-light rounded-2xl p-3.5 text-center">
            <p className="text-2xl font-bold text-gray-700">AI</p>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">자동 생성</p>
          </div>
        </div>
      </div>

      {/* Lecture list by week */}
      <div className="px-5 pt-5 flex flex-col gap-6">
        {WEEKS.map((week) => {
          const weekLectures = LECTURES.filter((l) => l.week === week);
          return (
            <div key={week}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">{week}W</span>
                </div>
                <h2 className="text-sm font-bold text-gray-700">{WEEK_LABELS[week]}</h2>
                <span className="text-xs text-gray-300">· {weekLectures.length}강</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {weekLectures.map((lecture, idx) => (
                  <Link
                    key={lecture.id}
                    to={`/lectures/${lecture.id}`}
                    className="bg-white rounded-2xl p-4 flex items-center gap-3.5 active:scale-[0.98] transition-transform shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-bg-light flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-gray-400">{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1 ${subjectColor(lecture.subject)}`}>
                        {lecture.subject === 'Front-End Programming' ? 'Frontend' :
                         lecture.subject === 'Back-End Programming' ? 'Backend' : 'OOP'}
                      </span>
                      <p className="text-sm font-semibold text-gray-900 leading-snug truncate">{lecture.topic}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{lecture.date}</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-300 text-[20px] shrink-0">chevron_right</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
