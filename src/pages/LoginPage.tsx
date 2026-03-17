import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoMode = () => {
    localStorage.setItem('access_token', 'demo_mode');
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <div className="app-container bg-bg-light min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/25">
            <span className="material-symbols-outlined text-white text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">멋쟁이사자처럼</h1>
          <p className="mt-3 text-base font-medium leading-relaxed text-slate-500 px-4">
            기술을 넘어, AI로 완성하는<br/>완벽한 복습 경험
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 ml-0.5">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="이메일 주소를 입력하세요"
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-300 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 ml-0.5">비밀번호</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="비밀번호를 입력하세요"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 pr-12 text-slate-900 placeholder:text-slate-300 focus:border-primary outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPw ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-4 text-base font-bold text-white shadow-xl shadow-primary/25 hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-60 mt-2"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-bg-light px-4 text-xs text-slate-400 font-medium">또는 다른 방법으로 시작하기</span>
          </div>
        </div>

        {/* Social / demo buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDemoMode}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:border-primary/40 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
              카카오
            </button>
            <button
              onClick={handleDemoMode}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:border-primary/40 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-500">mail</span>
              이메일
            </button>
          </div>
          <button
            onClick={handleDemoMode}
            className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white py-3 text-sm font-medium text-slate-500 hover:border-primary/40 hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
            서버 없이 데모 모드로 체험하기
          </button>
        </div>

        <p className="text-center text-sm text-slate-500">
          아직 계정이 없으신가요?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">회원가입</Link>
        </p>
      </div>
    </div>
  );
};
