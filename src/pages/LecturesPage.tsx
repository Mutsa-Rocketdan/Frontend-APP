import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LECTURES, WEEKS } from '../data/curriculum';
import { BottomNav } from '../components/BottomNav';

const SUBJECT_SHORT: Record<string, string> = {
  '객체지향 프로그래밍': 'OOP',
  'Front-End Programming': 'Frontend',
  'Back-End Programming': 'Backend',
};

export const LecturesPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.nickname || user?.email?.split('@')[0] || '학습자';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-container bg-bg-light min-h-screen flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 flex items-center bg-bg-light/80 backdrop-blur-md px-5 py-4 justify-between border-b border-primary/10">
        <div className="flex items-center gap-2">
          <div className="bg-primary w-7 h-7 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
          </div>
          <h1 className="text-slate-900 text-lg font-bold tracking-tight">멋쟁이사자처럼</h1>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-slate-600 text-[22px]">search</span>
          </button>
          <button onClick={handleLogout} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-slate-600 text-[22px]">logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 py-7 pb-28 space-y-8">
        {/* Greeting */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">안녕하세요, {displayName}님</h2>
          <p className="text-slate-500 font-medium mt-1">오늘도 성장을 위한 학습을 이어가세요.</p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            {[
              { label: '전체 강의', val: LECTURES.length, highlight: true },
              { label: '학습 주차', val: WEEKS.length },
              { label: '출석 일수', val: 28 },
              { label: 'AI 생성', val: '∞' },
            ].map((s, i) => (
              <div key={i} className={`rounded-xl p-5 border ${s.highlight ? 'bg-primary/5 border-primary/10' : 'bg-white border-slate-100'}`}>
                <p className="text-slate-500 text-xs font-medium">{s.label}</p>
                <p className={`text-3xl font-bold leading-tight mt-1 ${s.highlight ? 'text-primary' : 'text-slate-900'}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lecture list by week */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold tracking-tight text-slate-900">강의 목록</h3>
            <span className="text-xs text-slate-400 font-medium">{LECTURES.length}개 강의</span>
          </div>

          <div className="space-y-3">
            {LECTURES.map((lecture) => (
              <div
                key={lecture.id}
                onClick={() => navigate(`/lectures/${lecture.id}`)}
                className="group flex gap-4 items-center p-4 rounded-xl bg-white border border-slate-100 hover:border-primary/30 transition-all cursor-pointer active:scale-[0.98]"
              >
                {/* Thumb */}
                <div className="w-16 h-14 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-300 text-[28px]">
                    {lecture.subject.includes('Back') ? 'storage' : lecture.subject.includes('Front') ? 'code' : 'auto_awesome'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      Week {String(lecture.week).padStart(2, '0')}
                    </span>
                    <span className="text-slate-400 text-[10px] font-medium">{SUBJECT_SHORT[lecture.subject] ?? lecture.subject}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug truncate">
                    {lecture.topic}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{lecture.date}</p>
                </div>

                <span className="material-symbols-outlined text-slate-300 text-[20px] shrink-0">chevron_right</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav active="home" />
    </div>
  );
};
