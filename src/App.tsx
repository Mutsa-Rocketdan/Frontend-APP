import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LecturesPage } from './pages/LecturesPage';
import { LectureDetailPage } from './pages/LectureDetailPage';
import { QuizPage } from './pages/QuizPage';
import { QuizResultsPage } from './pages/QuizResultsPage';
import { StudyGuidePage } from './pages/StudyGuidePage';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><LecturesPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/lectures/:id" element={
            <ProtectedRoute>
              <Layout><LectureDetailPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/lectures/:id/guide" element={
            <ProtectedRoute>
              <Layout><StudyGuidePage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/quizzes/:id" element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          } />
          <Route path="/quiz-results" element={
            <ProtectedRoute>
              <Layout><QuizResultsPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
