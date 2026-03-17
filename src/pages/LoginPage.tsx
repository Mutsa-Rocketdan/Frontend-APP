import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { LikelionLogo } from '../components/LikelionLogo';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoMode = () => {
    localStorage.setItem('access_token', 'demo_mode');
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      await login(res.data.access_token);
      navigate('/');
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <LikelionLogo size="md" text="멋사 부트캠프" />
          <p className="text-gray-500 text-sm mt-2">AI 복습 퀴즈 & 학습 가이드</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-gray-900 text-lg font-bold mb-5">로그인</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#FF6B00] focus:bg-white text-gray-900 rounded-lg px-4 py-3 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#FF6B00] focus:bg-white text-gray-900 rounded-lg px-4 py-3 text-sm outline-none transition-all"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B00] hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-lg transition-colors"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-5">
            계정이 없으신가요?{' '}
            <Link to="/register" className="text-[#FF6B00] font-medium hover:underline">
              회원가입
            </Link>
          </p>

          <div className="border-t border-gray-100 mt-5 pt-5">
            <button
              onClick={handleDemoMode}
              className="w-full border border-gray-200 hover:border-[#FF6B00] text-gray-500 hover:text-[#FF6B00] text-sm py-2.5 rounded-lg transition-all"
            >
              🔍 서버 없이 데모 모드로 체험하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
