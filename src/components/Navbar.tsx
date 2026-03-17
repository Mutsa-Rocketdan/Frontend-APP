import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <Link to="/" className="flex items-center gap-2">
        {/* 멋쟁이사자처럼 스타일 로고 */}
        <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="8" height="24" fill="#FF6B00" />
          <rect x="0" y="17" width="28" height="7" fill="#FF6B00" />
          <rect x="20" y="0" width="8" height="11" fill="#FF6B00" />
        </svg>
        <div className="leading-none">
          <span className="font-black text-base text-[#FF6B00] tracking-tight">AI Quiz</span>
          <span className="text-gray-400 text-xs ml-1 hidden sm:inline">& 학습가이드</span>
        </div>
      </Link>

      <div className="flex items-center gap-1 md:gap-4">
        <Link to="/" className="text-gray-600 hover:text-[#FF6B00] text-sm px-2 py-1 rounded transition-colors hidden md:block">
          강의 목록
        </Link>
        <Link to="/quiz-results" className="text-gray-600 hover:text-[#FF6B00] text-sm px-2 py-1 rounded transition-colors hidden md:block">
          학습 현황
        </Link>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs hidden sm:block">{user.nickname || user.email}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-[#FF6B00] border border-gray-200 hover:border-[#FF6B00] px-3 py-1.5 rounded-lg transition-all"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-[#FF6B00] hover:bg-orange-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
          >
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
};
