import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LECTURES, WEEKS } from "../data/curriculum";
import { BottomNav } from "../components/BottomNav";
import { LikelionLogo } from "../components/LikelionLogo";

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
  const displayName = user?.nickname || user?.email?.split("@")[0] || "학습자";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const currentWeek = 2;
  const totalWeeks = WEEKS.length;
  const completedLectures = LECTURES.filter((l) => l.week < currentWeek).length;
  const progress = Math.round((currentWeek / totalWeeks) * 100);

  const byWeek = groupByWeek();
  const weeks = Object.keys(byWeek)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="app-container min-h-screen flex flex-col relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,115,0,0.13) 0%, rgba(255,150,50,0.06) 45%, transparent 72%)', filter: 'blur(55px)', animation: 'orb-drift-a 14s ease-in-out infinite' }} />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-32 w-[380px] h-[380px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,100,0,0.08) 0%, rgba(255,140,40,0.03) 50%, transparent 75%)', filter: 'blur(50px)', animation: 'orb-drift-b 20s ease-in-out infinite' }} />
      {/* Top bar — 로고 중앙, 나가기 우측 */}
      <div className="relative px-5 pt-12 pb-3 flex items-center justify-center anim-enter">
        <div className="flex items-center gap-2.5">
          <LikelionLogo size="sm" iconOnly className="!h-[34px]" />
          <div className="flex flex-col justify-center gap-[3px]">
            <span className="text-[#FF6A00] font-bold text-[15px] tracking-[-0.01em] leading-none">
              멋쟁이사자처럼
            </span>
            <span
              className="text-[#C0B5AD] leading-none"
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontWeight: 400,
                fontSize: "10px",
                letterSpacing: "0.12em",
              }}
            >
              AI 복습 서비스
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="absolute right-4 top-12 w-9 h-9 flex items-center justify-center text-[#B0A498] hover:text-[#2C2018] transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
        </button>
      </div>

      {/* Greeting */}
      <div className="px-5 pt-5 pb-1 border-b border-[#E9E1D6] anim-enter-1">
        {/* 사자 + 인사 가로 배치 */}
        <div
          className="flex items-center gap-4 mb-5"
          style={{ marginTop: "2px" }}
        >
          <img
            src="/lion3.png"
            alt=""
            aria-hidden
            className="pointer-events-none select-none shrink-0 h-[68px] w-auto object-contain ml-5"
            style={{ opacity: 0.45, filter: "saturate(1.0)" }}
          />
          <h2 className="flex-1 flex items-center justify-end gap-1">
            <span
              className="text-[16px] font-medium"
              style={{ color: "#4A1208" }}
            >
              반가워요,
            </span>
            <span
              className="text-[20px] font-semibold tracking-[-0.02em]"
              style={{ color: "#4A1208" }}
            >
              {displayName}님
            </span>
            <svg
              width="23"
              height="34"
              viewBox="0 0 25 35"
              fill="none"
              aria-hidden
              className="shrink-0"
            >
              {/* 큰 별 — 위 중앙 */}
              <path
                className="star-a"
                d="M13 1L14.6 6L20 7.5L14.6 9L13 14L11.4 9L6 7.5L11.4 6Z"
                fill="#FFB020"
                opacity="0.95"
              />
              {/* 중간 별 — 바로 아래 오른쪽 */}
              <path
                className="star-b"
                d="M20 16L21 19.5L24.5 20L21 20.5L20 24L19 20.5L15.5 20L19 19.5Z"
                fill="#FF8C3A"
                opacity="0.88"
              />
              {/* 작은 별 — 아래 왼쪽 */}
              <path
                className="star-c"
                d="M7 22L7.8 24.8L10.5 25L7.8 25.2L7 28L6.2 25.2L3.5 25L6.2 24.8Z"
                fill="#FFD060"
                opacity="0.80"
              />
              {/* 점들 */}
              <circle
                className="star-d"
                cx="20"
                cy="7"
                r="1.8"
                fill="#FFDD80"
                opacity="0.65"
              />
              <circle
                className="star-e"
                cx="5"
                cy="14"
                r="1.2"
                fill="#FF9A40"
                opacity="0.55"
              />
            </svg>
          </h2>
        </div>

        {/* Stats row */}
        <div className="flex gap-0 divide-x divide-[#E9E1D6]">
          {[
            {
              label: "진행 주차",
              value: `${currentWeek}주`,
              valueClass: "text-[#FF6A00]",
            },
            {
              label: "완료 강의",
              value: `${completedLectures}개`,
              valueClass: "text-[#2C2018]",
            },
            {
              label: "전체 주차",
              value: `${totalWeeks}주`,
              valueClass: "text-[#2C2018]",
            },
          ].map((s) => (
            <div key={s.label} className="flex-1 text-center px-4 py-3">
              <p
                className={`text-[18px] font-bold tracking-[-0.02em] ${s.valueClass}`}
              >
                {s.value}
              </p>
              <p className="text-[10px] text-[#B0A498] uppercase tracking-widest mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 py-3.5 border-b border-[#E9E1D6] anim-enter-2">
        <div className="flex justify-between mb-1.5">
          <span className="text-[12px] font-normal text-[#B0A498]">
            전체 학습 진행률
          </span>
          <span className="text-[#FF6A00] font-semibold text-[12px]">
            {progress}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[#EDE6DC] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, #FFAA5C 0%, #FF6A00 60%, #E05000 100%)",
            }}
          />
        </div>
      </div>

      {/* Lecture list */}
      <div className="px-4 pt-4 pb-28 space-y-5 anim-enter-3">
        {weeks.map((week) => {
          const weekLectures = byWeek[week];
          const isLocked = week > currentWeek;
          const isCurrent = week === currentWeek;
          const isCompleted = week < currentWeek;

          return (
            <div key={week}>
              {/* Week header */}
              <div className="flex items-center gap-2 mb-2.5 px-1">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${isLocked ? "text-[#CFC8C0]" : "text-[#FF6A00]"}`}
                >
                  Week {String(week).padStart(2, "0")}
                </span>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#FFF0E6] text-[#FF6A00] px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse inline-block" />
                    진행중
                  </span>
                )}
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-[#F2EDE7] text-[#A39586] px-2 py-0.5 rounded-full">
                    <span
                      className="material-symbols-outlined text-[10px] leading-none"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check
                    </span>
                    완료
                  </span>
                )}
                {isLocked && <span className="w-px h-3 bg-[#E9E1D6] mx-0.5" />}
              </div>

              {/* Lecture card */}
              <div
                className={`bg-white rounded-2xl border overflow-hidden transition-shadow duration-200 ${
                  isCurrent
                    ? "border-[#F5C99A] shadow-[0_2px_12px_rgba(255,106,0,0.08)]"
                    : "border-[#E9E1D6] shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                }`}
              >
                {weekLectures.map((lec, i) => (
                  <button
                    key={lec.id}
                    onClick={() => !isLocked && navigate(`/lectures/${lec.id}`)}
                    className={`group w-full flex items-center gap-3.5 px-4 py-2.5 text-left transition-all duration-150 ${
                      i < weekLectures.length - 1
                        ? "border-b border-[#F4EDE5]"
                        : ""
                    } ${isLocked ? "cursor-default opacity-60" : "hover:bg-[#FFF8F3] active:bg-[#FFF0E6]"}`}
                  >
                    {/* Icon box */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-150 ${
                        isLocked
                          ? "bg-[#F4EDE5]"
                          : isCompleted
                            ? "bg-[#FFF0E6] group-hover:bg-[#FFE8D6]"
                            : "bg-[#FFF4EA] group-hover:bg-[#FFE8D6]"
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[19px]"
                        style={{
                          fontVariationSettings: isCompleted
                            ? "'FILL' 1"
                            : "'FILL' 0",
                          color: isLocked ? "#C8BFB6" : "#FF6A00",
                        }}
                      >
                        {isLocked
                          ? "lock"
                          : isCompleted
                            ? "check_circle"
                            : "play_circle"}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[13.5px] font-medium leading-[1.45] truncate ${isLocked ? "text-[#C4B8AA]" : "text-[#171717]"}`}
                      >
                        {lec.topic}
                      </p>
                      <p className="text-[10.4px] font-normal text-[#B8AFA8] mt-[1px]">
                        {lec.subject} · {lec.date}
                      </p>
                    </div>

                    {/* Chevron */}
                    {!isLocked && (
                      <span className="material-symbols-outlined text-[20px] transition-all duration-150 text-[#DDD5C8] group-hover:text-[#FF6A00] group-hover:translate-x-0.5">
                        chevron_right
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav active="home" />
    </div>
  );
};
