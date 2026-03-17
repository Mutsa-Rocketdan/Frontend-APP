import { useParams, useNavigate } from 'react-router-dom';
import { getLectureById } from '../data/curriculum';
import { getMockStudyGuideByLectureId } from '../data/mockContent';

export const StudyGuidePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lecture = getLectureById(id ?? '');
  const guide = getMockStudyGuideByLectureId(id ?? '');

  return (
    <div className="app-container bg-bg-light min-h-screen pb-8">
      {/* Hero header */}
      <div className="bg-bg-dark px-5 pt-12 pb-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors mb-6">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span className="text-sm">뒤로</span>
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold text-primary/80 bg-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wide">
              AI 학습 가이드
            </span>
          </div>
          <h1 className="text-xl font-bold text-white leading-snug">
            {lecture?.topic ?? '학습 가이드'}
          </h1>
          {lecture && (
            <p className="text-white/50 text-xs mt-1.5">{lecture.date} · {lecture.instructor}</p>
          )}
        </div>
      </div>

      <div className="px-4 -mt-3 flex flex-col gap-4 pb-8">
        {/* Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>summarize</span>
            <h2 className="text-sm font-bold text-gray-900">강의 요약</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{guide.summary}</p>
        </div>

        {/* Key points */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <h2 className="text-sm font-bold text-gray-900">핵심 포인트</h2>
          </div>
          <div className="flex flex-col gap-2.5">
            {guide.keyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-primary-light rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[9px] font-bold text-primary">{i + 1}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Review checklist */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-blue-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>checklist</span>
            <h2 className="text-sm font-bold text-gray-900">복습 체크리스트</h2>
          </div>
          <div className="flex flex-col gap-2.5">
            {guide.reviewPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 border-2 border-gray-200 rounded-md shrink-0 mt-0.5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[12px] text-gray-300">check</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Concept map */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-purple-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
            <h2 className="text-sm font-bold text-gray-900">개념 맵</h2>
          </div>
          <div className="flex flex-col gap-4">
            {guide.conceptMap.map((item, i) => (
              <div key={i}>
                <div className="inline-flex items-center gap-1.5 bg-primary-light px-3 py-1.5 rounded-xl mb-2">
                  <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                  <span className="text-sm font-bold text-primary">{item.name}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-2">
                  {item.related.map((r, j) => (
                    <span key={j} className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
