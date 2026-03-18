import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BottomNav } from './components/BottomNav';
import { AmbientBackground } from './components/AmbientBackground';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LecturesPage } from './pages/LecturesPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { LectureDetailPage } from './pages/LectureDetailPage';
import { QuizPage } from './pages/QuizPage';
import { QuizResultsPage } from './pages/QuizResultsPage';
import { StudyGuidePage } from './pages/StudyGuidePage';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.nickname || user?.email?.split('@')[0] || '학습자';

  return (
    <div className="app-container min-h-screen flex flex-col relative overflow-hidden">
      {/* 배경 orb */}
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,115,0,0.13) 0%, rgba(255,150,50,0.06) 45%, transparent 72%)', filter: 'blur(55px)', animation: 'orb-drift-a 14s ease-in-out infinite' }} />

      {/* Top bar */}
      <div className="relative px-5 pt-12 pb-3 flex items-center justify-center anim-enter">
        <div className="flex items-center gap-2.5">
          <img src="/white.png" alt="멋쟁이사자처럼 로고" className="h-[34px] w-auto object-contain" />
          <div className="flex flex-col justify-center gap-[3px]">
            <span className="text-[#FF6A00] font-bold text-[15px] tracking-[-0.01em] leading-none">멋쟁이사자처럼</span>
            <span className="text-[#C0B5AD] leading-none" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 400, fontSize: '10px', letterSpacing: '0.12em' }}>AI 복습 서비스</span>
          </div>
        </div>
      </div>

      {/* 프로필 카드 */}
      <div className="px-5 pt-8 pb-8 border-b border-[#E9E1D6] anim-enter-1 flex flex-col items-center gap-3">
        {/* 아바타 — lion2 정사각 블록 */}
        <div className="relative">
          <div className="w-[96px] h-[96px] rounded-2xl bg-[#FFF4EA] border border-[#F5C99A] overflow-hidden flex items-end justify-center">
            <img src="/lion2.png" alt="" aria-hidden className="h-[84px] w-auto object-contain" style={{ filter: 'saturate(0.9)' }} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FF6A00] rounded-full flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-[19px] font-bold tracking-[-0.02em]" style={{ color: '#2D1608' }}>{displayName}</p>
          <p className="text-[12px] text-[#B0A498]">{user?.email}</p>
          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold bg-[#FFF0E6] text-[#FF6A00] px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            멋쟁이사자 학습자
          </span>
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className="px-4 pt-4 pb-28 space-y-2 anim-enter-2">
        {[
          { icon: 'notifications', label: '알림 설정', sub: '학습 알림 관리' },
          { icon: 'help_outline', label: '도움말', sub: '자주 묻는 질문' },
          { icon: 'info', label: '앱 정보', sub: 'v1.0.0' },
        ].map((item) => (
          <button key={item.label} className="w-full bg-white rounded-xl border border-[#E9E1D6] shadow-[0_1px_4px_rgba(0,0,0,0.04)] px-4 py-3.5 flex items-center gap-3 hover:bg-[#FFF8F3] transition-colors">
            <div className="w-9 h-9 rounded-xl bg-[#FFF4EA] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px] text-[#FF6A00]">{item.icon}</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[13.5px] font-medium text-[#171717]">{item.label}</p>
              <p className="text-[11px] text-[#B0A498]">{item.sub}</p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#DDD5C8]">chevron_right</span>
          </button>
        ))}

        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full bg-white rounded-xl border border-[#E9E1D6] shadow-[0_1px_4px_rgba(0,0,0,0.04)] px-4 py-3.5 flex items-center gap-3 hover:bg-[#FFF8F3] transition-colors mt-4"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF4EA] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px] text-[#B0A498]">logout</span>
          </div>
          <p className="text-[13.5px] font-medium text-[#B0A498]">로그아웃</p>
        </button>
      </div>

      <BottomNav active="profile" />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AmbientBackground />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<ProtectedRoute><LecturesPage /></ProtectedRoute>} />
          <Route path="/curriculum" element={<ProtectedRoute><CurriculumPage /></ProtectedRoute>} />
          <Route path="/lectures/:id" element={<ProtectedRoute><LectureDetailPage /></ProtectedRoute>} />
          <Route path="/lectures/:id/guide" element={<ProtectedRoute><StudyGuidePage /></ProtectedRoute>} />
          <Route path="/quizzes/:id" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path="/quiz-results" element={<ProtectedRoute><QuizResultsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
