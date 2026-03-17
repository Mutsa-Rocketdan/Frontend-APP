import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, nickname);
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.detail;
      setError(msg === 'Email already registered' ? '이미 사용 중인 이메일입니다.' : '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-orange-500 text-3xl font-bold">AI Quiz</h1>
          <p className="text-zinc-400 text-sm mt-2">강의 기반 맞춤형 퀴즈 & 학습 가이드</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-white text-xl font-semibold mb-6">회원가입</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-sm mb-2">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-sm mb-2">닉네임 (선택)</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-sm mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? '처리 중...' : '회원가입'}
            </button>
          </form>

          <p className="text-center text-zinc-500 text-sm mt-6">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-orange-500 hover:text-orange-400">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
