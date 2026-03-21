import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTaskPoller } from '../hooks/useTaskPoller';
import { LikelionLogo } from '../components/LikelionLogo';

const STATUS_LABEL: Record<string, string> = {
  pending: '대기 중',
  processing: '분석 중',
  completed: '완료',
  failed: '실패',
};

export const TaskPollingPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const task = useTaskPoller(taskId);
  const displayTask = task;

  useEffect(() => {
    if (displayTask?.status === 'completed') {
      setTimeout(() => navigate('/'), 1200);
    }
  }, [displayTask?.status, navigate]);

  return (
    <div className="app-container min-h-screen flex flex-col relative overflow-hidden">
      {/* 배경 orb */}
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,115,0,0.13) 0%, rgba(255,150,50,0.06) 45%, transparent 72%)', filter: 'blur(55px)', animation: 'orb-drift-a 14s ease-in-out infinite' }} />

      {/* Top bar */}
      <div className="relative px-5 pt-12 pb-3 flex items-center justify-center anim-enter">
        <div className="flex items-center gap-2.5">
          <LikelionLogo size="sm" className="!h-[34px]" />
          <div className="flex flex-col justify-center gap-[3px]">
            <span className="text-[#FF6A00] font-bold text-[15px] tracking-[-0.01em] leading-none">멋쟁이사자처럼</span>
            <span className="text-[#C0B5AD] leading-none" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 400, fontSize: '10px', letterSpacing: '0.12em' }}>AI 복습 서비스</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8 anim-enter-1">

        {/* 완료 상태 */}
        {displayTask?.status === 'completed' ? (
          <>
            <div className="w-20 h-20 rounded-2xl bg-[#FFF4EA] border border-[#F5C99A] flex items-center justify-center">
              <span className="material-symbols-outlined text-[40px] text-[#FF6A00]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div className="text-center">
              <p className="text-[20px] font-bold tracking-[-0.03em] text-[#1A0F08]">분석 완료!</p>
              <p className="text-[13px] text-[#A39586] mt-1">강의 목록으로 이동합니다</p>
            </div>
          </>
        ) : displayTask?.status === 'failed' ? (
          <>
            <div className="w-20 h-20 rounded-2xl bg-[#FFF4EA] border border-[#F5C99A] flex items-center justify-center">
              <span className="material-symbols-outlined text-[40px] text-[#B0A498]">error</span>
            </div>
            <div className="text-center">
              <p className="text-[18px] font-bold tracking-[-0.02em] text-[#1A0F08]">분석 실패</p>
              <p className="text-[13px] text-[#A39586] mt-1">오류가 발생했습니다. 다시 업로드해주세요.</p>
            </div>
            <button
              onClick={() => navigate('/upload')}
              className="h-[48px] px-8 rounded-xl font-semibold text-[14px] text-white"
              style={{ background: 'linear-gradient(90deg, #FF8C3A 0%, #FF6A00 50%, #D45000 100%)' }}
            >
              다시 업로드
            </button>
          </>
        ) : (
          <>
            {/* 로딩 아이콘 */}
            <div className="w-20 h-20 rounded-2xl bg-[#FFF4EA] border border-[#F5C99A] flex items-center justify-center">
              <span className="material-symbols-outlined text-[40px] text-[#FF6A00]"
                style={{ animation: 'spin 1.8s linear infinite' }}>autorenew</span>
            </div>

            <div className="text-center">
              <p className="text-[20px] font-bold tracking-[-0.03em] text-[#1A0F08]">AI 분석 중</p>
              <p className="text-[13px] text-[#A39586] mt-1">
                강의 내용을 분석하고 개념을 추출하고 있어요
              </p>
            </div>

            {/* 진행률 바 */}
            <div className="w-full max-w-[280px]">
              <div className="flex justify-between text-[11px] text-[#A39586] mb-2">
                <span>{STATUS_LABEL[displayTask?.status ?? 'pending']}</span>
                <span>{displayTask?.progress ?? 0}%</span>
              </div>
              <div className="h-2.5 bg-[#EDE6DE] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${task?.progress ?? 0}%`,
                    background: 'linear-gradient(90deg, #FFAA5C 0%, #FF6A00 60%, #E05000 100%)'
                  }}
                />
              </div>
            </div>

            <p className="text-[11px] text-[#C4B8AA] text-center">
              잠시 기다려주세요. 페이지를 닫아도 분석은 계속됩니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
