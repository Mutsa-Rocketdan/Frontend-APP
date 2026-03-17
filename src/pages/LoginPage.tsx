import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg width="36" height="32" viewBox="0 0 36 32" fill="none">
              <rect x="0" y="0" width="10" height="32" fill="#FF6B00" />
              <rect x="0" y="23" width="36" height="9" fill="#FF6B00" />
              <rect x="26" y="0" width="10" height="14" fill="#FF6B00" />
            </svg>
            <span className="font-black text-2xl text-[#FF6B00] tracking-tight">AI Quiz</span>
          </div>
          <p className="text-gray-500 text-sm">강의 기반 맞춤형 퀴즈 & 학습 가이드</p>
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
        </div>
      </div>
    </div>
  );
};
