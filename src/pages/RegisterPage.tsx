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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, nickname);
      navigate('/login');
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail === 'Email already registered' ? '이미 사용 중인 이메일입니다.' : '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 pt-12 pb-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined text-gray-700 text-[24px]">arrow_back</span>
        </button>
      </div>

      <div className="px-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">회원가입</h1>
        <p className="text-gray-400 text-sm mt-1">AI 복습 퀴즈 & 학습 가이드 시작하기</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pb-8 flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">이메일 *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
              className="w-full bg-bg-light border border-transparent focus:border-primary focus:bg-white text-gray-900 rounded-xl px-4 py-3.5 text-sm outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              닉네임 <span className="text-gray-300 normal-case font-normal">(선택)</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              className="w-full bg-bg-light border border-transparent focus:border-primary focus:bg-white text-gray-900 rounded-xl px-4 py-3.5 text-sm outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">비밀번호 *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="6자 이상 입력하세요"
              minLength={6}
              className="w-full bg-bg-light border border-transparent focus:border-primary focus:bg-white text-gray-900 rounded-xl px-4 py-3.5 text-sm outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-500 text-sm px-3 py-2.5 rounded-xl">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          <div className="flex-1" />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-sm"
          >
            {loading ? '처리 중...' : '가입 완료'}
          </button>

          <p className="text-center text-gray-400 text-sm">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
