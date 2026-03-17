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
    <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
      <Link to="/lectures" className="flex items-center gap-2">
        <span className="text-orange-500 font-bold text-xl tracking-tight">
          AI Quiz
        </span>
        <span className="text-zinc-400 text-sm">& 학습 가이드</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/lectures" className="text-zinc-300 hover:text-orange-500 text-sm transition-colors">
          강의 목록
        </Link>
        <Link to="/quiz-results" className="text-zinc-300 hover:text-orange-500 text-sm transition-colors">
          학습 결과
        </Link>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 text-sm">{user.nickname || user.email}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-zinc-500 hover:text-orange-500 border border-zinc-700 hover:border-orange-500 px-3 py-1.5 rounded transition-all"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
