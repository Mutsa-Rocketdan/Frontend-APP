import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLectureById, getGuide } from "../api/lectures";
import { BottomNav } from "../components/BottomNav";
import { LikelionLogo } from "../components/LikelionLogo";
import type { LectureResponse, GuideResponse } from "../types";

export const StudyGuidePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<LectureResponse | null>(null);
  const [guide, setGuide] = useState<GuideResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getLectureById(id).then((r) => setLecture(r.data)).catch(() => {}),
      getGuide(id).then((r) => setGuide(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="app-container min-h-screen flex flex-col">
      {/* Dark gradient header */}
      <header className="px-5 pt-14 pb-8" style={{ background: 'linear-gradient(135deg, #2E1A08 0%, #1A0D04 40%, #0D0906 100%)' }}>
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <LikelionLogo size="md" iconOnly variant="white" className="opacity-50" />
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#FF6A00] bg-[#FF6A00]/20 px-3 py-1.5 rounded-lg uppercase tracking-widest mb-3">
          <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          AI 학습 가이드
        </span>
        <h1 className="text-[28px] font-bold leading-[1.3] tracking-[-0.02em] text-white">
          {lecture?.title ?? "학습 가이드"}
        </h1>
        {lecture && (lecture.date || lecture.instructor) && (
          <p className="text-white/35 text-[12px] mt-2">
            {[lecture.date, lecture.instructor].filter(Boolean).join(' · ')}
          </p>
        )}
      </header>

      <div className="flex-1 pb-28 px-4 pt-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !guide ? (
          <div className="bg-white rounded-xl border border-[#E9E1D6] p-8 text-center">
            <span className="material-symbols-outlined text-[#DDD5C8] text-[56px]" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
            <p className="text-[14px] font-medium text-[#6F6A64] mt-3">학습 가이드가 아직 없어요</p>
            <p className="text-[12px] text-[#A39586] mt-1">AI 분석이 완료되면 가이드가 생성됩니다</p>
          </div>
        ) : (
          <>
            {/* 핵심 요약 key_points */}
            {guide.key_points && guide.key_points.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E9E1D6] shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9894] mb-3">핵심 요약</p>
                <div className="space-y-0">
                  {guide.key_points.map((point, i) => (
                    <div key={i} className={`flex gap-4 py-3 ${i < guide.key_points!.length - 1 ? "border-b border-[#E9E1D6]" : ""}`}>
                      <span className="text-[#FF6A00] font-bold text-[14px] shrink-0 w-6">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      <p className="text-[14px] text-[#6F6A64] leading-[1.65]">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 강의 요약 content */}
            {guide.content && (
              <div className="bg-white rounded-xl border border-[#E9E1D6] shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#FF6A00] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    summarize
                  </span>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9C9894]">강의 요약</p>
                </div>
                <p className="text-[14px] text-[#6F6A64] leading-[1.65] whitespace-pre-wrap">{guide.content}</p>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav active="study" />
    </div>
  );
};
