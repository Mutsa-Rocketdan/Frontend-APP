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
    <div className="app-container bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 pt-14 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
          <span className="text-primary font-bold text-lg tracking-tight">멋쟁이사자처럼</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-6 leading-tight">
          AI 학습 가이드로<br />더 스마트하게 복습하세요
        </h1>
        <p className="text-gray-400 text-sm mt-2">강의 스크립트 기반 자동 퀴즈 & 학습 가이드</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pb-8 flex flex-col gap-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">이메일</label>
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
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-bg-light border border-transparent focus:border-primary focus:bg-white text-gray-900 rounded-xl px-4 py-3.5 text-sm outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-500 text-sm px-3 py-2.5 rounded-xl">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all mt-1 text-sm"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-300 font-medium">또는</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Demo button */}
        <button
          onClick={handleDemoMode}
          className="w-full flex items-center justify-center gap-2 bg-bg-light hover:bg-gray-100 text-gray-600 font-medium py-3.5 rounded-xl transition-all text-sm border border-gray-100"
        >
          <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
          서버 없이 데모 모드로 체험하기
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          계정이 없으신가요?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};
