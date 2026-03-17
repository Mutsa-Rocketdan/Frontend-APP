import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BottomNav } from './components/BottomNav';
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
  return (
    <div className="app-container bg-bg-light min-h-screen flex flex-col">
      <div className="bg-white px-5 pt-12 pb-5 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900">마이페이지</h1>
      </div>
      <div className="flex-1 px-4 pt-4 pb-28 space-y-3">
        <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
          <div>
            <p className="font-bold text-slate-900">{user?.nickname || '학습자'}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full bg-white rounded-xl border border-slate-100 p-4 text-left flex items-center gap-3 text-red-400 hover:bg-red-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-sm font-semibold">로그아웃</span>
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
