import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLectures } from '../api/lectures';
import type { LectureResponse } from '../types';
import { BottomNav } from '../components/BottomNav';

export const CurriculumPage = () => {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<LectureResponse[]>([]);

  useEffect(() => {
    getLectures()
      .then((res) => setLectures((res.data as LectureResponse[]).filter((l) => l.is_active !== false)))
      .catch(() => setLectures([]));
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const byWeek = useMemo(() => {
    const map = new Map<number, LectureResponse[]>();
    for (const lec of lectures) {
      // 커리큘럼 화면은 "주차" 단위 UI이므로 week가 없는 강의는 제외
      if (lec.week == null) continue;
      const w = lec.week;
      const arr = map.get(w) ?? [];
      arr.push(lec);
      map.set(w, arr);
    }
    for (const [w, arr] of map.entries()) {
      arr.sort((a, b) => {
        const ad = a.date ? new Date(a.date).getTime() : 0;
        const bd = b.date ? new Date(b.date).getTime() : 0;
        if (ad !== bd) return ad - bd;
        return (a.title ?? '').localeCompare(b.title ?? '');
      });
      map.set(w, arr);
    }
    return map;
  }, [lectures]);

  const weeks = useMemo(() => Array.from(byWeek.keys()).sort((a, b) => a - b), [byWeek]);
  const total = Math.max(weeks.length, 1);

  const isLectureLocked = (lec: LectureResponse) =>
    lec.date ? new Date(lec.date) > today : false;

  const currentWeek = useMemo(() => {
    const unlockedWeeks = weeks.filter((w) => (byWeek.get(w) ?? []).some((lec) => !isLectureLocked(lec)));
    return unlockedWeeks.length ? Math.max(...unlockedWeeks) : (weeks.length ? Math.max(...weeks) : 1);
  }, [weeks, byWeek, today]);

  const progress = Math.round((Math.min(currentWeek, total) / total) * 100);

  return (
    <div className="app-container min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-[#E9E1D6] px-5 pt-14 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center text-[#B0A498]">
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <h2 className="text-[15px] font-semibold text-[#2C2018]">주차별 학습 모듈</h2>
        <div className="w-10" />
      </div>

      {/* Stats row */}
      <div className="px-5 py-4 border-b border-[#E9E1D6] flex divide-x divide-[#E9E1D6] anim-enter">
        {[
          { label: '진행 주차', value: `${currentWeek}주`, valueClass: 'text-[#FF6A00]' },
          { label: '전체 주차', value: `${total}주`, valueClass: 'text-[#2C2018]' },
          { label: '진행률', value: `${progress}%`, valueClass: 'text-[#FF6A00]' },
        ].map((s) => (
          <div key={s.label} className="flex-1 text-center px-4 py-2">
            <p className={`text-[20px] font-bold ${s.valueClass}`}>{s.value}</p>
            <p className="text-[11px] text-[#B0A498] uppercase tracking-wide mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="px-5 py-4 border-b border-[#E9E1D6] anim-enter-1">
        <div className="flex justify-between mb-2">
          <span className="text-[13px] font-semibold text-[#2C2018]">전체 학습 진행률</span>
          <span className="text-[#FF6A00] font-bold text-[13px]">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#E9E1D6] overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #FFAA5C 0%, #FF6A00 60%, #E05000 100%)' }} />
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 pt-4 pb-28 space-y-3 anim-enter-2">
        {weeks.map((week) => {
          const weekLectures = byWeek.get(week) ?? [];
          const isCompleted = week < currentWeek;
          const isCurrent = week === currentWeek;
          const isLocked = week > currentWeek;

          return (
            <div
              key={week}
              className={`bg-white rounded-xl border p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all ${
                isCurrent ? 'border-[#F5C99A]' : 'border-[#E9E1D6]'
              } ${isLocked ? 'opacity-50' : ''}`}
            >
              {/* Week header */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[11px] font-semibold uppercase tracking-[0.06em] ${isLocked ? 'text-[#C4B8AA]' : 'text-[#FF6A00]'}`}>
                  WEEK {String(week).padStart(2, '0')}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-semibold bg-[#FFF4EA] text-[#FF6A00] border border-[#F5C99A] px-2 py-0.5 rounded-full">진행중</span>
                )}
                {isCompleted && (
                  <span className="text-[10px] font-semibold bg-[#FFF4EA] text-[#FF6A00] border border-[#F5C99A] px-2 py-0.5 rounded-full">완료</span>
                )}
                {weekLectures[0] && (
                  <span className="text-[13px] font-semibold text-[#2C2018] ml-auto truncate max-w-[140px]">
                    {weekLectures[0].subject}
                  </span>
                )}
              </div>

              {/* Lectures list */}
              {!isLocked && (
                <div className="space-y-1 pl-1">
                  {weekLectures.map((lec) => (
                    <button
                      key={lec.id}
                      onClick={() => !isLectureLocked(lec) && navigate(`/lectures/${lec.id}`)}
                      className="w-full text-left flex items-center gap-2 py-1.5 hover:opacity-70 transition-opacity"
                    >
                      <span
                        className={`material-symbols-outlined text-[14px] ${isCompleted ? 'text-[#FF6A00]' : 'text-[#C4B8AA]'}`}
                        style={{ fontVariationSettings: isCompleted ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span className="text-[13px] font-medium text-[#4D4840] truncate">{lec.subject && lec.title.startsWith(lec.subject) ? lec.title.slice(lec.subject.length).replace(/^\s*[-–—]\s*/, '') : lec.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* CTA */}
              {isCurrent && (
                <button
                  onClick={() => {
                    const firstUnlocked = weekLectures.find((lec) => !isLectureLocked(lec));
                    if (firstUnlocked) navigate(`/lectures/${firstUnlocked.id}`);
                  }}
                  className="btn-press mt-3 w-full h-10 bg-[#FF6A00] hover:bg-[#E05E00] text-white font-semibold text-[14px] rounded-xl shadow-[0_4px_16px_rgba(255,106,0,0.22)] transition-all flex items-center justify-center gap-2"
                >
                  학습 계속하기
                </button>
              )}
            </div>
          );
        })}
      </div>

      <BottomNav active="study" />
    </div>
  );
};
