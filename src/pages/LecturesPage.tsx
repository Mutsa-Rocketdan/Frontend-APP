import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LECTURES, WEEKS } from '../data/curriculum';
import { BottomNav } from '../components/BottomNav';
import { LikelionLogo } from '../components/LikelionLogo';

const SUBJECT_SHORT: Record<string, string> = {
  '객체지향 프로그래밍': 'OOP',
  'Front-End Programming': 'Frontend',
  'Back-End Programming': 'Backend',
};

// Group lectures by week
const groupByWeek = () => {
  const map: Record<number, typeof LECTURES> = {};
  for (const lec of LECTURES) {
    if (!map[lec.week]) map[lec.week] = [];
    map[lec.week].push(lec);
  }
  return map;
};

export const LecturesPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.nickname || user?.email?.split('@')[0] || '학습자';

  const handleLogout = () => { logout(); navigate('/login'); };

  const byWeek = groupByWeek();
  const weeks = Object.keys(byWeek).map(Number).sort((a, b) => a - b);

  return (
    <div className="app-container bg-white min-h-screen flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 flex items-center bg-white px-5 py-4 justify-between border-b border-[#E5E3DE]">
        <div className="flex items-center gap-2.5">
          <LikelionLogo size="sm" iconOnly className="h-7 w-auto" />
          <span className="text-[#0D0D0D] text-base font-bold tracking-tight">멋쟁이사자처럼</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-slate-600 text-[22px]">search</span>
          </button>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-slate-600 text-[22px]">logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 pb-28">
        {/* Hero strip */}
        <div className="px-5 pt-6 pb-5 border-b border-[#E5E3DE]">
          <h2 className="text-2xl font-black tracking-tight text-[#0D0D0D]">안녕하세요, {displayName}님</h2>

          {/* Stats row */}
          <div className="flex items-center gap-0 mt-5">
            {[
              { label: '전체 강의', val: LECTURES.length, accent: true },
              { label: '학습 주차', val: WEEKS.length, accent: false },
              { label: '출석 일수', val: 28, accent: false },
              { label: 'AI 생성', val: '∞', accent: false },
            ].map((s, i, arr) => (
              <div key={i} className={`flex-1 text-center ${i < arr.length - 1 ? 'border-r border-[#E5E3DE]' : ''}`}>
                <p className={`text-2xl font-black leading-tight ${s.accent ? 'text-primary' : 'text-[#0D0D0D]'}`}>{s.val}</p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lecture list by week */}
        <div className="pt-2">
          {weeks.map((week) => {
            const lectures = byWeek[week];
            return (
              <div key={week}>
                {/* Week section header */}
                <div className="px-5 pt-5 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    WEEK {String(week).padStart(2, '0')}
                  </span>
                </div>

                {/* Lecture rows */}
                {lectures.map((lecture, li) => (
                  <div
                    key={lecture.id}
                    onClick={() => navigate(`/lectures/${lecture.id}`)}
                    className={`flex items-center gap-4 px-5 py-4 cursor-pointer active:bg-slate-50 transition-colors ${li < lectures.length - 1 ? 'border-b border-[#E5E3DE]' : ''}`}
                  >
                    {/* Left: week number */}
                    <div className="w-10 h-10 rounded-lg bg-[#F5F4F1] flex items-center justify-center shrink-0">
                      <span className="text-xs font-black text-primary">{String(week).padStart(2, '0')}</span>
                    </div>

                    {/* Center: info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                          {SUBJECT_SHORT[lecture.subject] ?? lecture.subject}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0D0D0D] leading-snug truncate">{lecture.topic}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{lecture.date}</p>
                    </div>

                    {/* Right: chevron */}
                    <span className="material-symbols-outlined text-slate-300 text-[20px] shrink-0">chevron_right</span>
                  </div>
                ))}

                {/* Bottom border after last item in week group */}
                <div className="border-b border-[#E5E3DE]" />
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
};
