import { useParams, useNavigate } from "react-router-dom";
import { getLectureById } from "../data/curriculum";
import { getMockStudyGuideByLectureId } from "../data/mockContent";
import { BottomNav } from "../components/BottomNav";
import { LikelionLogo } from "../components/LikelionLogo";

export const StudyGuidePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lecture = getLectureById(id ?? "");
  const guide = getMockStudyGuideByLectureId(id ?? "");

  return (
    <div className="app-container min-h-screen flex flex-col">
      {/* Dark gradient header */}
      <header className="px-5 pt-14 pb-8" style={{ background: 'linear-gradient(135deg, #2E1A08 0%, #1A0D04 40%, #0D0906 100%)' }}>
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
          </button>
          <LikelionLogo
            size="md"
            iconOnly
            variant="white"
            className="opacity-50"
          />
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#FF6A00] bg-[#FF6A00]/20 px-3 py-1.5 rounded-lg uppercase tracking-widest mb-3">
          <span
            className="material-symbols-outlined text-[12px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
          AI 학습 가이드
        </span>
        <h1 className="text-[28px] font-bold leading-[1.3] tracking-[-0.02em] text-white">
          {lecture?.topic ?? "학습 가이드"}
        </h1>
        {lecture && (
          <p className="text-white/35 text-[12px] mt-2">
            {lecture.date} · {lecture.instructor}
          </p>
        )}
      </header>

      <div className="flex-1 pb-28 px-4 pt-4 space-y-4">
        {/* 핵심 요약 */}
        <div className="bg-white rounded-xl border border-[#E9E1D6] shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9894] mb-3">
            핵심 요약
          </p>
          <div className="space-y-0">
            {guide.keyPoints.map((point, i) => (
              <div
                key={i}
                className={`flex gap-4 py-3 ${i < guide.keyPoints.length - 1 ? "border-b border-[#E9E1D6]" : ""}`}
              >
                <span className="text-[#FF6A00] font-bold text-[14px] shrink-0 w-6">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                <p className="text-[14px] text-[#6F6A64] leading-[1.65]">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 강의 요약 */}
        <div className="bg-white rounded-xl border border-[#E9E1D6] shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="material-symbols-outlined text-[#FF6A00] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              summarize
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9894]">
              강의 요약
            </p>
          </div>
          <p className="text-[14px] text-[#6F6A64] leading-[1.65]">
            {guide.summary}
          </p>
        </div>

        {/* 복습 체크리스트 */}
        <div className="bg-white rounded-xl border border-[#E9E1D6] shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="material-symbols-outlined text-[#FF6A00] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              checklist
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9894]">
              복습 체크리스트
            </p>
          </div>
          <div className="space-y-0">
            {guide.reviewPoints.map((pt, i) => (
              <label
                key={i}
                className={`flex items-start gap-3 cursor-pointer py-3 ${i < guide.reviewPoints.length - 1 ? "border-b border-[#E9E1D6]" : ""}`}
              >
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-[#E0DDD8] text-[#FF6A00] focus:ring-[#FF6A00] cursor-pointer accent-[#FF6A00]"
                />
                <p className="text-[14px] text-[#6F6A64] leading-[1.65]">
                  {pt}
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* 개념 맵 */}
        <div className="bg-white rounded-xl border border-[#E9E1D6] shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="material-symbols-outlined text-[#FF6A00] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              hub
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B0A498]">
              개념 맵
            </p>
          </div>
          <div className="space-y-5">
            {guide.conceptMap.map((item, i) => (
              <div key={i}>
                <p className="text-[12px] font-semibold text-[#A09488] uppercase tracking-[0.05em] mb-2">
                  {item.name}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.related.map((r, j) => (
                    <span
                      key={j}
                      className="text-[12px] bg-[#F6F0E8] border border-[#E9E1D6] text-[#6F6A64] px-3 py-1 rounded-lg"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="study" />
    </div>
  );
};
