import { useNavigate } from 'react-router-dom';
import { LECTURES, WEEKS } from '../data/curriculum';
import { BottomNav } from '../components/BottomNav';

export const CurriculumPage = () => {
  const navigate = useNavigate();
  const currentWeek = 2; // mock: 현재 진행 주차
  const total = WEEKS.length;
  const progress = Math.round((currentWeek / total) * 100);

  return (
    <div className="app-container bg-bg-light min-h-screen flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center bg-bg-light/90 backdrop-blur-md px-4 py-3 justify-between border-b border-primary/10">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 flex items-center text-slate-800"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <h2 className="text-base font-bold text-slate-900 flex-1 text-center">주차별 학습 모듈</h2>
        <div className="w-11 flex justify-end">
          <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-slate-600 text-[22px]">notifications</span>
          </button>
        </div>
      </div>

      <div className="flex-1 px-5 py-5 pb-28 space-y-5">
        {/* Week stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-primary/20 bg-white p-4 text-center">
            <p className="text-primary text-3xl font-bold">{String(currentWeek).padStart(2, '0')}</p>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-0.5">진행 주차</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-4 text-center">
            <p className="text-slate-900 text-3xl font-bold">{String(total).padStart(2, '0')}</p>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-0.5">전체 주차</p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-slate-700">전체 학습 진행률</p>
            <p className="text-primary font-bold text-sm">{progress}%</p>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Roadmap */}
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-4">커리큘럼 로드맵</h3>
          <div className="space-y-0">
            {WEEKS.map((week, wi) => {
              const weekLectures = LECTURES.filter((l) => l.week === week);
              const isCompleted = week < currentWeek;
              const isCurrent = week === currentWeek;
              const isLocked = week > currentWeek;

              return (
                <div key={week} className={`relative flex gap-4 ${isLocked ? 'opacity-50' : ''}`}>
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-primary text-white'
                          : isCurrent
                          ? 'bg-primary text-white ring-4 ring-primary/20'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      ) : isLocked ? (
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                      ) : (
                        String(week).padStart(2, '0')
                      )}
                    </div>
                    {wi < WEEKS.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[2rem] ${isCompleted ? 'bg-primary/40' : 'bg-slate-200'}`} />
                    )}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 mb-4 rounded-xl border-2 p-4 transition-all ${
                    isCurrent
                      ? 'border-primary bg-white shadow-md shadow-primary/10'
                      : isCompleted
                      ? 'border-primary/10 bg-white'
                      : 'border-slate-100 bg-slate-50'
                  }`}>
                    <span className="text-xs font-bold text-primary">Week {String(week).padStart(2, '0')}</span>
                    <h4 className="font-bold text-slate-900 mt-0.5 leading-snug">
                      {weekLectures[0]?.subject ?? `${week}주차 학습`}
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">
                      {isCompleted ? '완료' : isCurrent ? '진행 중' : '잠금'} · {weekLectures.length}강의
                    </p>

                    {/* Lecture list */}
                    {!isLocked && (
                      <div className="mt-3 space-y-1.5">
                        {weekLectures.map((lec) => (
                          <button
                            key={lec.id}
                            onClick={() => navigate(`/lectures/${lec.id}`)}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-primary/5 transition-colors"
                          >
                            <span className={`material-symbols-outlined text-[14px] ${isCompleted ? 'text-primary' : 'text-slate-300'}`}
                              style={{ fontVariationSettings: isCompleted ? "'FILL' 1" : "'FILL' 0" }}>
                              {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            <span className="text-xs font-medium text-slate-700 truncate">{lec.topic}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {isCurrent && (
                      <button
                        onClick={() => navigate(`/lectures/${weekLectures[0]?.id}`)}
                        className="mt-3 w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg"
                      >
                        학습 계속하기
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav active="study" />
    </div>
  );
};
