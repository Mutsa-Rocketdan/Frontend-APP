import { useParams, useNavigate } from 'react-router-dom';
import { getLectureById } from '../data/curriculum';
import { getMockStudyGuideByLectureId } from '../data/mockContent';
import { BottomNav } from '../components/BottomNav';

export const StudyGuidePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lecture = getLectureById(id ?? '');
  const guide = getMockStudyGuideByLectureId(id ?? '');

  return (
    <div className="app-container bg-bg-light min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center bg-bg-light/80 backdrop-blur-md px-4 py-3 border-b border-primary/10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center text-slate-800">
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <h2 className="text-base font-bold text-slate-900 flex-1 text-center">AI 학습 가이드</h2>
        <button className="w-10 h-10 flex items-center justify-end text-slate-500">
          <span className="material-symbols-outlined text-[22px]">share</span>
        </button>
      </nav>

      <div className="flex-1 pb-28">
        {/* Hero */}
        <header className="px-4 py-5">
          <div className="relative overflow-hidden rounded-xl aspect-[16/9] bg-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-bg-dark to-slate-700" />
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="material-symbols-outlined text-white text-[120px]">auto_stories</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-5">
              <div className="mb-2">
                <span className="text-[10px] font-bold text-primary/80 bg-primary/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  AI 에디토리얼
                </span>
              </div>
              <h1 className="text-white text-xl font-bold leading-snug">
                {lecture?.topic ?? '학습 가이드'}
              </h1>
              {lecture && (
                <p className="text-white/50 text-xs mt-1">{lecture.date} · {lecture.instructor}</p>
              )}
            </div>
          </div>
        </header>

        <main className="px-4 space-y-4">
          {/* Summary */}
          <section>
            <h3 className="text-base font-bold text-slate-900 mb-3">핵심 요약</h3>
            <div className="space-y-2.5">
              {guide.keyPoints.map((point, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-white border border-slate-100">
                  <span className="text-primary font-bold text-sm shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-sm text-slate-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Full summary */}
          <section className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>summarize</span>
              <h3 className="text-sm font-bold text-slate-900">강의 요약</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{guide.summary}</p>
          </section>

          {/* Review checklist */}
          <section className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>checklist</span>
              <h3 className="text-sm font-bold text-slate-900">복습 체크리스트</h3>
            </div>
            <div className="space-y-2.5">
              {guide.reviewPoints.map((pt, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">{pt}</p>
                </label>
              ))}
            </div>
          </section>

          {/* Concept map */}
          <section className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              <h3 className="text-sm font-bold text-slate-900">개념 맵</h3>
            </div>
            <div className="space-y-4">
              {guide.conceptMap.map((item, i) => (
                <div key={i}>
                  <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-lg mb-2">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                    <span className="text-sm font-bold">{item.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-2">
                    {item.related.map((r, j) => (
                      <span key={j} className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full">
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
