import { useParams, useNavigate } from 'react-router-dom';
import { getLectureById } from '../data/curriculum';
import { getMockStudyGuideByLectureId } from '../data/mockContent';
import { BottomNav } from '../components/BottomNav';
import { LikelionLogo } from '../components/LikelionLogo';

export const StudyGuidePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lecture = getLectureById(id ?? '');
  const guide = getMockStudyGuideByLectureId(id ?? '');

  return (
    <div className="app-container bg-white min-h-screen flex flex-col">
      {/* Dark hero header */}
      <header className="bg-[#23170f] px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center text-white/70 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <LikelionLogo size="sm" iconOnly className="opacity-80" />
          <button className="w-10 h-10 flex items-center justify-end text-white/70 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[22px]">share</span>
          </button>
        </div>

        {/* AI tag */}
        <div className="mb-3">
          <span className="text-[10px] font-bold text-primary bg-primary/20 px-2.5 py-1 rounded uppercase tracking-widest">
            AI 학습 가이드
          </span>
        </div>

        {/* Title */}
        <h1 className="text-white text-2xl font-black leading-snug">
          {lecture?.topic ?? '학습 가이드'}
        </h1>
        {lecture && (
          <p className="text-white/40 text-xs mt-2">{lecture.date} · {lecture.instructor}</p>
        )}
      </header>

      <div className="flex-1 pb-28">
        <main className="divide-y divide-[#E5E3DE]">
          {/* 핵심 요약 */}
          <section className="px-5 pt-6 pb-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">핵심 요약</h3>
            <div className="space-y-0">
              {guide.keyPoints.map((point, i) => (
                <div key={i} className={`flex gap-4 py-3 ${i < guide.keyPoints.length - 1 ? 'border-b border-[#E5E3DE]' : ''}`}>
                  <span className="text-primary font-black text-sm shrink-0 w-6">{String(i + 1).padStart(2, '0')}.</span>
                  <p className="text-sm text-slate-600 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 강의 요약 */}
          <section className="px-5 pt-6 pb-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>summarize</span>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">강의 요약</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{guide.summary}</p>
          </section>

          {/* 복습 체크리스트 */}
          <section className="px-5 pt-6 pb-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>checklist</span>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">복습 체크리스트</h3>
            </div>
            <div className="space-y-0">
              {guide.reviewPoints.map((pt, i) => (
                <label key={i} className={`flex items-start gap-3 cursor-pointer py-3 ${i < guide.reviewPoints.length - 1 ? 'border-b border-[#E5E3DE]' : ''}`}>
                  <input
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <p className="text-sm text-slate-600 leading-relaxed">{pt}</p>
                </label>
              ))}
            </div>
          </section>

          {/* 개념 맵 */}
          <section className="px-5 pt-6 pb-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">개념 맵</h3>
            </div>
            <div className="space-y-5">
              {guide.conceptMap.map((item, i) => (
                <div key={i}>
                  <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-lg mb-2.5">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                    <span className="text-sm font-bold">{item.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-1">
                    {item.related.map((r, j) => (
                      <span key={j} className="text-xs bg-[#F5F4F1] border border-[#E5E3DE] text-slate-600 px-2.5 py-1 rounded-lg">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <BottomNav active="study" />
    </div>
  );
};
