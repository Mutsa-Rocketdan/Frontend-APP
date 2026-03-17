import { useNavigate } from 'react-router-dom';
import { LECTURES, WEEKS } from '../data/curriculum';
import { BottomNav } from '../components/BottomNav';

export const CurriculumPage = () => {
  const navigate = useNavigate();
  const currentWeek = 2; // mock: 현재 진행 주차
  const total = WEEKS.length;
  const progress = Math.round((currentWeek / total) * 100);

  return (
    <div className="app-container bg-white min-h-screen flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center bg-white px-4 py-3 justify-between border-b border-[#E5E3DE]">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 flex items-center text-[#0D0D0D]"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <h2 className="text-base font-bold text-[#0D0D0D] flex-1 text-center">주차별 학습 모듈</h2>
        <div className="w-11 flex justify-end">
          <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-slate-600 text-[22px]">notifications</span>
          </button>
        </div>
      </div>

      <div className="flex-1 px-5 py-5 pb-28 space-y-5">
        {/* Progress stat pills */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E3DE] bg-[#F5F4F1]">
            <span className="text-primary text-2xl font-black">{String(currentWeek).padStart(2, '0')}</span>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">진행 주차</span>
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E3DE] bg-[#F5F4F1]">
            <span className="text-[#0D0D0D] text-2xl font-black">{String(total).padStart(2, '0')}</span>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">전체 주차</span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-[#0D0D0D]">전체 학습 진행률</p>
            <p className="text-primary font-bold text-sm">{progress}%</p>
          </div>
          <div className="h-2 rounded-full bg-[#F5F4F1] overflow-hidden border border-[#E5E3DE]">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Timeline roadmap */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">커리큘럼 로드맵</h3>
          <div className="space-y-0">
            {WEEKS.map((week, wi) => {
              const weekLectures = LECTURES.filter((l) => l.week === week);
              const isCompleted = week < currentWeek;
              const isCurrent = week === currentWeek;
              const isLocked = week > currentWeek;

              return (
                <div key={week} className="relative flex gap-4">
                  {/* Timeline column */}
                  <div className="flex flex-col items-center w-10 shrink-0">
                    {/* Circle */}
                    {isCompleted && (
                      <div className="z-10 w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      </div>
                    )}
                    {isCurrent && (
                      <div className="z-10 w-10 h-10 rounded-full border-2 border-primary bg-white flex items-center justify-center shrink-0 relative">
                        <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                        <span className="text-primary font-black text-sm">{String(week).padStart(2, '0')}</span>
                      </div>
                    )}
                    {isLocked && (
                      <div className="z-10 w-10 h-10 rounded-full bg-[#F5F4F1] border border-[#E5E3DE] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-slate-400 text-[16px]">lock</span>
                      </div>
                    )}
                    {/* Connector line */}
                    {wi < WEEKS.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[1.5rem] my-1 ${isCompleted ? 'bg-primary/40' : 'bg-[#E5E3DE]'}`} />
                    )}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 mb-4 rounded-xl border-2 p-4 transition-all ${
                    isCurrent
                      ? 'border-primary bg-white shadow-sm'
                      : isCompleted
                      ? 'border-[#E5E3DE] bg-white'
                      : 'border-[#E5E3DE] bg-[#F5F4F1]'
                  } ${isLocked ? 'opacity-60' : ''}`}>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Week {String(week).padStart(2, '0')}</span>
                    <h4 className={`font-bold mt-0.5 leading-snug ${isLocked ? 'text-slate-400' : 'text-[#0D0D0D]'}`}>
                      {weekLectures[0]?.subject ?? `${week}주차 학습`}
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">
                      {isCompleted ? '완료' : isCurrent ? '진행 중' : '잠금'} · {weekLectures.length}강의
                    </p>

                    {/* Lecture list */}
                    {!isLocked && (
                      <div className="mt-3 space-y-1">
                        {weekLectures.map((lec) => (
                          <button
                            key={lec.id}
                            onClick={() => navigate(`/lectures/${lec.id}`)}
                            className="w-full text-left flex items-center gap-2 py-1.5"
                          >
                            <span className={`material-symbols-outlined text-[14px] ${isCompleted ? 'text-primary' : 'text-slate-300'}`}
                              style={{ fontVariationSettings: isCompleted ? "'FILL' 1" : "'FILL' 0" }}>
                              {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            <span className="text-xs font-medium text-slate-600 truncate">{lec.topic}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {isCurrent && (
                      <button
                        onClick={() => navigate(`/lectures/${weekLectures[0]?.id}`)}
                        className="mt-4 w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg"
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
