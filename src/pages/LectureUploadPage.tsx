import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createLecture } from '../api/lectures';
import { LikelionLogo } from '../components/LikelionLogo';

export const LectureUploadPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    week: '',
    subject: '',
    instructor: '',
    session: '',
    date: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (user && user.role !== 'admin') {
    return (
      <div className="app-container min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-[48px] text-[#DDD5C8]">lock</span>
        <p className="text-[15px] font-medium text-[#6F6A64]">관리자만 접근할 수 있습니다</p>
        <button onClick={() => navigate('/')} className="text-[13px] text-[#FF6A00] underline">돌아가기</button>
      </div>
    );
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.txt')) { setError('.txt 파일만 업로드할 수 있습니다.'); return; }
    setFile(f);
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('강의 제목을 입력해주세요.'); return; }
    if (!file) { setError('txt 파일을 업로드해주세요.'); return; }

    setLoading(true);
    setError('');
    try {
      const content = await file.text();
      const res = await createLecture({
        title: form.title.trim(),
        content,
        week: form.week ? Number(form.week) : undefined,
        subject: form.subject || undefined,
        instructor: form.instructor || undefined,
        session: form.session || undefined,
        date: form.date || undefined,
      });
      const taskId = (res.data as any).task_id;
      if (taskId) navigate(`/tasks/${taskId}`);
      else navigate('/');
    } catch {
      setError('업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  const inputClass = "w-full h-[46px] px-4 rounded-xl border border-[#DDD5C8] bg-[#FDFAF7] text-[14px] text-[#171717] placeholder:text-[#C4B8AA] focus:outline-none focus:border-[#FF6A00] transition-colors";
  const labelClass = "text-[12px] font-medium text-[#6F6A64]";

  return (
    <div className="app-container min-h-screen flex flex-col relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,115,0,0.13) 0%, rgba(255,150,50,0.06) 45%, transparent 72%)', filter: 'blur(55px)', animation: 'orb-drift-a 14s ease-in-out infinite' }} />

      {/* Top bar */}
      <div className="relative px-5 pt-12 pb-3 flex items-center justify-center anim-enter">
        <button onClick={() => navigate('/')} className="absolute left-5 flex items-center gap-1 text-[#6F6A64]">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="flex items-center gap-2.5">
          <LikelionLogo size="sm" className="!h-[34px]" />
          <div className="flex flex-col justify-center gap-[3px]">
            <span className="text-[#FF6A00] font-bold text-[15px] tracking-[-0.01em] leading-none">멋쟁이사자처럼</span>
            <span className="text-[#C0B5AD] leading-none" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 400, fontSize: '10px', letterSpacing: '0.12em' }}>AI 복습 서비스</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5 pb-12 flex flex-col gap-4 anim-enter-1 overflow-y-auto">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.03em] text-[#1A0F08]">강의 스크립트 업로드</h1>
          <p className="text-[13px] text-[#A39586] mt-1">STT 텍스트 파일(.txt)을 업로드하면 AI가 자동으로 분석합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {/* 제목 */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>강의 제목 *</label>
            <input type="text" value={form.title} onChange={set('title')} placeholder="예) Python 기초 - 변수와 자료형" className={inputClass} />
          </div>

          {/* week + session */}
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className={labelClass}>주차 (week)</label>
              <input type="number" value={form.week} onChange={set('week')} placeholder="예) 1" min={1} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className={labelClass}>세션 (session)</label>
              <input type="text" value={form.session} onChange={set('session')} placeholder="예) 1" className={inputClass} />
            </div>
          </div>

          {/* subject */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>과목 (subject)</label>
            <input type="text" value={form.subject} onChange={set('subject')} placeholder="예) Front-End" className={inputClass} />
          </div>

          {/* instructor + date */}
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className={labelClass}>강사 (instructor)</label>
              <input type="text" value={form.instructor} onChange={set('instructor')} placeholder="예) 김영아" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className={labelClass}>강의 날짜 (date)</label>
              <input type="date" value={form.date} onChange={set('date')} className={inputClass} />
            </div>
          </div>

          {/* 파일 업로드 */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>STT 파일 (.txt) *</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`w-full rounded-xl border-2 border-dashed px-5 py-6 flex flex-col items-center gap-2.5 cursor-pointer transition-colors ${
                dragging ? 'border-[#FF6A00] bg-[#FFF4EA]' : file ? 'border-[#F5C99A] bg-[#FFF8F3]' : 'border-[#DDD5C8] bg-[#FDFAF7]'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-[#FFF0E6] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px] text-[#FF6A00]">{file ? 'description' : 'upload_file'}</span>
              </div>
              {file ? (
                <div className="text-center">
                  <p className="text-[14px] font-medium text-[#1A0F08]">{file.name}</p>
                  <p className="text-[11px] text-[#A39586] mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-[13px] font-medium text-[#6F6A64]">파일을 드래그하거나 탭하여 선택</p>
                  <p className="text-[11px] text-[#C4B8AA] mt-0.5">.txt 파일만 지원</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept=".txt" className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          </div>

          {error && <p className="text-[12px] text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] rounded-xl font-semibold text-[15px] text-white transition-opacity disabled:opacity-50 mt-1"
            style={{ background: 'linear-gradient(90deg, #FF8C3A 0%, #FF6A00 50%, #D45000 100%)' }}
          >
            {loading ? '업로드 중...' : '업로드 및 분석 시작'}
          </button>
        </form>
      </div>
    </div>
  );
};
