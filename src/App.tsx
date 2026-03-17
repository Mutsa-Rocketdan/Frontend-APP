import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BottomNav } from './components/BottomNav';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LecturesPage } from './pages/LecturesPage';
import { LectureDetailPage } from './pages/LectureDetailPage';
import { QuizPage } from './pages/QuizPage';
import { QuizResultsPage } from './pages/QuizResultsPage';
import { StudyGuidePage } from './pages/StudyGuidePage';

const WithNav = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    <BottomNav />
  </>
);

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  return (
    <div className="app-container bg-bg-light min-h-screen pb-24">
      <div className="bg-white px-5 pt-12 pb-6">
        <h1 className="text-xl font-bold text-gray-900">마이페이지</h1>
      </div>
      <div className="px-4 pt-5 flex flex-col gap-3">
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
          <div>
            <p className="font-bold text-gray-900">{user?.nickname || '학습자'}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white rounded-2xl p-4 shadow-sm text-left flex items-center gap-3 text-red-400"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-sm font-medium">로그아웃</span>
        </button>
      </div>
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
          <Route path="/" element={
            <ProtectedRoute><WithNav><LecturesPage /></WithNav></ProtectedRoute>
          } />
          <Route path="/my-lectures" element={
            <ProtectedRoute><WithNav><LecturesPage /></WithNav></ProtectedRoute>
          } />
          <Route path="/lectures/:id" element={
            <ProtectedRoute><LectureDetailPage /></ProtectedRoute>
          } />
          <Route path="/lectures/:id/guide" element={
            <ProtectedRoute><StudyGuidePage /></ProtectedRoute>
          } />
          <Route path="/quizzes/:id" element={
            <ProtectedRoute><QuizPage /></ProtectedRoute>
          } />
          <Route path="/quiz-results" element={
            <ProtectedRoute><WithNav><QuizResultsPage /></WithNav></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><WithNav><ProfilePage /></WithNav></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
