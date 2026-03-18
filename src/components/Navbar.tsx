import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LikelionLogo } from './LikelionLogo';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <Link to="/">
        <LikelionLogo size="sm" />
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
